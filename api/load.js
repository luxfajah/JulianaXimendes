import { createClient } from 'redis';

export default async function handler(req, res) {
  let client;
  try {
    const url = process.env.REDIS_URL || 'redis://default:YpxigeuX75iY6FvCubASt2ruLVBKImHF@redis-10083.c92.us-east-1-3.ec2.cloud.redislabs.com:10083';
    client = createClient({ url });
    await client.connect();

    const rawData = await client.get('ximenas_data');
    if (!rawData) {
      return res.status(200).json({ statuses: {}, comments: {} });
    }

    const data = JSON.parse(rawData);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Load Error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    if (client) {
      try {
        await client.disconnect();
      } catch (err) {
        console.error('Disconnect Error:', err);
      }
    }
  }
}
