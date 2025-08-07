require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
const axios = require('axios');
// const app = express();
//
// const corsOptions = {
//     origin: 'https://garzn.com',
//     methods: ['POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
//
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
// app.use(express.json());
//
// app.listen(3000, '0.0.0.0', () => {
//     console.log(`✅ Server listening on 0.0.0.0:3000`);
// });

const fastify = require('fastify')({ logger: {level: "error"}, trustProxy: true })
const PORT = process.env.PORT || 3000
fastify.register(require('@fastify/cors'))

fastify.get('/', function (req, reply) {
    console.log('hello');
    return { hello: "from nodejs" }
})
fastify.get('/401', function (req, reply) {
    return reply.code(401).header('Content-Type', 'application/json; charset=utf-8').send({ hello: '401' })
})

fastify.get('/health', function (req, reply) {
    return reply.send('🟢 AMA API is up')
})

// POST /api/ask
fastify.post('/api/ask', async (request, reply) => {
    const { question } = request.body
    console.log('[ASK]', question); // ✅ log the question to terminal
    const resumeContext = `
You are answering as me, in first person. Be concise (max 2 sentences), natural, and casual.

I'm a Senior Full Stack Developer since 2015, starting with WordPress and growing into full-scale apps. I studied Marketing at USF ('20), but fell in love with software.

At Olympia Pharmaceuticals, I led the LAMP-based ecommerce stack (CodeIgniter 3, AWS EC2, Cloudflare, New Relic), built high-volume printing logic (2,500+ jobs/day)

At Homeport Travel, I built a full-stack cruise booking platform (React, Node.js, CodeIgniter 4, Docker), including a 50+ component UI library.

Stack: React, TypeScript, Node.js, PHP (CI3/4), Python (Flask/Django), MySQL, Docker, Git, AWS (EC2, SES, CloudWatch), MongoDB, Postman, Selenium.

Also worked with HubSpot APIs, forms, contact properties, and automation. I enjoy mentoring, writing guides, and building systems.
`;
    try {
        console.log('[ENV] KEY:', process.env.OPENROUTER_API_KEY);
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-4o',
                messages: [
                    { role: 'system', content: resumeContext },
                    { role: 'user', content: question }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'AMA-Fastify-Client/1.0', // Fixes 401 from upstream providers
                    'HTTP-Referer': 'https://garzn.com',     // Optional, helps with ranking
                    'X-Title': 'George AMA Bot'              // Optional, helps with ranking
                }
            }
        )


        const answer = response.data.choices[0].message.content.trim()
        return reply.send({ answer })
    } catch (err) {
        fastify.log.error('OpenRouter error:', err?.response?.data || err?.message || err)
        return reply.status(500).send({
            error: 'Failed to get response from OpenRouter',
            details: err?.response?.data || err?.message || 'Unknown error'
        })
    }
})
const start = async () => {
    try {
        await fastify.listen({
            host: '0.0.0.0',
            port: PORT
        })
        console.log('Server listening on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()