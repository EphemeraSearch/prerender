const level = require('level-party');
const root = require('app-root-path');
const util = require(root.path + '/lib/util.js');

const levelTtl = require('level-ttl');
const db = levelTtl(level(root.path + '/db', { valueEncoding: 'json' }));
// Unfortunately, level-ttl doesn't return promises
const { promisify } = require('util');
const get = promisify(db.get.bind(db));
const put = promisify(db.put.bind(db));

module.exports = {
  get: (key, ...rest) => {
    let msg;
    if (!key) {
      msg = `[levelCache] NOT getting; key is empty: '${key}' options=${options} value=`;
      util.warn(msg, valueCopy);
      return Promise.reject(new Error('not getting; key is empty'));
    }
    if (!key?.startsWith('https://')) {
      msg = `[levelCache] NOT getting; key doesn't start with https://: '${key}' options=${options} value=`;
      util.warn(msg, valueCopy);
      return Promise.reject(new Error(msg));
    }
    util.log(`[levelCache] getting '${key}'  rest=${rest}`);
    return get(key);
  },
  set: (key, value, options) => {
    // make a copy of value with structuredClone so we can print with a truncated content key
    const valueCopy = structuredClone(value);
    // const valueCopy = JSON.parse(JSON.stringify(value));
    valueCopy.content = valueCopy.content?.slice(0, 200);
    if (valueCopy.content?.length < value.content?.length) {
      valueCopy.content += `... (${value.content?.length - valueCopy.content?.length} more bytes)`;
    }
    let msg;
    if (!key) {
      msg = `[levelCache] NOT setting; key is empty: '${key}' options=${options} value=`;
      util.warn(msg, valueCopy);
      return Promise.reject(new Error('not setting; key is empty'));
    }
    if (!key?.startsWith('https://')) {
      msg = `[levelCache] NOT setting; key doesn't start with https://: '${key}' options=${options} value=`;
      util.warn(msg, valueCopy);
      return Promise.reject(new Error(msg));
    }
    util.log(`[levelCache] setting key=${key}`, valueCopy, options);
    return put(key, value, options);
  },
};
