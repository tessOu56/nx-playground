import { type FC, useState, type FormEvent } from 'react';

import { homeConfig } from '../data/homeConfig';
import { useHomeTranslation } from '../hooks/useHomeTranslation';

export const ContactSection: FC = () => {
  const { t } = useHomeTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construct mailto link
    const subject = encodeURIComponent('Contact from Portfolio');
    const body = encodeURIComponent(`From: ${email}\n\n${message}`);
    window.location.href = `mailto:${homeConfig.contact.email}?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section 
      id='contact-section' 
      className='min-h-[50vh] flex items-center bg-gray-50 dark:bg-gray-900 py-16'
    >
      <div className='max-w-2xl mx-auto px-4 w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Get In Touch
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Have a project in mind? Let's work together.
          </p>
        </div>

        {/* Email Form */}
        {submitted ? (
          <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center'>
            <svg
              className='w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <h3 className='text-xl font-semibold text-green-900 dark:text-green-100 mb-2'>
              Message Sent!
            </h3>
            <p className='text-green-700 dark:text-green-300'>
              Your email client will open shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label 
                htmlFor='email' 
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                Your Email
              </label>
              <input
                type='email'
                id='email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='your.email@example.com'
                aria-label='Your email address'
              />
            </div>

            <div>
              <label 
                htmlFor='message' 
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                Message
              </label>
              <textarea
                id='message'
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={6}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Tell me about your project...'
                aria-label='Your message'
                aria-describedby='message-help'
              />
              <p id='message-help' className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                Describe your project or what you'd like to discuss
              </p>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl'
            >
              Send Message
            </button>
          </form>
        )}

        {/* Alternative Contact */}
        <div className='mt-8 text-center text-sm text-gray-600 dark:text-gray-400'>
          Or email me directly at{' '}
          <a 
            href={`mailto:${homeConfig.contact.email}`}
            className='text-blue-600 dark:text-blue-400 hover:underline'
          >
            {homeConfig.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
};
