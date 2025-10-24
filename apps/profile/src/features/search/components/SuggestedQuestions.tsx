import type { FC } from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions: FC<SuggestedQuestionsProps> = ({
  questions,
  onQuestionClick,
}) => {
  if (questions.length === 0) return null;

  return (
    <div className='my-4'>
      <p className='text-xs text-gray-400 mb-2'>Suggested questions:</p>
      <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className='flex-shrink-0 px-3 py-1.5 text-xs rounded-full border border-purple-400/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all whitespace-nowrap'
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

