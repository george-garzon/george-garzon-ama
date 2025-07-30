const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    // Mock response (replace with real AI API later)
    res.json({
        answer: `You asked: "${question}". I'm a smart AI trained on your resume!`
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
