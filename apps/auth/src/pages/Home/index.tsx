import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import stores from '../../stores';
import PrimaryTxtOuterLink from '../../components/PrimaryTxtOuterLink/PrimaryTxtOuterLink';
function Home() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const returnUrl =
    location?.state?.return_to ||
    searchParams.get('return_to') ||
    stores.returnUrl ||
    window.location.origin.replace('-sso', '').replace('frondend', 'app');
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
        實驗性專案
      </p>
      <div className='w-[345px] m-[auto] flex flex-col'>
        <PrimaryTxtOuterLink txt='前往 APP' to={`https://app.nx-playground.local/`} />
      </div>
      <hr className='mb-6 w-full h-0 border-transparent' />
    </div>
  );
}

export default Home;
