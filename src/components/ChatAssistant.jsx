import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchChatStream } from '../services/api';

const DENSITY_LABEL = { low: 'Clear', medium: 'Moderate', high: 'Critical' };

const ChatAssistant = ({ stalls = [], zones = [] }) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'StadiumOS AI active — powered by Gemini 2.0. Ask me about crowd conditions, wait times, or routing.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isTyping) return;

    const userMsgId = crypto.randomUUID();
    const aiMsgId = crypto.randomUUID();

    setMessages(prev => [...prev, { id: userMsgId, sender: 'human', text: trimmed }]);
    setInputVal('');
    setIsTyping(true);

    // Add an empty AI message that we'll stream text into
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);

    try {
      const stream = fetchChatStream(trimmed, zones, stalls);
      for await (const chunk of stream) {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, text: m.text + chunk } : m
        ));
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId ? { ...m, text: '(AI pipeline error — please try again.)' } : m
      ));
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [inputVal, isTyping, zones, stalls]);

  const renderText = (text) =>
    text.split('**').map((chunk, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 700 }}>{chunk}</strong>
        : chunk
    );

  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 className="section-title" style={{ margin: 0 }}>AI Assistant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {zones.filter(z => z.density === 'high').map(z => (
            <span key={z.id} style={{
              background: 'var(--accent-danger)', color: '#fff',
              fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 700
            }}>
              {z.name}: Critical
            </span>
          ))}
        </div>
      </div>

      {/* Message Feed */}
      <div
        role="log"
        aria-label="AI conversation history"
        aria-live="polite"
        style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
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
              maxWidth: '88%',
              borderBottomLeftRadius: msg.sender === 'ai' ? 0 : '12px',
              borderBottomRightRadius: msg.sender === 'human' ? 0 : '12px',
              fontSize: '0.88rem',
              lineHeight: '1.5',
              color: 'var(--text-main)',
              minHeight: msg.text === '' ? '36px' : 'auto'
            }}
          >
            {msg.text === '' && isTyping
              ? <span className="shiny-text" aria-label="AI is responding">Thinking...</span>
              : renderText(msg.text)
            }
          </div>
        ))}
        {/* Invisible scroll anchor */}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '14px' }} noValidate>
        <label htmlFor="chat-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Message to AI assistant
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask about wait times, crowds, or routing…"
          disabled={isTyping}
          aria-busy={isTyping}
          style={{
            flex: 1,
            background: 'var(--bg-card-inner)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: 'var(--text-main)',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.88rem',
            opacity: isTyping ? 0.6 : 1,
            transition: 'opacity 0.2s'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isTyping || !inputVal.trim()}
          aria-label="Send message"
          style={{ padding: '10px 18px', opacity: (isTyping || !inputVal.trim()) ? 0.5 : 1 }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default React.memo(ChatAssistant);
