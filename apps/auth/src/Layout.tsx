import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import packageJson from '../package.json';

function Layout({
  children,
  openBack,
}: {
  children: React.ReactNode;
  openBack?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        'relative w-full min-w-[393px] my-0 mx-auto pt-8 pb-16 min-h-[100vh]',
        'bg-base'
      )}
    >
      <div className='content'>
        {openBack && (
          <div className='w-9 p-2 rounded-full bg-white hover:cursor-pointer'>
            <IoIosArrowBack
              onClick={() => {
                navigate(-1);
              }}
            />
          </div>
        )}
      </div>
      {children}
      <p
        className={clsx(
          'absolute bottom-0 left-0',
          'text-left text-black text-[15px] leading-[20px]'
        )}
      >
        version:{' '}
        {import.meta.env.VITE_APP_VERSION || packageJson.version || 'unknown'}
      </p>
    </div>
  );
}

export default observer(Layout);
