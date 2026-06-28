import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, Loader2, User, Plus, Trash2, RotateCcw, AlertCircle, HelpCircle } from "lucide-react";
import "./ai.css";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";
const MODEL_NAME = "openai/gpt-oss-20b:free";

const SUGGESTIONS = [
    { text: "Recommend a learning path for Machine Learning", icon: "🤖" },
    { text: "How should I format my resume experiences for impact?", icon: "📄" },
    { text: "Suggest project ideas for a full stack React & Django Dev", icon: "💡" },
    { text: "What are the best tips to ace frontend mock interviews?", icon: "🎯" }
];

const DEFAULT_WELCOME = {
    role: "assistant",
    text: "Hello! I am your **ShikshaSetu AI Career Advisor**. Ask me anything about career guidance, resume suggestions, learning roadmaps, or technical interview preparation. \n\nGet started by choosing one of the topics below or writing your own query!"
};

const SYSTEM_PROMPT = `You are "ShikshaSetu AI Career Advisor", a warm, highly professional career guidance counselor and academic mentor.
Your goal is to help students, recent graduates, and professionals with:
1. Career path advice (suggesting roles, roadmap stages, skill development strategies).
2. Resume improvement tips (formatting experience, adding achievements, writing impact statements).
3. Technical project suggestions (React, Python, Machine Learning, Java, databases, etc.) based on their stack.
4. Mock interview prep, study resources, and general guidance.

Always keep your advice structured, actionable, and encouraging.
Use bullet points, bold headers, and code snippets when explaining technical concepts.
Refer to ourselves as ShikshaSetu AI Career Advisor. Ensure your responses are formatted cleanly in standard markdown.`;

// Markdown Renderer Helper
function renderMarkdown(text) {
    if (!text) return "";
    
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
            // Code block
            const codeLines = part.slice(3, -3).trim().split("\n");
            let language = "";
            let codeContent = codeLines.join("\n");
            
            if (codeLines.length > 0 && /^[a-zA-Z0-9+#-]+$/.test(codeLines[0])) {
                language = codeLines[0];
                codeContent = codeLines.slice(1).join("\n");
            }
            
            return (
                <div key={index} className="markdown-code-block">
                    {language && <div className="code-lang-label">{language}</div>}
                    <pre><code>{codeContent}</code></pre>
                </div>
            );
        } else {
            // Process paragraphs, lines, list items, headers
            const lines = part.split("\n");
            let inList = false;
            let listItems = [];
            const elements = [];
            
            const flushList = (keyPrefix) => {
                if (listItems.length > 0) {
                    elements.push(
                        <ul key={`${keyPrefix}-list`} className="markdown-list">
                            {listItems.map((item, idx) => (
                                <li key={idx}>{parseInlineMarkdown(item)}</li>
                            ))}
                        </ul>
                    );
                    listItems = [];
                    inList = false;
                }
            };
            
            lines.forEach((line, lineIdx) => {
                const trimmedLine = line.trim();
                
                // Bullet points
                if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
                    inList = true;
                    listItems.push(trimmedLine.slice(2));
                } else if (trimmedLine.startsWith("1. ") || /^\d+\.\s/.test(trimmedLine)) {
                    flushList(lineIdx);
                    const match = trimmedLine.match(/^(\d+)\.\s(.*)/);
                    if (match) {
                        elements.push(
                            <div key={lineIdx} className="markdown-numbered-item">
                                <span className="num-prefix">{match[1]}.</span>
                                <span className="num-content">{parseInlineMarkdown(match[2])}</span>
                            </div>
                        );
                    } else {
                        elements.push(<p key={lineIdx} className="markdown-p">{parseInlineMarkdown(line)}</p>);
                    }
                } else {
                    flushList(lineIdx);
                    
                    if (trimmedLine.startsWith("### ")) {
                        elements.push(<h4 key={lineIdx} className="markdown-h3">{parseInlineMarkdown(trimmedLine.slice(4))}</h4>);
                    } else if (trimmedLine.startsWith("## ")) {
                        elements.push(<h3 key={lineIdx} className="markdown-h2">{parseInlineMarkdown(trimmedLine.slice(3))}</h3>);
                    } else if (trimmedLine.startsWith("# ")) {
                        elements.push(<h2 key={lineIdx} className="markdown-h1">{parseInlineMarkdown(trimmedLine.slice(2))}</h2>);
                    } else if (trimmedLine.length === 0) {
                        elements.push(<div key={lineIdx} className="markdown-spacer" />);
                    } else {
                        elements.push(<p key={lineIdx} className="markdown-p">{parseInlineMarkdown(line)}</p>);
                    }
                }
            });
            
            flushList("end");
            return <div key={index}>{elements}</div>;
        }
    });
}

function parseInlineMarkdown(text) {
    if (!text) return "";
    
    // Parse bold text **bold**
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        
        // Parse inline code `code`
        const codeParts = part.split(/(\`.*?\`)/g);
        return codeParts.map((subPart, subIndex) => {
            if (subPart.startsWith("`") && subPart.endsWith("`")) {
                return <code key={subIndex} className="markdown-inline-code">{subPart.slice(1, -1)}</code>;
            }
            return subPart;
        });
    });
}

export default function AI() {
    const [chats, setChats] = useState(() => {
        const saved = localStorage.getItem("shikshasetu_ai_chats");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) {
                console.error("Failed to parse saved chats:", e);
            }
        }
        return [
            {
                id: "first-advisor-chat",
                title: "Career Guidance Chat",
                messages: [DEFAULT_WELCOME]
            }
        ];
    });

    const [activeChatId, setActiveChatId] = useState(() => {
        return chats[0]?.id || "first-advisor-chat";
    });

    const [chatInput, setChatInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");
    const chatEndRef = useRef(null);

    // Sync chats state to localStorage
    useEffect(() => {
        localStorage.setItem("shikshasetu_ai_chats", JSON.stringify(chats));
    }, [chats]);

    // Scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, activeChatId, isTyping]);

    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

    const generateResponse = async (updatedMessages, currentChatId) => {
        setIsTyping(true);
        setError("");

        try {
            const apiMessages = [
                { role: "system", content: SYSTEM_PROMPT },
                ...updatedMessages.map(msg => ({
                    role: msg.role,
                    content: msg.text
                }))
            ];

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "ShikshaSetu"
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: apiMessages
                })
            });

            if (!response.ok) {
                throw new Error(`API returned error status ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

            setChats(prevChats => 
                prevChats.map(c => {
                    if (c.id === currentChatId) {
                        return {
                            ...c,
                            messages: [...c.messages, { role: "assistant", text: aiText }]
                        };
                    }
                    return c;
                })
            );
        } catch (err) {
            console.error("OpenRouter Advisor error:", err);
            setError("Failed to fetch advice. OpenRouter API might be overloaded. Please try again.");
            setChats(prevChats => 
                prevChats.map(c => {
                    if (c.id === currentChatId) {
                        return {
                            ...c,
                            messages: [...c.messages, { role: "assistant", text: "⚠️ **System Error**: I failed to reach the advice server. Please verify your internet connection or click retry." }]
                        };
                    }
                    return c;
                })
            );
        } finally {
            setIsTyping(false);
        }
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        const text = chatInput.trim();
        if (!text || isTyping) return;

        setChatInput("");
        submitUserMessage(text);
    };

    const submitUserMessage = (text) => {
        const userMsg = { role: "user", text };
        
        // Determine new title if active chat was default titled
        const isDefaultTitle = activeChat.title === "New Advisor Chat" || activeChat.title === "Career Guidance Chat";
        const newTitle = isDefaultTitle 
            ? (text.length > 25 ? text.substring(0, 22) + "..." : text)
            : activeChat.title;

        const updatedMessages = [...activeChat.messages, userMsg];

        setChats(prevChats => 
            prevChats.map(c => {
                if (c.id === activeChat.id) {
                    return {
                        ...c,
                        title: newTitle,
                        messages: updatedMessages
                    };
                }
                return c;
            })
        );

        generateResponse(updatedMessages, activeChat.id);
    };

    const handleChipClick = (suggestionText) => {
        if (isTyping) return;
        submitUserMessage(suggestionText);
    };

    const handleNewChat = () => {
        const newId = `chat-${Date.now()}`;
        const newChat = {
            id: newId,
            title: "New Advisor Chat",
            messages: [DEFAULT_WELCOME]
        };

        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newId);
        setError("");
    };

    const handleDeleteChat = (idToDelete, e) => {
        e.stopPropagation();
        const filtered = chats.filter(c => c.id !== idToDelete);
        
        if (filtered.length === 0) {
            const resetId = "first-advisor-chat";
            const resetChats = [
                {
                    id: resetId,
                    title: "Career Guidance Chat",
                    messages: [DEFAULT_WELCOME]
                }
            ];
            setChats(resetChats);
            setActiveChatId(resetId);
        } else {
            setChats(filtered);
            if (activeChatId === idToDelete) {
                setActiveChatId(filtered[0].id);
            }
        }
        setError("");
    };

    const handleResetActiveChat = () => {
        if (isTyping) return;
        setChats(prevChats => 
            prevChats.map(c => {
                if (c.id === activeChat.id) {
                    return {
                        ...c,
                        messages: [DEFAULT_WELCOME]
                    };
                }
                return c;
            })
        );
        setError("");
    };

    return (
        <div className="ai-view-container">
            <div className="section-header">
                <h2>AI Career Guidance</h2>
                <p>Chat with our smart AI assistant powered by GPT to evaluate skill sets, outline roadmaps, or receive resume feedback.</p>
            </div>

            <div className="ai-chat-layout-wrapper">
                {/* Sidebar Column */}
                <div className="ai-chat-sidebar">
                    <button onClick={handleNewChat} className="new-chat-sidebar-btn">
                        <Plus size={16} />
                        <span>New Guidance Session</span>
                    </button>
                    
                    <div className="sidebar-sessions-list">
                        <div className="sidebar-list-heading">PREVIOUS DISCUSSIONS</div>
                        {chats.map(c => (
                            <div 
                                key={c.id} 
                                className={`sidebar-session-item ${c.id === activeChatId ? "active" : ""}`}
                                onClick={() => {
                                    if (!isTyping) {
                                        setActiveChatId(c.id);
                                        setError("");
                                    }
                                }}
                            >
                                <div className="session-item-title-wrapper">
                                    <MessageSquare size={14} className="session-icon" />
                                    <span className="session-title">{c.title}</span>
                                </div>
                                <button 
                                    className="delete-session-btn" 
                                    onClick={(e) => handleDeleteChat(c.id, e)}
                                    title="Delete session"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Window Card */}
                <div className="chat-window-card">
                    {/* Header bar */}
                    <div className="chat-window-header">
                        <div className="ai-status-indicator">
                            <div className="status-avatar">
                                <Sparkles size={16} />
                            </div>
                            <div className="status-meta">
                                <div className="status-meta-top">
                                    <h4>Career AI Advisor</h4>
                                    <span className="active-model-badge">gpt-oss-20b</span>
                                </div>
                                <span className="status-text">Online & Ready to Guide</span>
                            </div>
                        </div>
                        
                        <button 
                            className="chat-reset-action-btn"
                            onClick={handleResetActiveChat}
                            disabled={isTyping || activeChat?.messages?.length <= 1}
                            title="Reset active chat"
                        >
                            <RotateCcw size={14} />
                            <span>Reset Chat</span>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages-container">
                        {activeChat?.messages.map((msg, idx) => (
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
                                    <div className="bubble-text">{renderMarkdown(msg.text)}</div>
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
                                <div className="chat-bubble-bubble typing-bubble animate-pulse">
                                    <Loader2 className="animate-spin" size={14} />
                                    <span>AI is writing career guidance...</span>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="ai-error-banner">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div ref={chatEndRef} />
                    </div>

                    {/* Suggestions list chips - only show if chat has welcome message only */}
                    {activeChat?.messages.length <= 1 && (
                        <div className="suggestions-outer-container">
                            <div className="suggestions-label">
                                <HelpCircle size={12} />
                                <span>Suggested Starter Queries:</span>
                            </div>
                            <div className="chat-suggestions-wrapper">
                                {SUGGESTIONS.map((s, i) => (
                                    <button key={i} onClick={() => handleChipClick(s.text)} className="suggestion-chip">
                                        <span className="suggestion-chip-emoji">{s.icon}</span>
                                        <span>{s.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat input bar */}
                    <form onSubmit={handleChatSubmit} className="chat-input-wrapper">
                        <input
                            type="text"
                            placeholder="Ask a question (e.g. Resume tips, learning path, interview prep...)"
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
