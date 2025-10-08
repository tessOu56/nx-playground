import React, { useEffect, useState, useCallback } from 'react';
import { useTimer } from 'react-timer-hook';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import stores from '../../stores';
import { observer } from 'mobx-react-lite';
import LabeledInput from '../../components/LabeledInput/LabeledInput';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryTxtInterLink from '../../components/PrimaryTxtInterLink/PrimaryTxtInterLink';
import { useOryVerification } from '../../services/useOryVerification';
import { handleOryError } from '../../services/orySdk';
const numbers = ['code1', 'code2', 'code3', 'code4', 'code5', 'code6'];
interface FormValues {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
}
function Verification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const flowId = (location?.state as any)?.flow || searchParams.get('flow');
  const code = (location?.state as any)?.code || searchParams.get('code');
  const email =
    (location?.state as any)?.email ||
    searchParams.get('email') ||
    'ooxx@arwork.tw';
  const [isSubmitable, setIsSubmitable] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [errMsg, setErrorMsg] = useState('');
  const { handleSubmit, control, setFocus, setValue, trigger, watch } =
    useForm<FormValues>({
      defaultValues: {
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
        code6: '',
      },
      mode: 'onSubmit',
    });
  const values = watch();
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 2); // 倒數 60 秒
  const { seconds, minutes, pause, restart } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => {
      pause();
      setCanResend(true);
    },
  });
  const reVerify = () => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 60); // 倒數 60 秒
    restart(expiryTimestamp, true);
    setIsSubmitable(false);
    setCanResend(false);
    setValue('code1', '');
    setValue('code2', '');
    setValue('code3', '');
    setValue('code4', '');
    setValue('code5', '');
    setValue('code6', '');
    setFocus('code1');
  };
  const { getVerificationToken, submitCode, resendCode } = useOryVerification(
    flowId,
    email,
    reVerify,
    navigate,
    setErrorMsg
  );
  /**
   * 偵測 key down 事件，如果是 Backspace，則清空當前欄位並聚焦上一欄位
   * @param e
   * @param currentIndex
   * @returns
   */
  const handleKeyDown = async (
    e: React.KeyboardEvent,
    currentIndex: number
  ) => {
    const currentField = numbers[currentIndex];
    const prevField = numbers[currentIndex - 1];
    if (e.key === 'Backspace') {
      e.preventDefault(); // 避免預設刪除
      setValue(currentField as keyof FormValues, '');
      setValue(prevField as keyof FormValues, '');
      if (prevField) setFocus(prevField as keyof FormValues); // 聚焦上一欄位
    }
  };
  /**
   * 偵測 input change 事件，如果是數字，則填入當前欄位並聚焦下一欄位
   * @param e
   * @param currentIndex
   * @returns
   */
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const rawValue = e.target.value;
    const filteredValue = rawValue.replace(/\D/g, ''); // 過濾非數字輸入

    const currentField = numbers[currentIndex];
    const nextField = numbers[currentIndex + 1];
    const prevField = numbers[currentIndex - 1];

    // 📌 **如果使用者輸入了非數字，則不處理，停留在當前欄位**
    if (rawValue && !filteredValue) {
      return; // 讓使用者繼續輸入，不觸發欄位清空邏輯
    }

    // 📌 **先清空當前欄位值**
    setValue(currentField as keyof FormValues, filteredValue);

    // 📌 **如果輸入框被清空，則跳到前一欄**
    if (!filteredValue) {
      if (prevField && currentIndex > 0) {
        setTimeout(() => setFocus(prevField as keyof FormValues), 0); // 確保 React 更新後才切換焦點
      }
      return;
    }

    // 📌 **驗證當前欄位**
    const isValid = await trigger(currentField as keyof FormValues);

    // 📌 **如果驗證不通過，停留在當前欄位**
    if (!isValid) {
      return;
    }

    // 📌 **如果驗證成功且不是最後一格，跳到下一欄**
    if (currentIndex < numbers.length - 1) {
      setFocus(nextField as keyof FormValues);
    } else {
      setIsSubmitable(true);
    }
  };

  const handleError = (err: any) => {
    // 400：登入驗證失敗
    if (err?.response?.status === 400) {
      if (err?.response?.data?.ui?.messages?.length > 0) {
        const findSucessMsg = err.response.data.ui.messages.find(
          (el: any) => el.id === 1080002
        );
        if (!findSucessMsg) {
          setErrorMsg(`驗證碼不對哦😕`);
        } else {
          setErrorMsg('');
        }
        reVerify();
      }
    } else if (
      err?.response?.status === 422 &&
      !err?.response?.data?.redirect_browser_to
    ) {
      reVerify();
    } else {
      handleOryError(err);
    }
  };

  const onSubmit = useCallback<SubmitHandler<FormValues>>(
    async data => {
      if (!isSubmitable) return;
      const code = numbers.map(n => data[n as keyof FormValues]).join('');
      if (code.length < 6) return;

      setIsSubmitable(false);
      try {
        await submitCode(code);
      } catch (err) {
        handleError(err);
      }
    },
    [isSubmitable, submitCode, handleError]
  );

  const handleResend = async () => {
    try {
      await resendCode();
    } catch (err: any) {
      handleError(err);
    }
  };
  useEffect(() => {
    if (flowId) {
      getVerificationToken();
    }
  }, [flowId, getVerificationToken]);
  useEffect(() => {
    setFocus('code1');
    reVerify();
    if (code && code.length === 6) {
      setValue('code1', code[0]);
      setValue('code2', code[1]);
      setValue('code3', code[2]);
      setValue('code4', code[3]);
      setValue('code5', code[4]);
      setValue('code6', code[5]);
      setIsSubmitable(true);
    }
  }, []);
  useEffect(() => {
    if (
      values.code1 &&
      values.code2 &&
      values.code3 &&
      values.code4 &&
      values.code5 &&
      values.code6
    ) {
      handleSubmit(onSubmit)(); // 如果是最後一欄位，直接提交表單
    }
  }, [values, handleSubmit, onSubmit]);
  return (
    <form className='content'>
      <div className='text-text_dark text-left my-12'>
        <h1>輸入驗證碼</h1>
        <hr className='mb-6 w-full h-0 border-transparent' />
        <p className='span'>{`驗證碼已傳送到 ${email} 信箱。`}</p>
      </div>
      <input type='hidden' name='csrf_token' value={stores.token} />
      <ul className='flex flex-row justify-between flex-nowrap grid-cols-6'>
        {numbers.map((_, index) => (
          <li key={index} className='w-[48px] h-[56px] m-0'>
            <LabeledInput
              label=''
              name={`code${index + 1}`}
              type='text'
              placeholder=''
              control={control}
              tips=''
              errorMsg=''
              onKeyDown={e => handleKeyDown(e, index)}
              onChange={e => handleChange(e, index)}
              maxLength={1}
              disabled={isSubmitable}
              isNumber
            />
          </li>
        ))}
      </ul>
      <div className='text-text text-left pt-0.5'>
        <span className={clsx('text-error', { hidden: !errMsg })}>
          {errMsg}
        </span>
      </div>
      <hr className='mb-6 w-full h-0 border-transparent' />
      <PrimaryButton
        txt='驗證'
        onClick={handleSubmit(onSubmit)}
        disabled={!isSubmitable}
      />
      <hr className='mb-6 w-full h-0 border-transparent' />
      <div className='mt-5 flex justify-center items-center'>
        <PrimaryTxtInterLink
          txt='重新傳送'
          to=''
          disabled={!canResend}
          onClick={handleResend}
        />
        <p className={clsx({ hidden: seconds === 0 })}>{`(0${minutes}:${
          seconds < 10 ? `0${seconds}` : seconds
        })`}</p>
      </div>
    </form>
  );
}

export default observer(Verification);
