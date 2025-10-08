import { Button } from '@headlessui/react';
import AppleIcon from '../../assets/images/Apple_logo.svg';
import clsx from 'clsx';
interface AppleButtonProps {
  onClick: () => void;
  txt: string;
  disabled?: boolean;
}
function AppleButton(props: AppleButtonProps) {
  return (
    <Button
      onClick={() => props.onClick()}
      className={clsx(
        'w-full p-0',
        'inline-flex items-center justify-between rounded-[9px]',
        'shadow-inner shadow-white/10',
        'bg-black text-white',
        'hover:bg-black/80 data-[hover]:bg-black/80',
        'focus:bg-black/70 focus-visible:bg-black/70 focus-within:bg-black/70 target:bg-black/70 data-[target]:bg-black/70 active:bg-black/70 data-[active]:bg-black/70',
        'disabled:bg-gary_default disabled:text-gray_darker'
      )}
      disabled={props.disabled}
    >
      <span
        className={clsx(
          'w-[50px] min-h-[48px] border-r border-r-transparent',
          'inline-flex items-center justify-center'
        )}
      >
        <img className='w-full' src={AppleIcon} alt='apple' />
      </span>
      <p className='h6 w-full text-center'>{props.txt}</p>
    </Button>
  );
}

export default AppleButton;
