require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    const resumeContext = `
    - Keep answers short and to the point. No longer than 2 sentences. 
    - Dont talk about anything other than my experience that follows.
    - Senior Full Stack Developer with experience across frontend, backend, and DevOps; strong in high-scale system architecture and API design.
    - Self-taught developer, started by customizing WordPress websites in 2015 before transitioning into full-scale application development.
    - Studied Marketing at the University of South Florida (Class of 2020) and discovered a passion for software engineering.
    - At Olympia Pharmaceuticals, led architecture for a LAMP-based ecommerce platform (CodeIgniter 3, AWS EC2, Cloudflare, New Relic), achieving 99% uptime and helping drive $1M/day in revenue.
    - Built high-volume prescription printing logic (2500+ jobs/day), React + Node.js frontend overhaul, and customer-facing order tracking system.
    - Refactored login system with lockout, reset automation, and branded email templates—cutting support tickets by 20%.
    - At Homeport Travel, created a full-stack containerized cruise booking platform using React, Node.js, CodeIgniter 4, and Docker.
    - Developed 50+ component UI library, a blog for cruisers, a Recharts-based business dashboard, and React SSR pages for SEO.
    - Passionate about cruising — Homeport is the start of a dream to build a world-class cruise deal platform. Next cruise: December 2025.
    - Creator of side projects like “Flight Tracker” (Flask + Next.js, using AviationStack API) and “Ask Me Anything” chatbot (Vite + Lovable).
    - Part-time photographer, formerly active at local Orlando clubs.
    - Interests include: football (Miami Dolphins), hockey (Florida Panthers), Twitch TV, gym, movies, AI, learning, and family life.
    - Tech stack: React, TypeScript, Node.js, PHP (CodeIgniter 3/4), Python (Flask/Django), MySQL, Docker, Git, AWS (EC2, SES, CloudWatch), MongoDB, Postman, Selenium, PhpStorm.
    - Certified in AWS Cloud Practitioner, Python Zero-to-Hero, SQL Zero-to-Hero, and Tableau Data Science.
    - HubSpot IT Experience, working with properties, forms, contacts + Hubspot API. 
    - API onboarding experience + REST API documentation. Enjoys mentoring other developers, making guides, video tutorials.
    - MySql + MariaDb experience. I use SQLyog as my sql editor.
    `;

    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "mistralai/mistral-7b-instruct",  // or "meta-llama/llama-3-8b-instruct"
            messages: [
                { role: "system", content: resumeContext },
                { role: "user", content: question }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        // const response = await axios.post(
        //     'https://api.openai.com/v1/chat/completions',
        //     {
        //         model: 'gpt-3.5-turbo',
        //         messages: [
        //             { role: 'system', content: `You are a helpful AI assistant trained on the following resume:\n${resumeContext}` },
        //             { role: 'user', content: question }
        //         ],
        //         temperature: 0.7
        //     },
        //     {
        //         headers: {
        //             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        //             'Content-Type': 'application/json'
        //         }
        //     }
        // );

        res.json({ answer: response.data.choices[0].message.content.trim() });
    } catch (err) {
        console.error('OpenAI error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
