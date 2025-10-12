import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '活動報名表',
  description: '填寫活動報名表',
};

interface RegistrationLayoutProps {
  children: React.ReactNode;
}

export default function RegistrationLayout({
  children,
}: RegistrationLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>{children}</div>
    </div>
  );
}
