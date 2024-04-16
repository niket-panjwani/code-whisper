/* eslint-disable no-loop-func */
import React, { useState, useEffect, useRef } from 'react';
import './styles/ChatView.css';
import CustomTextbox from '../CustomTextBox/CustomTextBox';
import { Message } from './Message';
import { sendMessage } from '../../api/sendMessage';
import { scrollToBottom } from '../../utils/scrollToBottom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a style
declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [userName, setUsername] = useState('user');
  
  
  const handleMessageSend = async (messageContent: string) => {
    setIsSending(true);

    // Send message to the extension to execute terminal commands
    // vscode.postMessage({
    //   command: 'sendMessage',
    //   text: messageContent
    // });
    
    // Add user message
    setMessages(prevMessages => {
      const newMessage: Message = {
        id: prevMessages.length + 1,
        content: messageContent,
        sender: 'user',
      };
      return [...prevMessages, newMessage];
    });

    const response = await sendMessage(messageContent, userName);

    if (!response.ok) {
      console.error('API call failed');
      setMessages(prevMessages => {
        const botMessage: Message = {
          id: prevMessages.length + 1,
          content: '',
          sender: 'bot',
        };
  
        return [...prevMessages, botMessage];
      });
      setIsSending(false);
      return;
    }

    if (response.body) {
      const reader = response.body.getReader();
      let responseData = '';

      setMessages(prevMessages => {
        const botMessage: Message = {
          id: prevMessages.length + 1,
          content: '',
          sender: 'bot',
        };
  
        return [...prevMessages, botMessage];
      });

      while (true) {
        const { done, value } = await reader.read();
  
        if (done) {
          break;
        }
  
        responseData += new TextDecoder("utf-8").decode(value);
  
        setMessages(prevMessages => {
          const botMessageIndex = prevMessages.findIndex(message => message.sender === 'bot' && message.id === prevMessages.length);
          const botMessage = prevMessages[botMessageIndex];
          botMessage.content = responseData;
  
          return [
            ...prevMessages.slice(0, botMessageIndex),
            botMessage,
            ...prevMessages.slice(botMessageIndex + 1),
          ];
        });
      }
    } else {
      setMessages(prevMessages => {
        const botMessage: Message = {
          id: prevMessages.length + 1,
          content: '',
          sender: 'bot',
        };
  
        return [...prevMessages, botMessage];
      });
      console.error('Response body is null');
    }

    setIsSending(false);
  };

  useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data;
      setUsername(message.username);
    });
  }, []);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map(message => (
          <React.Fragment key={message.id}>
            <div className={`message ${message.sender === 'user' ? 'user' : 'bot'}`}>
              <strong>{message.sender === 'user' ? userName : 'Code Whisper'}</strong>
              
              <ReactMarkdown
                children={message.content || "*Oops, no response was returned.*"}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, "")}
                        style={coldarkDark}
                        language={match[1]}
                      />
                    ) : (
                      <code {...props} className={`inlineCode ${className}`}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
            <hr className="divider" />
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <CustomTextbox onMessageSend={handleMessageSend} isSending={isSending} />
      </div>
    </div>
  );
};

export default ChatView;
