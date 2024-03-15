import React, { useState } from 'react';
import './styles/ChatView.css';

interface Message {
  id: number;
  content: string;
  sender: string;
}

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  const handleMessageSend = () => {
    if (inputMessage.trim() === '') return;
    const newMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user',
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    // Here you can add logic for responding to the user's message
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleMessageSend();
          }}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatView;