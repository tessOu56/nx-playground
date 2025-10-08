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
  email: string;
}

interface RecoveryFormProps {
  flowId: string;
  onSuccess: (email: string) => void;
}

function RecoveryForm({ flowId, onSuccess }: RecoveryFormProps) {
  const [isSubmitable, setIsSubmitable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
  });

  const values = watch();

  useEffect(() => {
    const ready = values.email && !errors.email;
    setIsSubmitable(!!ready);
  }, [values, errors]);

  const onSubmit = async (data: FormValues) => {
    if (!isSubmitable) return;
    setIsSubmitable(false);
    setIsLoading(true);

    try {
      const res = await postOryForm(
        '/self-service/recovery',
        {
          email: data.email,
          method: 'link',
          csrf_token: stores.token,
        },
        {
          params: { flow: flowId },
        }
      );

      const message = res.data.ui?.messages?.[0];
      if (message?.id === 1060003) {
        toast.success(
          ApiCodes.SucessCodes[1060003]?.tips || '重設密碼連結已寄出',
          {
            duration: Infinity,
            closeButton: true,
          }
        );
        onSuccess(data.email);
      }
    } catch (err: unknown) {
      // TODO: Handle error appropriately
      console.error('Recovery form error:', err);
      toast.error('發送重設密碼連結失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className='content'>
      <div className='text-text_dark text-left my-12'>
        <h1>重設密碼</h1>
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
      <hr className='mb-6 w-full h-0 border-transparent' />
      <PrimaryButton
        txt={isLoading ? '發送中...' : '發送重設密碼連結'}
        onClick={handleSubmit(onSubmit)}
        disabled={!isSubmitable || isLoading}
      />
    </form>
  );
}

export default observer(RecoveryForm);
