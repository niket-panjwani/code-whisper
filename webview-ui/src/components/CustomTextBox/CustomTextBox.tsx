import React, { useState } from 'react';
import './styles/CustomTextbox.css';
import sendIcon from '../../assets/send-inverted.svg';

interface CustomTextboxProps {
  onMessageSend: (message: string) => Promise<void>;
  isSending: boolean;
}

const CustomTextbox: React.FC<CustomTextboxProps> = ({ onMessageSend, isSending }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      await handleMessageSend();
    }
  };

  const handleMessageSend = async () => {
    if (inputMessage.trim() === '') return;
    const messageContent = inputMessage;
    setInputMessage('');
    await onMessageSend(messageContent);
  };

  return (
    <div className="custom-textbox">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSending}
        />
        <button id="send-button" disabled={isSending} onClick={handleMessageSend}>
          <img src={sendIcon} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default CustomTextbox;
