import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MoreVertical,
    Phone,
    Video,
    Send,
    Paperclip,
    Smile
} from 'lucide-react';
import { conversations, possibleConnections, suggestedUsers } from '../data/mockData';

export const ChatScreen = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Find conversation with this user or create a temporary one
        let targetId = userId ? parseInt(userId) : conversations[0]?.user.id;

        const existingChat = conversations.find(c => c.user.id === targetId);

        if (existingChat) {
            setChat(existingChat);
        } else if (userId) {
            const user = possibleConnections.find(u => u.id === parseInt(userId)) ||
                suggestedUsers.find(u => u.id === parseInt(userId));
            if (user) {
                setChat({
                    id: Date.now(),
                    user: {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        status: 'online',
                        role: user.role
                    },
                    messages: []
                });
            }
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [chat?.messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "You",
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true
        };

        setChat(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
        }));
        setMessage('');

        // Mock simulation of a reply
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                sender: chat.user.name,
                text: "Got it! Let's follow up on this tomorrow.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: false
            };
            setChat(prev => ({
                ...prev,
                messages: [...prev.messages, reply]
            }));
        }, 2000);
    };

    if (!chat) return <div className="chat-loading">Loading...</div>;

    return (
        <div className="wa-window">
            <aside className="wa-sidebar">
                <header className="wa-sidebar-header">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="" className="wa-my-avatar" />
                    <div className="wa-header-actions">
                        <button className="wa-icon-btn"><Smile size={20} /></button>
                        <button className="wa-icon-btn"><MoreVertical size={20} /></button>
                    </div>
                </header>

                <div className="wa-search-wrap">
                    <div className="wa-search-inner">
                        <Paperclip size={18} className="wa-search-icon" />
                        <input type="text" placeholder="Search or start new chat" className="wa-search-input" />
                    </div>
                </div>

                <div className="wa-conversations-scroll custom-scrollbar">
                    {conversations.map((item) => (
                        <div
                            key={item.id}
                            className={`wa-contact-item ${parseInt(userId) === item.user.id ? 'active' : ''}`}
                            onClick={() => navigate(`/dashboard/chat/${item.user.id}`)}
                        >
                            <img src={item.user.avatar} alt="" className="wa-contact-avatar" />
                            <div className="wa-contact-info">
                                <div className="wa-contact-top">
                                    <span className="wa-contact-name">{item.user.name}</span>
                                    <span className="wa-contact-time">12:30 PM</span>
                                </div>
                                <div className="wa-contact-msg">{item.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="wa-main-chat">
                <header className="wa-chat-header">
                    <div className="wa-chat-user" onClick={() => navigate('/dashboard/profile')}>
                        <img src={chat.user.avatar} alt="" className="wa-chat-avatar" />
                        <div className="wa-chat-user-details">
                            <h3 className="wa-chat-name">{chat.user.name}</h3>
                            <span className="wa-chat-status">online</span>
                        </div>
                    </div>
                    <div className="wa-chat-actions">
                        <button className="wa-action-btn"><Phone size={20} /></button>
                        <button className="wa-action-btn"><Video size={20} /></button>
                        <button className="wa-action-btn"><MoreVertical size={20} /></button>
                    </div>
                </header>

                <div className="wa-chat-body custom-scrollbar">
                    <div className="wa-chat-pattern-bg"></div>
                    <div className="wa-chat-messages">
                        {chat.messages.map((msg) => (
                            <div key={msg.id} className={`wa-bubble-row ${msg.isSelf ? 'self' : 'other'}`}>
                                <div className={`wa-bubble ${msg.isSelf ? 'sent' : 'received'}`}>
                                    <span className="wa-bubble-text">{msg.text}</span>
                                    <span className="wa-bubble-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="wa-chat-footer">
                    <button className="wa-footer-icon"><Smile size={24} /></button>
                    <button className="wa-footer-icon"><Paperclip size={24} /></button>
                    <form className="wa-input-container" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="wa-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="wa-send-btn-wa" disabled={!message.trim()}>
                            <Send size={24} />
                        </button>
                    </form>
                </footer>
            </main>
        </div>
    );
};
