import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, Loader2, User } from "lucide-react";
import "./ai.css";

const SUGGESTIONS = [
    "Recommend a learning path for ML",
    "How should I format my resume experience?",
    "Suggest project ideas for React Developers",
    "What are the best job placement tips?"
];

export default function AI() {
    const [chatInput, setChatInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { role: "assistant", text: "Hello! I am your AI Career Advisor. Ask me anything about career paths, resume reviews, or technical skill development!" }
    ]);
    
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isTyping]);

    const triggerAIResponse = (queryText) => {
        setIsTyping(true);
        setTimeout(() => {
            let aiText = "That's a great question! For a path in that direction, I recommend mastering React, building 3 portfolio projects, and practicing SQL database queries.";
            const lower = queryText.toLowerCase();
            
            if (lower.includes("resume") || lower.includes("format")) {
                aiText = "Based on your resume details, I suggest emphasizing your achievements. Try formatting your web development internship bullets to start with action words like 'Led development' or 'Optimized load times by 20%'.";
            } else if (lower.includes("job") || lower.includes("placement") || lower.includes("intern")) {
                aiText = "Currently, React developer roles are high in demand. I recommend exploring our 'Jobs & Internship' tab to apply to the Product Design or Frontend Intern positions!";
            } else if (lower.includes("ml") || lower.includes("machine learning")) {
                aiText = "For Machine Learning, start with Python basics, then master Numpy/Pandas. Move into Scikit-Learn for traditional models, and then deep learning via PyTorch/TensorFlow. Don't forget linear algebra and probability!";
            } else if (lower.includes("project")) {
                aiText = "Great projects to build: 1) A real-time chat application using WebSockets, 2) A developer portfolio featuring interactive quiz assets, and 3) An e-commerce dashboard with custom chart filters.";
            }

            setChatMessages((prev) => [...prev, { role: "assistant", text: aiText }]);
            setIsTyping(false);
        }, 1200);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = { role: "user", text: chatInput };
        setChatMessages((prev) => [...prev, userMsg]);
        const currentInput = chatInput;
        setChatInput("");
        triggerAIResponse(currentInput);
    };

    const handleChipClick = (suggestion) => {
        const userMsg = { role: "user", text: suggestion };
        setChatMessages((prev) => [...prev, userMsg]);
        triggerAIResponse(suggestion);
    };

    return (
        <div className="ai-view-container">
            <div className="section-header">
                <h2>AI Career Guidance</h2>
                <p>Chat with our smart AI assistant to clarify doubts, review paths, or evaluate skill sets.</p>
            </div>

            <div className="ai-chat-layout">
                <div className="chat-window-card">
                    {/* Header bar */}
                    <div className="chat-window-header">
                        <div className="ai-status-indicator">
                            <div className="status-avatar">
                                <Sparkles size={16} />
                            </div>
                            <div className="status-meta">
                                <h4>Career AI Advisor</h4>
                                <span className="status-text">Online & Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages-container">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`chat-bubble-row ${msg.role}`}>
                                <div className="chat-avatar-wrapper">
                                    {msg.role === "assistant" ? (
                                        <div className="msg-avatar assistant-avatar">
                                            <Sparkles size={13} />
                                        </div>
                                    ) : (
                                        <div className="msg-avatar user-avatar">
                                            <User size={13} />
                                        </div>
                                    )}
                                </div>
                                <div className="chat-bubble-bubble">
                                    <p className="bubble-text">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-bubble-row assistant">
                                <div className="chat-avatar-wrapper">
                                    <div className="msg-avatar assistant-avatar">
                                        <Sparkles size={13} />
                                    </div>
                                </div>
                                <div className="chat-bubble-bubble typing-bubble">
                                    <Loader2 className="animate-spin" size={14} />
                                    <span>AI is drafting advice...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Suggestions list chips */}
                    <div className="chat-suggestions-wrapper">
                        {SUGGESTIONS.map((s, i) => (
                            <button key={i} onClick={() => handleChipClick(s)} className="suggestion-chip">
                                <MessageSquare size={13} />
                                <span>{s}</span>
                            </button>
                        ))}
                    </div>

                    {/* Chat input bar */}
                    <form onSubmit={handleChatSubmit} className="chat-input-wrapper">
                        <input
                            type="text"
                            placeholder="Type a career question (e.g. Resume format tips, React projects...)"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            disabled={isTyping}
                        />
                        <button type="submit" className="send-chat-btn" disabled={!chatInput.trim() || isTyping}>
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

