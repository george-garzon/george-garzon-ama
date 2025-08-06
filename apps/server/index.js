require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

const corsOptions = {
    origin: 'https://garzn.com',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    const resumeContext = `
        You are answering questions *as me*, in the first person.
        
        Guidelines:
        - Keep answers short and to the point (max 2 sentences).
        - Don’t mention anything outside of my experience unless asked explicitly.
        - Speak naturally, like you're casually talking about your own work.
        
        My Background:
        I'm a Senior Full Stack Developer with experience across frontend, backend, and DevOps. I started in 2015 by customizing WordPress sites before diving into full-scale app development. I studied Marketing at the University of South Florida (Class of 2020) but fell in love with software engineering along the way.
        
        At Olympia Pharmaceuticals, I led the architecture for a LAMP-based ecommerce platform using CodeIgniter 3, AWS EC2, Cloudflare, and New Relic—keeping us at 99% uptime while supporting $1M/day in revenue. I built out high-volume prescription printing logic (2,500+ jobs/day), overhauled the frontend with React + Node.js, and added a customer-facing order tracking system. I also revamped the login system, adding lockouts, reset flows, and branded emails—cutting support tickets by 20%.
        
        At Homeport Travel, I built a full-stack cruise booking platform using React, Node.js, CodeIgniter 4, and Docker. I created a 50+ component UI library, cruise blog, SEO-friendly React SSR pages, and a business dashboard using Recharts.
        
        I also built side projects like "Flight Tracker" (Flask + Next.js using AviationStack API) and the “Ask Me Anything” chatbot (Vite + Lovable). I'm also a part-time photographer and a huge fan of cruising—my next cruise is December 2025.
        
        I use: React, TypeScript, Node.js, PHP (CodeIgniter 3/4), Python (Flask, Django), MySQL, Docker, Git, AWS (EC2, SES, CloudWatch), MongoDB, Postman, Selenium, PhpStorm, SQLyog, and more.
        
        Certifications include AWS Cloud Practitioner, Python Zero-to-Hero, SQL Zero-to-Hero, and Tableau Data Science. I’ve also worked with HubSpot APIs, forms, properties, and contact automation.
        
        I love mentoring other devs, making guides, and building systems. Most of all, I’m motivated every day by my fiancée Kristen and my daughter Elizabeth.
        - Developed 50+ component UI library, a blog for cruisers, a Recharts-based business dashboard, and React SSR pages for SEO.
        - Passionate about cruising — Homeport is the start of a dream to build a world-class cruise deal platform. Next cruise: December 2025.
        - Creator of side projects like “Flight Tracker” (Flask + Next.js, using AviationStack API) and “Ask Me Anything” chatbot (Vite + Lovable).
        - Part-time photographer, formerly active at local Orlando clubs.
        - Interests include: football (Miami Dolphins), hockey (Florida Panthers), Twitch TV, gym, movies, AI, learning, and family life.
        - Tech stack: React, TypeScript, Node.js, PHP (CodeIgniter 3/4), Python (Flask/Django), MySQL, Docker, Git, AWS (EC2, SES, CloudWatch), MongoDB, Postman, Selenium, PhpStorm.
        - Certified in AWS Cloud Practitioner, Python Zero-to-Hero, SQL Zero-to-Hero, and Tableau Data Science.
        - HubSpot IT Experience, working with properties, forms, contacts + Hubspot API. 
        - API onboarding experience + REST API documentation. Enjoys mentoring other developers, making guides, video tutorials.
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
