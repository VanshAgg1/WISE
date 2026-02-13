import React, { useState, useRef, useEffect } from 'react';
import "./Chatbot.css"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatBot({formData}) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(false);
  

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;

    // Add user message to chat
    const userMessage = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {

        const fullAddress = [
        formData.address,
        formData.city,
        formData.state,
        formData.zipCode
      ].filter(Boolean).join(', ');

      // Send message to backend
      const response = await fetch('http://127.0.0.1:5000/api/finance-application/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage, history: messages, 
            address: fullAddress,
          credit_score: formData.creditScore,
          income: formData.annualIncome,
          loan_amount: formData.loanAmount,
          loan_term: formData.loanTerm,
          apr: formData.apr,
          down_payment: formData.downPayment
         }),
      });

      const data = await response.json();

      // Add bot response to chat
      const botMessage = {
        content: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>ChatBot</h2>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.sender === 'user' ? (
                message.content
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
            <div className="message-timestamp">{message.timestamp}</div>
          </div>
        ))}

{loading && (
  <div className="message bot-message loading-message">
    <div className="loading-content">
      <div className="spinner"></div>
      <span>Thinking...</span>
    </div>
  </div>
)}


        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBot;