import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Key prefix to namespace momentum data in shared database
const PREFIX = 'momentum';

export const keys = {
  contacts: `${PREFIX}:contacts`,
  contact: (id: string) => `${PREFIX}:contact:${id}`,
  settings: `${PREFIX}:settings`,
  outreach: `${PREFIX}:outreach`,
  outreachEntry: (id: string) => `${PREFIX}:outreach:${id}`,
};
