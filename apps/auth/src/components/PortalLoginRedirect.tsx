import { useEffect } from 'react';

import { redirectToPortalLogin } from '../services/handleDomain';

export function PortalLoginRedirect() {
  useEffect(() => {
    redirectToPortalLogin();
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <p className='text-gray-600'>Redirecting to organizer login…</p>
    </div>
  );
}
