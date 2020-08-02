const { gql } = require('apollo-server-cloudflare')

module.exports = gql`
  type Location {
		id: ID!
		name: String!
    latitude: Float!
    longitude: Float!
    months: Int!
    minTemp: Float!
    maxTemp: Float!
  }

  type Locations {
		locations: [Location]!
	}

  type Period {
    location: String
    month: String
    year: Int
    temp: Float!
    minTemp: Float!
    maxTemp: Float!
    precipcover: Float!
    precip: Float!
    cloudcover: Float!
  }

  type Periods {
    months: [Period]!
  }

  type Query {
    getLocation(id: ID!): Location
    getLocations: Locations
    getAllLocations: Locations
    getWeather(location: String!): [Period]
  }
`
