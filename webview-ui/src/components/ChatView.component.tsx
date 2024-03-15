import React, { useState, useRef, useEffect } from 'react';
import './styles/ChatView.css';
import CustomTextbox from './CustomTextBox.component';

interface Message {
  id: number;
  content: string;
  sender: string;
}

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  const handleMessageSend = async (messageContent: string) => {
    setIsSending(true);
    const newMessage: Message = {
      id: messages.length + 1,
      content: messageContent,
      sender: 'user',
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  
    const response = await fetch('http://localhost:3000/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: messageContent }),
    });
  
    if (!response.ok) {
      console.error('API call failed');
      setIsSending(false);
      return;
    }

    const responseData = await response.text();
    
    const botMessage: Message = {
      id: messages.length + 2,
      content: responseData,
      sender: 'bot',
    };
    setMessages(prevMessages => [...prevMessages, botMessage]);
    setIsSending(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    console.log(isSending);
  }, [isSending]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <div className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}>
              {message.content}
            </div>
            <hr className="divider" />
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <CustomTextbox onMessageSend={handleMessageSend} isSending={isSending} setIsSending={setIsSending}/>
      </div>
    </div>
  );
};

export default ChatView;
