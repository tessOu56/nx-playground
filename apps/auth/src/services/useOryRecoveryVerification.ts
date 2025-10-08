import { postOryForm } from './orySdk';
import stores from '../stores';
import ApiCodes from '../api/apiCodes.json';
import { toast } from 'sonner';
export const useOryRecoveryVerification = (
  flowId: string,
  email: string,
  reVerify: () => void,
  navigate: (path: string, options?: any) => void
) => {
  const submitCode = async (code: string) => {
    try {
      const res = await postOryForm(
        '/self-service/recovery',
        {
          method: 'code',
          code,
          csrf_token: stores.token,
        },
        {
          params: { flow: flowId },
        }
      );

      const message = res.data.ui?.messages?.[0];
      if (message?.id === 4060006) {
        const tip = ApiCodes.ErrorCodes[4060006]?.tips;
        toast.error(`${tip}請重新驗證`, {
          duration: Infinity,
          closeButton: true,
        });
        reVerify();
        return;
      }

      const redirectUrl = res?.data?.continue_with?.[0]?.redirect_browser_to;
      if (redirectUrl) {
        navigate('/settings');
      }
    } catch (error) {
      // TODO: Handle error appropriately
      console.error('Recovery verification error:', error);
    }
  };

  const resendCode = async () => {
    try {
      const res = await postOryForm(
        '/self-service/recovery',
        {
          email,
          csrf_token: stores.token,
          method: 'code',
        },
        {
          params: { flow: flowId },
        }
      );

      const message = res.data.ui?.messages?.[0];
      if (message?.id === 1060003) {
        toast.success(ApiCodes.SucessCodes[1060003]?.tips || '驗證碼已寄出', {
          duration: Infinity,
          closeButton: true,
        });
        reVerify();
      }
    } catch (error) {
      // TODO: Handle error appropriately
      console.error('Resend code error:', error);
    }
  };

  return {
    submitCode,
    resendCode,
  };
};
