class WorkersKV {
  get(key) {
    return TEMPDATA.get(key)
  }

  async getAllPrefix(prefix) {
    const value = await TEMPDATA.list({"prefix": prefix})
    const keys = await value.keys; // [] keys
    const getLocation = keys.map(async (key) => {
      const data = await this.get(key);
      const result = await JSON.parse(data);
      return result;
    });
    const results = await Promise.all(getLocation);
    return results;
  }

  set(key, value, options) {
    const opts = {}
    const ttl = options && options.ttl
    if (ttl) {
      opts.expirationTtl = ttl
    }
    return TEMPDATA.put(key, value, opts)
  }
}

module.exports = WorkersKV
