import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import PrimaryTxtInterLink from '../../components/PrimaryTxtInterLink/PrimaryTxtInterLink';
import apiClient from '../../api/apiClient';
import { ApiData } from '../../types';
export default function ErrorPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const errorId = location?.state?.id || searchParams.get('id') || '';
  const [isDev, setIsDev] = useState(false);
  const [error, setErrorMessage] = useState<ApiData.ErrorMessage>({
    code: 0,
    status: '',
    reason: '',
    message: '',
  });
  const handleError = useCallback((errorRes: ApiData.ErrorMessage) => {
    if (!errorRes) {
      setErrorMessage({
        code: 0,
        status: 'no code',
        reason: 'no reason',
        message: 'no message',
      });
      return;
    }
    setErrorMessage({
      code: errorRes.code ?? 0,
      status: errorRes.status ?? 'no status',
      reason: errorRes.reason ?? 'no reason',
      message: errorRes.message ?? 'no message',
    });
  }, []);
  const getErrorMessage = useCallback(async () => {
    try {
      const res = await apiClient.get(`/self-service/errors`, {
        params: {
          id: errorId,
        },
      });
      handleError(res.data.error);
    } catch (error: any) {
      handleError(error.response.data.error);
    }
  }, [errorId, handleError]);
  useEffect(() => {
    if (isDev && errorId) {
      getErrorMessage();
    }
  }, [isDev, errorId, getErrorMessage]);
  useEffect(() => {
    if (!isDev) {
      setIsDev(true);
    }
  }, [isDev]);

  return (
    <div className='content flex flex-col items-center justify-center h-[500px] text-center'>
      <h1 className='font-bold'>Error</h1>
      <p className='my-4'>status：{error.status}</p>
      <p className='my-4'>message：{error.message}</p>
      <p className='my-4'>reason：{error.reason}</p>
      <PrimaryTxtInterLink txt='回到 APP' to='https://app.oosa.life/' />
    </div>
  );
}
