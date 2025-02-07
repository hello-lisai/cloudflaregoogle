addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method === 'POST') {
        return new Response('你好', { status: 200 });
    }
    return new Response('只支持 POST 请求', { status: 405 });
}
