import type { FC } from 'react';

interface ExampleQueriesProps {
  onQueryClick: (query: string) => void;
}

const examples = [
  'What projects have you built with React?',
  'Tell me about your monorepo architecture',
  'What technologies do you use?',
  'Show me your latest blog posts',
  'What experience do you have with Nx?',
];

export const ExampleQueries: FC<ExampleQueriesProps> = ({ onQueryClick }) => {
  return (
    <div className='flex flex-col items-center justify-center h-full py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          👋 Ask Me Anything
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Try one of these example questions to get started
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl'>
        {examples.map((query, index) => (
          <button
            key={index}
            onClick={() => onQueryClick(query)}
            className='text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'
          >
            <div className='text-sm text-gray-700 dark:text-gray-300'>
              {query}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

