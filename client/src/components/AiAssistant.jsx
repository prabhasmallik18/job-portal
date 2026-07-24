import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AiAssistant = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! 👋 I am your AI Career Coach. Ask me anything about jobs, skills, MERN stack, interviews, or internships!' }
    ]);
    const { backendUrl } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Messages update ayinappudu automatic ga scroll avvadaniki
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Auto-close the chat after 10 seconds if open
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 10000); // 10 seconds
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleChat = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // Real-time AI Chat - uses Google Gemini API
            const { data } = await axios.post(`${backendUrl}/api/users/ai-chat`, { 
                prompt: currentInput 
            }, {
                timeout: 30000 // 30 second timeout for AI response
            });

            if (data.success) {
                setMessages(prev => [...prev, { role: 'bot', text: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: data.message || "Sorry, I couldn't process that. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            if (error.response?.status === 401) {
                setMessages(prev => [...prev, { role: 'bot', text: "AI service not available. Please contact support." }]);
            } else if (error.code === 'ECONNABORTED') {
                setMessages(prev => [...prev, { role: 'bot', text: "Request timed out. Please try a shorter question." }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: "Server connection failed. Please check if backend is running." }]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-transform active:scale-90 font-semibold text-sm flex items-center gap-2"
            >
                {isOpen ? '✕' : '💬 AI Coach'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white font-bold flex justify-between items-center">
                        <span>🚀 InsiderJobs AI Coach</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${loading ? 'bg-yellow-400 text-yellow-900' : 'bg-green-400 text-green-900'}`}>
                            {loading ? 'Typing...' : 'Online'}
                        </span>
                    </div>
                    
                    {/* Chat Messages Area */}
                    <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white scroll-smooth">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    m.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md font-medium' 
                                    : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-600 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-medium">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                    Coach is thinking...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && !loading && handleChat()}
                            disabled={loading}
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" 
                            placeholder={loading ? "Waiting for response..." : "Ask anything..."} 
                        />
                        <button 
                            onClick={handleChat} 
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold disabled:bg-gray-400 transition-colors active:scale-95 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                            {loading ? '⏳' : '➤'}
                        </button>
                    </div>

                    {/* Footer Tips */}
                    <div className="bg-blue-50 border-t border-gray-200 p-2 text-center text-xs text-gray-600">
                        💡 Ask about jobs, skills, interviews, or internships
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiAssistant;