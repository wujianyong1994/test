import * as Redis from 'ioredis'
const config = require('../config.json')
const redis = new Redis(config.redis);
export {redis}