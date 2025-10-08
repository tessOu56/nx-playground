import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import LabeledInput from '../../components/LabeledInput/LabeledInput';
import { postOryForm } from '../../services/orySdk';
import stores from '../../stores';
import ApiCodes from '../../api/apiCodes.json';
import { toast } from 'sonner';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  flowId: string;
  onSuccess: (email: string) => void;
}

function SignUpForm({ flowId, onSuccess }: SignUpFormProps) {
  const [isSubmitable, setIsSubmitable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const values = watch();

  useEffect(() => {
    const ready =
      values.name &&
      values.email &&
      values.password &&
      values.confirmPassword &&
      values.password === values.confirmPassword &&
      !errors.name &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword;
    setIsSubmitable(!!ready);
  }, [values, errors]);

  const onSubmit = async (data: FormValues) => {
    if (!isSubmitable) return;
    setIsSubmitable(false);
    setIsLoading(true);

    try {
      const res = await postOryForm(
        '/self-service/registration',
        {
          method: 'password',
          'traits.name': data.name,
          'traits.email': data.email,
          password: data.password,
          'traits.username': data.email,
          csrf_token: stores.token,
        },
        {
          params: { flow: flowId },
        }
      );

      const message = res.data.ui?.messages?.[0];
      if (message?.id === 4000007) {
        const tip = ApiCodes.ErrorCodes[4000007]?.tips;
        toast.error(`${tip}`, { duration: Infinity, closeButton: true });
        return;
      }

      const redirectUrl = res?.data?.continue_with?.[0]?.redirect_browser_to;
      if (redirectUrl) {
        onSuccess(data.email);
      }
    } catch (err: unknown) {
      // TODO: Handle error appropriately
      console.error('Sign up error:', err);
      toast.error('註冊失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='content'>
      <div className='text-text_dark text-left my-12'>
        <h1>建立帳號</h1>
      </div>
      <LabeledInput
        label='姓名'
        name='name'
        type='text'
        placeholder='請輸入姓名'
        control={control}
        errorMsg={errors.name?.message}
      />
      <hr className='mb-6 w-full h-0 border-transparent' />
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
        type='password'
        placeholder='請輸入密碼'
        control={control}
        errorMsg={errors.password?.message}
      />
      <hr className='mb-6 w-full h-0 border-transparent' />
      <LabeledInput
        label='確認密碼'
        name='confirmPassword'
        type='password'
        placeholder='請再次輸入密碼'
        control={control}
        errorMsg={errors.confirmPassword?.message}
      />
      <hr className='mb-6 w-full h-0 border-transparent' />
      <hr className='mb-6 w-full h-0 border-transparent' />
      <PrimaryButton
        txt={isLoading ? '註冊中...' : '註冊'}
        onClick={handleSubmit(onSubmit)}
        disabled={!isSubmitable || isLoading}
      />
      <div className='mt-5 flex justify-center items-center'>
        <p>已經有帳號了嗎？</p>
        <a href='/login' className='text-blue-600 hover:text-blue-800 ml-2'>
          登入
        </a>
      </div>
    </form>
  );
}

export default observer(SignUpForm);
