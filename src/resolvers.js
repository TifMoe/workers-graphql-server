module.exports = {
  Query: {
    getLocation: async (_source, { id }, { dataSources }) => {
      console.log("In the getLocation")
      const key = dataSources.locationPrefix + id
      const data = await dataSources.workersKV.get(key);
      const result = await JSON.parse(data);
      return {
          id: result.id,
          name: result.city,
          latitude: result.latitude,
          longitude: result.longitude,
          months: result.values.length,
          minTemp: getMinTemp(result.values),
          maxTemp: getMaxTemp(result.values),
      };
    },
    getLocations: async (_source, {}, { dataSources }) => {
      console.log("In the getLocations")

      const data = await dataSources.workersKV.getAllPrefix(dataSources.locationPrefix)
      const all = []
      for (var i = 0; i < data.length; i++) {
        location = {
          id: data[i].id,
          name: data[i].city,
          latitude: data[i].latitude,
          longitude: data[i].longitude,
          months: data[i].values.length,
          minTemp: getMinTemp(data[i].values),
          maxTemp: getMaxTemp(data[i].values),
        }
        all.push(location)
      }
      return {
        locations: all,
      }
    },
    getAllLocations: async (_source, {}, { dataSources }) => {
      console.log("In the allLocations")

      // Fetch list of everything with prefix "location-"
      const value = await TEMPDATA.list({"prefix": dataSources.locationPrefix})
      // Get the keys for all matching objects
      const keys = await value.keys; // [] keys
      // Generate array of promises to fetch data from each key
      const locationMap = keys.map(async (key) => {
        const data = await dataSources.workersKV.get(key);
        const result = await JSON.parse(data);
        return {
          id: result.id,
          name: result.city,
          latitude: result.latitude,
          longitude: result.longitude,
          months: result.values.length,
          minTemp: getMinTemp(result.values),
          maxTemp: getMaxTemp(result.values),
        };
      });
      // Wait for all the promises to execute
      const results = await Promise.all(locationMap);
      return {
        locations: results
      };
    },
    getWeather: async (_source, { location }, { dataSources }) => {
      const key = dataSources.locationPrefix + location
      const data = await dataSources.workersKV.get(key);
      const result = await JSON.parse(data);
      const months = []
      for (var i = 0; i < result.values.length; i++) {
        month = {
          location: location,
          month: result.values[i].period,
          temp: result.values[i].temp,
          minTemp: result.values[i].minTemp,
          maxTemp: result.values[i].maxTemp,
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

function getMinTemp(data) {
  return data.reduce((min, p) => p.mint < min ? p.mint : min, data[0].mint);
}

function getMaxTemp(data) {
  return data.reduce((max, p) => p.maxt > max ? p.maxt : max, data[0].maxt);
}
