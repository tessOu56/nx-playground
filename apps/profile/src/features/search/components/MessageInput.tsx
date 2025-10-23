import type { FC, KeyboardEvent } from 'react';
import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput: FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      // Re-focus after sending
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4'>
      <div className='flex gap-2'>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask me anything about my projects, tech stack, or experience...'
          className='flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
          disabled={disabled}
          aria-label='Message input'
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className='self-end px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
          aria-label='Send message'
        >
          Send
        </button>
      </div>
      <div className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

