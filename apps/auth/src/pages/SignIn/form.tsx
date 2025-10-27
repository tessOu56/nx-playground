import { yupResolver } from '@hookform/resolvers/yup';
import { logger } from '@nx-playground/logger';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PiEye, PiEyeClosed } from 'react-icons/pi';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import ApiCodes from '../../api/apiCodes.json';
import {
  emailValidation,
  // passwordValidation,
  tempPasswordValidation,
} from '../../api/validationRules';
import LabeledInput from '../../components/LabeledInput/LabeledInput';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryTxtOuterLink from '../../components/PrimaryTxtOuterLink/PrimaryTxtOuterLink';
import { handleDomain } from '../../services/handleDomain';
import { handleRedirect } from '../../services/handleRedirect';
import { postOryForm } from '../../services/orySdk';
import stores from '../../stores';
import { ApiData } from '../../types';
interface FormValues {
  email?: string;
  password?: string;
}
export const schema = yup.object().shape({
  email: emailValidation,
  // password: passwordValidation, // 待 UX 規劃要不要在登入頁加上與註冊頁相同的密碼驗證
  password: tempPasswordValidation,
});
function SignInForm() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  function getReturnUrl() {
    const raw =
      location?.state?.return_to ||
      searchParams.get('return_to') ||
      stores.returnUrl;
    return (
      raw ||
      window.location.origin.replace('-sso', '').replace('frondend', 'app')
    );
  }
  const queryParams = new URLSearchParams({
    return_to: getReturnUrl(),
  }).toString();
  const flowId = location?.state?.flow || searchParams.get('flow');
  const [isPwdVisible, setIsPwdVisible] = useState(false);
  const [isSubmitable, setIsSubmitable] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setFocus,
    setValue,
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(schema as any),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });
  const values = watch();
  const handleOryLoginError = (err: any) => {
    const status = err?.response?.status;

    if (status === 400) {
      const messages = err?.response?.data?.ui?.messages ?? [];
      const nodes = err?.response?.data?.ui?.nodes ?? [];

      if (messages.length > 0) {
        const id = messages[0].id;
        if (id === 4000006) {
          const { feild, tips } = ApiCodes.ErrorCodes[4000006];
          setError(feild as 'email' | 'password', { message: tips });
        } else {
          toast.error(messages[0].text, {
            duration: Infinity,
            closeButton: true,
          });
        }
      } else {
        const node = nodes.find(
          (n: ApiData.FlowNode) =>
            n.group === 'password' && n.messages.length > 0
        );
        const msg = node?.messages?.[0];
        if (msg?.id === 4000002) {
          switch (node?.attributes?.name) {
            case 'identifier':
              setError('email', { message: '請輸入信箱' });
              break;
            case 'password':
              setError('password', { message: '請輸入密碼' });
              break;
          }
        }
      }
    }

    if (status === 303) {
      const redirectUrl = err.response.headers['Location'];
      handleRedirect(redirectUrl);
    }
  };
  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (!isSubmitable) return;
    setIsSubmitable(false);
    
    logger.info('User attempting login', { email: data.email });
    
    try {
      const res = await logger.time('login-request', async () => {
        return await postOryForm<ApiData.FlowRes | ApiData.SessionNodes>(
          `/self-service/login`,
          {
            method: 'password',
            identifier: data.email ?? '',
            password: data.password ?? '',
            csrf_token: stores.token,
          },
          {
            params: { flow: flowId },
          }
        );
      });

      logger.debug('Login response received', { hasData: !!res?.data });

      if (res?.data && 'data' in res.data) {
        const msg = res.data.data?.ui?.messages?.[0];
        if (msg?.id === 1010016) {
          const tip = ApiCodes.ErrorCodes[1010016]?.tips;
          logger.warn('Login error', { errorCode: 1010016, message: tip });
          toast.error(`${tip}`, { duration: Infinity, closeButton: true });
          return;
        }
      }

      if (res?.data && 'continue_with' in res.data) {
        const redirect = res.data.continue_with?.find(
          step => step.action === 'redirect_browser_to'
        )?.redirect_browser_to;

        if (redirect) {
          logger.info('Login successful, redirecting', { redirect });
          handleRedirect(redirect);
        }
      }
    } catch (err: any) {
      logger.error('Login failed', err, { email: data.email });
      handleOryLoginError(err);
    }
  };
  useEffect(() => {
    setFocus('email');
  }, [setFocus, setValue]);
  useEffect(() => {
    const ready =
      values.email && values.password && !errors.email && !errors.password;
    setIsSubmitable(!!ready);
  }, [values, errors]);
  return (
    <form className='content'>
      <div className='text-text_dark text-left my-12'>
        <h1>歡迎回來！</h1>
      </div>
      <LabeledInput
        label='信箱'
        name='email'
        type='email'
        placeholder='example@mail.com'
        control={control}
        errorMsg={errors.email?.message}
        isEmail
      />
      <hr className='mb-6 w-full h-0 border-transparent' />
      <LabeledInput
        label='密碼'
        name='password'
        type={isPwdVisible ? 'text' : 'password'}
        placeholder=''
        control={control}
        tips='請輸入 8-12 位英數'
        errorMsg={errors.password?.message}
      >
        <div
          className='absolute right-3.5 top-12 mt-1 hover:cursor-pointer'
          onClick={() => setIsPwdVisible(prev => !prev)}
        >
          {isPwdVisible ? <PiEye size={26} /> : <PiEyeClosed size={26} />}
        </div>
      </LabeledInput>
      <hr className='mb-6 w-full h-0 border-transparent' />
      <hr className='mb-6 w-full h-0 border-transparent' />
      <PrimaryButton
        txt='登入'
        onClick={handleSubmit(onSubmit)}
        disabled={!isSubmitable}
      />
      <div className='mt-5 flex justify-center items-center'>
        <p>還沒有帳號嗎？</p>
        <PrimaryTxtOuterLink
          txt='註冊'
          to={`${handleDomain()}/self-service/registration/browser?${queryParams}`}
        />
      </div>
    </form>
  );
}

export default observer(SignInForm);
