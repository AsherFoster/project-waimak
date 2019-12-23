import Vue from 'vue';
import VueApollo from 'vue-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import httpLink from '@/graphql/http-link';

// Cache implementation
const cache = new InMemoryCache({
  dataIdFromObject: (o) => o.id
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

// Install the vue plugin
Vue.use(VueApollo);

export default new VueApollo({
  defaultClient: apolloClient,
});
