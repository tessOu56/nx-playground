import { useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import stores from '../../stores';

function Home() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const returnUrl =
    location?.state?.return_to ||
    searchParams.get('return_to') ||
    stores.returnUrl ||
    'http://localhost:3002/events';
  const loginHref = `/login?return_to=${encodeURIComponent(returnUrl)}`;

  useEffect(() => {
    stores.removeToken();
    if (returnUrl && !stores.returnUrl) {
      stores.setReturnUrl(returnUrl);
    }
  }, [returnUrl]);

  return (
    <div className='App'>
      <p className='mt-[440px] text-[28px] leading-[34px]'>NX Playground</p>
      <p className='mt-[13px] text-[17px] leading-[22px] mb-[114px]'>
        Organizer login (Kratos). Attendees use the portal + LIFF, not this app.
      </p>
      <div className='w-[345px] m-[auto] flex flex-col'>
        <Link className='underline' to={loginHref}>
          Organizer sign in
        </Link>
      </div>
      <hr className='mb-6 w-full h-0 border-transparent' />
    </div>
  );
}

export default Home;
