import schemaSource from '@/graphql/schema.graphql';
import {addMockFunctionsToSchema, makeExecutableSchema} from 'graphql-tools';
import SchemaLink from 'apollo-link-schema';

const schema = makeExecutableSchema({ typeDefs: schemaSource });
addMockFunctionsToSchema({
  schema,
});

export default new SchemaLink({ schema });
