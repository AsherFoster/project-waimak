import Vue from 'vue';
import VueApollo from 'vue-apollo';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import schemaLink from '@/graphql/schema-link';

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: schemaLink,
  cache,
});

// Install the vue plugin
Vue.use(VueApollo);

export default new VueApollo({
  defaultClient: apolloClient,
});
