import { Controller } from 'react-hook-form';
import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
interface LabeledInputProps {
  label: string;
  name: string;
  type: 'email' | 'password' | 'text' | 'number';
  placeholder?: string;
  control: any;
  tips?: string;
  errorMsg: string | undefined;
  children?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  disabled?: boolean;
  isEmail?: boolean;
  isNumber?: boolean;
}
function LabeledInput(props: LabeledInputProps) {
  const {
    control,
    label,
    name,
    type,
    placeholder,
    errorMsg,
    children,
    tips,
    onKeyDown,
    onChange,
    maxLength,
    disabled,
    isNumber,
    isEmail,
  } = props;
  return (
    <Field className='relative'>
      <Label className='block w-full text-left text-[17px] text-black leading-[22px]'>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            className={clsx(
              'block w-full py-1.5 mb-0 h6 text-text_dark rounded-lg bg-white placeholder:text-gray_lightest caret-border',
              label ? 'mt-4 h-[48px] px-3' : 'h-[56px] px-4',
              'border-2',
              errorMsg
                ? 'border-error'
                : //   : 'border-black/20 caret-black/80 hover:border-border data-[hover]:border-border hover:caret-border focus:border-border focus:caret-border data-[focus]:caret-border'
                  'border-black/20  hover:border-border data-[hover]:border-border focus:border-border data-[focus]:border-border'
            )}
            autoComplete={name}
            placeholder={placeholder}
            style={{ fontWeight: 400 }}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={disabled}
            inputMode={isNumber ? 'numeric' : isEmail ? 'email' : 'text'} // 移動端顯示數字鍵盤
            pattern={isNumber ? `\d*` : undefined} // 確保 HTML 層面只接受數字
            onChange={e => {
              let value = e.target.value;

              if (isNumber) {
                value = value.replace(/\D/g, ''); // 過濾非數字
                if (maxLength) value = value.slice(0, maxLength); // 限制長度
              }

              field.onChange(value); // 更新表單狀態
              onChange?.(e); // 呼叫外部的 `onChange` 處理
            }}
          />
        )}
      />
      {children}
      <div className='text-text text-left pt-0.5'>
        <span className={clsx({ hidden: !tips || errorMsg })}>
          {tips ?? ''}
        </span>
        <span className={clsx('text-error', { hidden: !errorMsg })}>
          {errorMsg ?? ''}
        </span>
      </div>
    </Field>
  );
}

export default LabeledInput;
