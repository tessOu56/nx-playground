import {
  type FC,
  type KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from 'react';

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
    <div>
      <div className='relative'>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask me anything about my projects, tech stack, or experience...'
          className='w-full resize-none rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm p-3 pr-24 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50'
          rows={3}
          disabled={disabled}
          aria-label='Message input'
        />
        <button
          onClick={handleSend}
          disabled={(disabled ?? false) || !input.trim()}
          className='absolute bottom-3 right-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-medium'
          aria-label='Send message'
        >
          Send
        </button>
      </div>
      <div className='text-xs text-gray-400 mt-2'>
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};
