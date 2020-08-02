const { ApolloServer } = require('apollo-server-cloudflare')
const { graphqlCloudflare } = require('apollo-server-cloudflare/dist/cloudflareApollo')

const WorkersKV = require('../datasources/kv')
const resolvers = require('../resolvers');
const typeDefs = require('../schema')

const locationPrefix = "location-"

const dataSources = () => ({
  workersKV: new WorkersKV(),
  locationPrefix: locationPrefix,
})

const createServer = graphQLOptions =>
  new ApolloServer({
    typeDefs,
    resolvers,
    engine: {    
      graphVariant: "current"
    },
    introspection: true,
    dataSources,
  })

const handler = (request, graphQLOptions) => {
  const server = createServer(graphQLOptions)
  console.log("HERES A THING!!!!!")
  return graphqlCloudflare(() => server.createGraphQLServerOptions(request))(request)
}

module.exports = handler
