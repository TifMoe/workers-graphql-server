class WorkersKV {
  get(key) {
    return TEMPDATA.get(key)
  }

  async listKeys(prefix) {
    const value = await TEMPDATA.list({"prefix": prefix})
    const keys = await value.keys; // [] keys
    return keys
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
