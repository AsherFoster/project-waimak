import {createHttpLink} from 'apollo-link-http';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql',
});

export default httpLink;
