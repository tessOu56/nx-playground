import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import SignInForm from './form';
import { getOryFlow } from '../../services/orySdk';
import stores from '../../stores';
import { toast } from 'sonner';

function SignInPage() {
  const [searchParams] = useSearchParams();
  const [flowId, setFlowId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeFlow = async () => {
      try {
        const flow = await getOryFlow('login', flowId);
        stores.setToken(
          flow.ui?.nodes?.find(
            (node: any) => node.attributes?.name === 'csrf_token'
          )?.attributes?.value || ''
        );
      } catch (err: unknown) {
        console.error('Failed to initialize login flow:', err);
        toast.error('初始化失敗，請重新整理頁面');
      } finally {
        setIsLoading(false);
      }
    };

    if (flowId) {
      initializeFlow();
    }
  }, [flowId]);

  useEffect(() => {
    const urlFlowId = searchParams.get('flow');
    if (urlFlowId) {
      setFlowId(urlFlowId);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

export default observer(SignInPage);
