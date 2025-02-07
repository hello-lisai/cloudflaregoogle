addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const clientIP = request.headers.get('cf-connecting-ip');

    if (request.method === 'POST') {
        const formData = await request.formData();
        const username = formData.get('username');
        const email = formData.get('email');
        const recaptchaResponse = formData.get('recaptcha_response');

        // 验证 reCAPTCHA
        const secretKey = '6LeEjc8qAAAAAGTeC-GBehTB7E1B7uUvYgrVzDB-'; // 替换为您的密钥
        const verificationResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${recaptchaResponse}&remoteip=${clientIP}`
        });

        const verificationResult = await verificationResponse.json();

        if (verificationResult.success) {
            // 处理表单数据，例如存储到数据库
            return new Response(`表单提交成功！IP地址：${clientIP}`, { status: 200 });
        } else {
            return new Response('reCAPTCHA 验证失败！', { status: 400 });
        }
    }

    return new Response('只支持 POST 请求', { status: 405 });
}
