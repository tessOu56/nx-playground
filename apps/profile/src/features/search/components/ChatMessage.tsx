import type { FC } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role='article'
      aria-label={`${message.role} message`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/50'
            : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm text-white border border-purple-400/30 shadow-lg shadow-purple-500/20'
        }`}
      >
        <div className='text-sm font-medium mb-1'>
          {isUser ? 'You' : 'AI Assistant'}
        </div>
        <div className='whitespace-pre-wrap'>{message.content}</div>
        <div className='text-xs opacity-70 mt-2'>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

