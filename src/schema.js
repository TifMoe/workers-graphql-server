const { gql } = require('apollo-server-cloudflare')

module.exports = gql`
  type Location {
		id: ID!
		name: String!
    latitude: Float!
    longitude: Float!
    observations: Int!
    tempRange: [Float]!
    monthRange: [String]!
  }

  type Observation {
    location: String!
    date: String!
    month: String!
    year: Int!
    temp: Float!
    minTemp: Float!
    maxTemp: Float!
    precipcover: Float!
    precip: Float!
    cloudcover: Float!
  }

  type Query {
    location(id: ID!): Location
    locations: [Location]
    weather(location: String!): [Observation]
  }
`
