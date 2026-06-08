import { createClient } from 'redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { data, username, token } = req.body;
  
  // 1. Camada de Segurança simples
  if (!username || !token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  let client;
  try {
    const url = process.env.REDIS_URL || 'redis://default:YpxigeuX75iY6FvCubASt2ruLVBKImHF@redis-10083.c92.us-east-1-3.ec2.cloud.redislabs.com:10083';
    client = createClient({ url });
    await client.connect();

    await client.set('ximenas_data', JSON.stringify(data));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save Error:', error);
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
