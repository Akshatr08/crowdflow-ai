import React, { useState } from 'react';
import { fetchChatResponse } from '../services/api';

const ChatAssistant = ({ stalls = [], zones = [] }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'CrowdFlow AI active. Linked to Google Gemini. Ask me about conditions or routing!' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const request = inputVal;
    const newMsg = { id: Date.now(), sender: 'human', text: inputVal };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    const reply = await fetchChatResponse(request, zones, stalls);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, sender: 'ai', text: reply }
    ]);
  };

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="section-title">AI Assistant</div>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="animate-fade-in"
            style={{ 
              alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
              background: msg.sender === 'ai' ? 'var(--bg-card-inner)' : 'var(--accent-bg)',
              border: `1px solid ${msg.sender === 'ai' ? 'var(--border-subtle)' : 'var(--accent-primary)'}`,
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '85%',
              borderBottomLeftRadius: msg.sender === 'ai' ? 0 : '12px',
              borderBottomRightRadius: msg.sender === 'human' ? 0 : '12px',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: 'var(--text-main)'
            }}
          >
            {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} style={{color: 'var(--text-main)', fontWeight: 700}}>{chunk}</strong> : chunk)}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
            <span className="shiny-text">Assistant is reading metrics...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <input 
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask AI about wait times or flows..." 
          style={{ 
            flex: 1, 
            background: 'var(--bg-card-inner)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '8px', 
            padding: '10px',
            color: 'var(--text-main)',
            outline: 'none',
            fontFamily: 'inherit'
          }} 
        />
        <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }}>Send</button>
      </form>
    </div>
  );
};

export default ChatAssistant;
