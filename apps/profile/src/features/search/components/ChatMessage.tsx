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
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
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

