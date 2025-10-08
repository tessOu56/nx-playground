import { Button } from '@headlessui/react';
import GoogleIcon from '../../assets/images/Google_logo.svg';
import clsx from 'clsx';
interface GoogleButtonProps {
  onClick: () => void;
  txt: string;
  disabled?: boolean;
}
function GoogleButton(props: GoogleButtonProps) {
  return (
    <Button
      onClick={() => props.onClick()}
      className={clsx(
        'w-full p-0 border',
        'inline-flex items-center justify-between rounded-[9px]',
        'shadow-inner shadow-white/10',
        'bg-white text-gray_darkest border-gray_dark',
        'hover:bg-black/5 data-[hover]:bg-black/5',
        'focus:bg-black/15 focus-visible:bg-black/15 focus-within:bg-black/15 target:bg-black/15 data-[target]:bg-black/15 active:bg-black/15 data-[active]:bg-black/15',
        'disabled:bg-gray_lighter disabled:text-gray_darker disabled:border-gray_darker'
      )}
      disabled={props.disabled}
    >
      <span
        className={clsx(
          'w-[50px] min-h-[46px] border-r border-r-transparent',
          'inline-flex items-center justify-center'
        )}
      >
        <img className='w-full' src={GoogleIcon} alt='google' />
      </span>
      <p className='h6 w-full text-center'>{props.txt}</p>
    </Button>
  );
}

export default GoogleButton;
