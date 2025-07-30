import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3001/api/ask', { question });
            setAnswer(res.data.answer);
        } catch {
            setAnswer('Something went wrong.');
        }
        setLoading(false);
    };
    const [messages, setMessages] = useState([
        {
            text: "Hi, I'm George! 👋 I'm an AI trained to answer questions about my professional background. Feel free to ask me anything about my education, work experience, skills, or projects! I can tell you about my research at the Weizmann Institute, my work at Novartis, my experience in VC, or anything else you'd like to know about my professional journey. Click on my picture if you want to see my LinkedIn profile!",
            sender: "them",
            status: "read",
        },
    ]);
    const handlePresetClick = (text) => {
        sendMessage(text);
    };
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const newMessage = {
            text,
            sender: 'me',
            status: 'delivered',
        };

        setMessages((prev) => [...prev, newMessage]);

        // Simulate read after 3s
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((msg, i) =>
                    i === prev.length - 1 && msg.sender === 'me'
                        ? { ...msg, status: 'read' }
                        : msg
                )
            );
        }, 3000);

        setQuestion('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3001/api/ask', { question: text });
            setMessages((prev) => [
                ...prev,
                { text: res.data.answer, sender: 'them', status: 'read' },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { text: 'Something went wrong.', sender: 'them', status: 'read' },
            ]);
        }
        setLoading(false);
    };


    return (
        <div className="page-wrapper flex flex-col h-full w-full">
            <>
                {/* Title */}
                <h1 className="chatbox-header text-4xl sm:text-5xl font-bold text-center mb-4">
                    Ask Me Anything
                </h1>
                {/* Subtitle */}
                <p className="chatbox-desc text-[#9A9A9A] text-center mb-4">
                    AI model trained on George Garzon's CV.
                </p>
                {/* Input box */}
                <div className="container">
                    <div className="imessage">
                        {messages.map((msg, i) => (
                            <div className="imessage" key={i} className={msg.sender === 'me' ? 'from-me-container' : 'from-them-container'}>
                                <p className={msg.sender === 'me' ? 'from-me' : 'from-them'}>
                                    {msg.text}

                                </p>
                                {msg.sender === 'me' && (
                                <span className="block text-xs mt-1 text-[#9A9A9A]">
                                  {msg.status === 'read' ? 'Read' : 'Delivered'}
                                </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/*<div className="imessage">*/}
                    {/*    <p className="from-them margin-b_one">*/}
                    {/*        Hi, I'm George! 👋 I'm an AI trained to answer questions about my professional background.*/}
                    {/*        Feel free to ask me anything about my education, work experience, skills, or projects! I can*/}
                    {/*        tell you about my research at the Weizmann Institute, my work at Novartis, my experience in*/}
                    {/*        VC, or anything else you'd like to know about my professional journey. Click on my picture*/}
                    {/*        if you want to see my LinkedIn profile!*/}
                    {/*    </p>*/}
                    {/*    <p className="from-me no-tail margin-b_none">*/}
                    {/*        Brock turns around and goes back to Cyntheeah’s room. The nurse tries to*/}
                    {/*        stop him, which is uncharacteristic of the nurse since she hasn’t been*/}
                    {/*        doing her job at all today. As Brock opens the hospital room door he and*/}
                    {/*        the nurse see the bed is empty...*/}
                    {/*    </p>*/}

                    {/*    <p className="from-me">*/}
                    {/*        Joze is in his car applying a fake mustache to his face, cuz he’s always*/}
                    {/*        been a Tom Selleck fan. He checks his Glock, puts on his sunglasses, then*/}
                    {/*        lets the tires of his Ford Ranchero squeal down the road.*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                </div>
                <div className="w-full max-w-xl">
                    <div className="text-[#9A9A9A] bg-[#171717] border border-[#2F2F2F] rounded-xl px-4 py-2">
                        <div className="flex items-center gap-2">
                            <input
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                type="text"
                                placeholder="Ask a question..."
                                className="w-full bg-transparent placeholder-[#9A9A9A] text-white focus:outline-none"
                            />
                            <button onClick={() => sendMessage(question)} className="...">Send</button>

                            <button
                                className="bg-[#2F2F2F] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#3a3a3a] transition">
                                Send
                            </button>
                        </div>

                    </div>

                </div>
                {/* Preset buttons */}
                <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white">
                    <button
                        onClick={() => handlePresetClick("What financial tools have you built?")}
                        className="text-xs text-[#9A9A9A] px-[8px] py-[4px] bg-[#101010] border border-[#282828] rounded-full hover:bg-zinc-700 transition">
                        What financial tools have you built?
                    </button>
                    <button
                        className="text-xs text-[#9A9A9A] px-[8px] py-[4px] bg-[#101010] border border-[#282828] rounded-full hover:bg-zinc-700 transition">
                        Have you designed a searchable directory?
                    </button>
                    <button
                        className="text-xs text-[#9A9A9A] px-[8px] py-[4px] bg-[#101010] border border-[#282828] rounded-full hover:bg-zinc-700 transition">
                        Describe a project management app you built.
                    </button>
                    <button
                        className="text-xs text-[#9A9A9A] px-[8px] py-[4px] bg-[#101010] border border-[#282828] rounded-full hover:bg-zinc-700 transition">
                        Show examples of landing pages you've created.
                    </button>
                    <button
                        className="text-xs text-[#9A9A9A] px-[8px] py-[4px] bg-[#101010] border border-[#282828] rounded-full hover:bg-zinc-700 transition">
                        How have you built or worked on a CRM?
                    </button>
                    <button
                        className="text-xs text-[#9A9A9A] px-[8px] py-[4px] bg-[#101010] border border-[#282828] rounded-full hover:bg-zinc-700 transition">
                        What mobile apps have you developed?
                    </button>
                </div>
            </>

        </div>

    );
}

export default App;
