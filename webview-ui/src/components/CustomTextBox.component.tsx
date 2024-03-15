import React, { useState, useEffect, useRef } from 'react';
import './styles/CustomTextbox.css';

interface CustomTextboxProps {
  onMessageSend: (message: string) => void;
  setIsSending: (isSending: boolean) => void;
  isSending: boolean;
}

const CustomTextbox: React.FC<CustomTextboxProps> = ({ onMessageSend, isSending, setIsSending }) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const inputRef = React.createRef<HTMLInputElement>();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if(!isSending) {
        handleMessageSend();
      }
    }
  };

  const handleMessageSend = async () => {
    if (inputMessage.trim() === '') return;
    setIsSending(true);
    const messageToSend = inputMessage;
    setInputMessage('');
    await onMessageSend(messageToSend);
    setIsSending(false);
  };

  return (
    <div className="custom-textbox">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          ref={inputRef}
        />
        <button id="send-button" disabled={isSending} onClick={handleMessageSend}>
          {/* Replace 'your-send-button.svg' with the path to your SVG icon */}
          <img src="your-send-button.svg" alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default CustomTextbox;
