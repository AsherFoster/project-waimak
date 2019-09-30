import {ApolloLink, concat, NextLink, Operation, RequestHandler} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.NODE_ENV === 'prod' ? 'http://api.canal.pointless.me/graphql' : 'http://localhost:4080/graphql',
});

const authMiddleware = new ApolloLink(((operation: Operation, forward?: NextLink) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('auth_token') || null,
    }
  });

  return forward && forward(operation);
}) as RequestHandler);

export default concat(authMiddleware, httpLink);
