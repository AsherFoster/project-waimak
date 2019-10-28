import {ApolloLink, concat, NextLink, Operation, RequestHandler} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {API_BASE} from '@/constants';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: API_BASE + '/graphql',
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
