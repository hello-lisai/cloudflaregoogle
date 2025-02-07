/**
 * POST /api/submit
 */
export async function onRequestPost({ request, env }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    let input = await request.formData();

    // Convert FormData to JSON
    let output = {};
    for (let [key, value] of input) {
      let tmp = output[key];
      if (tmp === undefined) {
        output[key] = value;
      } else {
        output[key] = [].concat(tmp, value);
      }
    }

    // Extract user's IP address
    const userIp = request.headers.get('cf-connecting-ip') || 'unknown';

    // Initialize D1 database
    const db = env.D1_DATABASE;

    // Prepare SQL query to insert data into the database
    const sql = `INSERT INTO submissions (username, email) VALUES (?, ?)`;
    const params = [userIp, output.email];

    // Execute SQL query
    await db.prepare(sql).bind(...params).run();

    // Return success response
    return new Response(JSON.stringify({ message: 'Form submitted successfully' }), {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(`Error: ${err.message}`, { status: 400 });
  }
}
