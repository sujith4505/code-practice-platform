const { Redis } = require('@upstash/redis');

class MemoryRedis {
  constructor() {
    this.store = {};
    console.log('Redis initialized in fallback In-Memory Mode.');
  }

  async zadd(key, score, member) {
    if (!this.store[key]) this.store[key] = [];
    const scoreNum = parseFloat(score);
    const index = this.store[key].findIndex(item => item.member === member);
    if (index > -1) {
      this.store[key][index].score = scoreNum;
    } else {
      this.store[key].push({ score: scoreNum, member });
    }
    return 1;
  }

  async zrevrange(key, start, stop, options = {}) {
    if (!this.store[key]) return [];
    const sorted = [...this.store[key]].sort((a, b) => b.score - a.score);
    const sliced = sorted.slice(start, stop === -1 ? undefined : stop + 1);
    
    if (options.withScores) {
      // Return array of alternating elements [member, score, member, score...]
      const res = [];
      for (const item of sliced) {
        res.push(item.member, item.score);
      }
      return res;
    }
    return sliced.map(item => item.member);
  }

  async zscore(key, member) {
    if (!this.store[key]) return null;
    const item = this.store[key].find(i => i.member === member);
    return item ? item.score : null;
  }

  async zrevrank(key, member) {
    if (!this.store[key]) return null;
    const sorted = [...this.store[key]].sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex(i => i.member === member);
    return rank > -1 ? rank : null;
  }

  async zcard(key) {
    if (!this.store[key]) return 0;
    return this.store[key].length;
  }
}

let redisClient;

const redisUrl = process.env.REDIS_URL;
if (redisUrl && redisUrl.startsWith('http')) {
  try {
    // Upstash Redis uses url and token
    redisClient = new Redis({
      url: redisUrl,
      token: process.env.REDIS_TOKEN || '',
    });
    console.log('Redis connected successfully using Upstash Redis Client.');
  } catch (error) {
    console.error('Failed to initialize Upstash Redis, falling back to In-Memory. Error:', error.message);
    redisClient = new MemoryRedis();
  }
} else {
  redisClient = new MemoryRedis();
}

module.exports = redisClient;
