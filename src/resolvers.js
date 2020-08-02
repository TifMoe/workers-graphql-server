module.exports = {
  Query: {
    location: async (_source, { id }, { dataSources }) => {
      const key = dataSources.locationPrefix + id
      const data = await dataSources.workersKV.get(key);
      const result = await JSON.parse(data);
      return {
          id: result.id,
          name: result.city,
          latitude: result.latitude,
          longitude: result.longitude,
          observations: result.values.length,
          tempRange: getTempRange(result.values),
          monthRange: getMonthRange(result.values),
      };
    },
    locations: async (_source, {}, { dataSources }) => {
      // Fetch list of keys with prefix "location-"
      const keys = await dataSources.workersKV.listKeys(dataSources.locationPrefix)

      // Wait for all the promises to execute fetch of location data from each key
      const results = await Promise.all(
        keys.map(async (key) => {
          const data = await dataSources.workersKV.get(key.name);
          const result = await JSON.parse(data);
          return {
            id: result.id,
            name: result.city,
            latitude: result.latitude,
            longitude: result.longitude,
            observations: result.values.length,
            tempRange: getTempRange(result.values),
            monthRange: getMonthRange(result.values),
          }
        })
      )
      return results
    },
    weather: async (_source, { location }, { dataSources }) => {
      const key = dataSources.locationPrefix + location
      const data = await dataSources.workersKV.get(key);
      const result = await JSON.parse(data);

      // TODO: more efficient way to reduce list of objects
      // TODO: filter on values to query subset dates
      const months = []
      for (var i = 0; i < result.values.length; i++) {
        monthYear = result.values[i].period.split(" ")
        month = {
          location: location,
          date: new Date(result.values[i].period).toISOString().substring(0, 10),
          month: monthYear[0],
          year: monthYear[1],
          temp: result.values[i].temp,
          minTemp: result.values[i].mint,
          maxTemp: result.values[i].maxt,
          precipcover: result.values[i].precipcover,
          precip: result.values[i].precip,
          cloudcover: result.values[i].precip,
        }
        months.push(month)
      }
      return months
    },
  },
}

function getMonthRange(data) {
  const minDate = data.reduce((min, p) => new Date(p.period) < min ? new Date(p.period) : min, new Date(data[0].period));
  const maxDate = data.reduce((max, p) => new Date(p.period) > max ? new Date(p.period) : max, new Date(data[0].period));
  return [minDate.toISOString().substring(0, 10), maxDate.toISOString().substring(0, 10)]
}

function getTempRange(data) {
  const minTemp = data.reduce((min, p) => p.mint < min ? p.mint : min, data[0].mint);
  const maxTemp = data.reduce((max, p) => p.maxt > max ? p.maxt : max, data[0].maxt);
  return [minTemp, maxTemp]
}
