export default async function handler(req, res) {
  const SUPABASE_URL = 'https://xbiwxbnrrxbbaoroanci.supabase.co';

  const targetUrl =
      SUPABASE_URL +
      req.url.replace(/^\/api\/proxy/, '');

  const headers = { ...req.headers };

  delete headers.host;
  delete headers['content-length'];

  const options = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    options.body =
        typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body ?? {});
  }

  try {
    const response = await fetch(targetUrl, options);

    const data = Buffer.from(
      await response.arrayBuffer()
    );

    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    return res
        .status(response.status)
        .send(data);
  } catch (error) {
    return res.status(502).json({
      error: 'Supabase proxy failed',
      message: error.message,
    });
  }
}
