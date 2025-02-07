import { D1Database } from '@cloudflare/workers-d1';

/**
 * POST /api/submit
 */
export async function onRequestPost(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    let input = await context.request.formData();

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

    // Initialize D1 database
    const db = new D1Database(context.env.D1_DATABASE);

    // Prepare SQL query to insert data into the database
    const sql = `INSERT INTO submissions (username, email) VALUES (?, ?)`;
    const params = [output.username, output.email];

    // Execute SQL query
    await db.execute(sql, params);

    // Return success response
    return new Response(JSON.stringify({ message: 'Form submitted successfully' }), {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 400 });
  }
}
