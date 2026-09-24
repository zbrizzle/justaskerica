exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
        }

          try {
              const { email } = JSON.parse(event.body);
                  if (!email) return { statusCode: 400, body: 'Missing email' };

                      const PUB_ID = process.env.BEEHIIV_PUB_ID;
                          const API_KEY = process.env.BEEHIIV_API_KEY;

                              const res = await fetch(
                                    `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
                                          {
                                                  method: 'POST',
                                                          headers: {
                                                                    'Content-Type': 'application/json',
                                                                             'Authorization': `Bearer ${API_KEY}`
                                                                                      },
                                                                                              body: JSON.stringify({ email, reactivate_existing: true })
                                                                                                    }
                                                                                                        );
                                                                                                        
                                                                                                            const data = await res.json();
                                                                                                                return {
                                                                                                                      statusCode: res.ok ? 200 : res.status,
                                                                                                                            headers: { 'Access-Control-Allow-Origin': '*' },
                                                                                                                                  body: JSON.stringify(data)
                                                                                                                                      };
                                                                                                                                        } catch (err) {
                                                                                                                                            return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
                                                                                                                                              }
                                                                                                                                              };
