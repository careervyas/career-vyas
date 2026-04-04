"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.slice(-10), // Last 10 messages for context
                }),
            });

            const data = await res.json();

            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: "Sorry, I encountered an error. Please try again!",
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.response },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong. Please check your connection and try again.",
                },
            ]);
        }

        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Simple markdown-to-html for bold text and links
    const formatMessage = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(
                /\[([^\]]+)\]\((\/[^\)]+)\)/g,
                '<a href="$2" class="chat-link">$1</a>'
            )
            .replace(/^- /gm, "• ")
            .replace(/\n/g, "<br/>");
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                id="chat-toggle-btn"
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    boxShadow: "0 6px 24px rgba(99, 102, 241, 0.4)",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    id="chat-window"
                    style={{
                        position: "fixed",
                        bottom: "96px",
                        right: "24px",
                        width: "400px",
                        maxWidth: "calc(100vw - 48px)",
                        height: "560px",
                        maxHeight: "calc(100vh - 140px)",
                        backgroundColor: "white",
                        borderRadius: "20px",
                        boxShadow:
                            "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                        zIndex: 9998,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        animation: "chatSlideUp 0.3s ease",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            color: "white",
                            padding: "18px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "12px",
                                backgroundColor: "rgba(255,255,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                            }}
                        >
                            🎓
                        </div>
                        <div>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Career Vyas AI
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    opacity: 0.85,
                                    marginTop: "2px",
                                }}
                            >
                                Your Career Guidance Assistant
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            backgroundColor: "#f8f9fc",
                        }}
                    >
                        {messages.length === 0 && (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#9ca3af",
                                    marginTop: "40px",
                                }}
                            >
                                <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                                    👋
                                </div>
                                <p
                                    style={{
                                        fontWeight: 600,
                                        color: "#6b7280",
                                        fontSize: "15px",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Hi! I&apos;m Career Vyas AI
                                </p>
                                <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
                                    Ask me about career paths, courses,
                                    <br />
                                    colleges, or entrance exams!
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        marginTop: "20px",
                                    }}
                                >
                                    {[
                                        "What careers can I pursue after B.Tech?",
                                        "Tell me about IIT Bombay",
                                        "How to prepare for JEE?",
                                        "Best medical courses in India",
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => {
                                                setInput(suggestion);
                                                setTimeout(() => {
                                                    inputRef.current?.focus();
                                                }, 100);
                                            }}
                                            style={{
                                                background: "white",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "12px",
                                                padding: "10px 16px",
                                                fontSize: "13px",
                                                color: "#4b5563",
                                                cursor: "pointer",
                                                textAlign: "left",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = "#6366f1";
                                                e.currentTarget.style.color = "#6366f1";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = "#e5e7eb";
                                                e.currentTarget.style.color = "#4b5563";
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        msg.role === "user" ? "flex-end" : "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "85%",
                                        padding: "12px 16px",
                                        borderRadius:
                                            msg.role === "user"
                                                ? "16px 16px 4px 16px"
                                                : "16px 16px 16px 4px",
                                        background:
                                            msg.role === "user"
                                                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                                : "white",
                                        color: msg.role === "user" ? "white" : "#1f2937",
                                        fontSize: "14px",
                                        lineHeight: 1.6,
                                        boxShadow:
                                            msg.role === "assistant"
                                                ? "0 1px 4px rgba(0,0,0,0.06)"
                                                : "none",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: formatMessage(msg.content),
                                    }}
                                />
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div
                                    style={{
                                        padding: "12px 20px",
                                        borderRadius: "16px 16px 16px 4px",
                                        background: "white",
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                                        display: "flex",
                                        gap: "6px",
                                        alignItems: "center",
                                    }}
                                >
                                    <span className="typing-dot" style={{ animationDelay: "0s" }}>
                                        •
                                    </span>
                                    <span className="typing-dot" style={{ animationDelay: "0.2s" }}>
                                        •
                                    </span>
                                    <span className="typing-dot" style={{ animationDelay: "0.4s" }}>
                                        •
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: "14px 16px",
                            borderTop: "1px solid #f0f0f0",
                            backgroundColor: "white",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about careers, courses, exams..."
                            style={{
                                flex: 1,
                                padding: "12px 16px",
                                borderRadius: "14px",
                                border: "1.5px solid #e5e7eb",
                                outline: "none",
                                fontSize: "14px",
                                backgroundColor: "#f9fafb",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#6366f1";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#e5e7eb";
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "14px",
                                background:
                                    isLoading || !input.trim()
                                        ? "#e5e7eb"
                                        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                color: "white",
                                border: "none",
                                cursor: isLoading || !input.trim() ? "default" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                transition: "all 0.2s",
                                flexShrink: 0,
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes chatSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .typing-dot {
                    font-size: 24px;
                    color: #9ca3af;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }
                @keyframes typingBounce {
                    0%,
                    80%,
                    100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-6px);
                    }
                }
                .chat-link {
                    color: #6366f1;
                    text-decoration: underline;
                    font-weight: 500;
                }
                .chat-link:hover {
                    color: #4f46e5;
                }
            `}</style>
        </>
    );
}
