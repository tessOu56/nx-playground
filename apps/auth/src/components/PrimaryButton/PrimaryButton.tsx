import { Button } from '@headlessui/react';
import clsx from 'clsx';
interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  txt: string;
}

function PrimaryButton(props: PrimaryButtonProps) {
  const { disabled, onClick, txt } = props;
  return (
    <Button
      className={clsx(
        'w-full py-[14px] px-3',
        'inline-flex items-center justify-center rounded-[14px]',
        'shadow-inner shadow-white/10',
        'bg-primary text-white',
        'hover:bg-primary_light data-[hover]:bg-primary_light',
        'focus:bg-primary_dark focus-visible:bg-primary_dark focus-within:bg-primary_dark target:bg-primary_dark data-[target]:bg-primary_dark active:bg-primary_dark data-[active]:bg-primary_dark',
        'disabled:text-primary_lightest'
      )}
      disabled={disabled}
      onClick={e => {
        if (disabled) {
          e.preventDefault();
        } else if (onClick) {
          onClick();
        }
      }}
    >
      <p className='font-[510px]'>{txt}</p>
    </Button>
  );
}

export default PrimaryButton;
