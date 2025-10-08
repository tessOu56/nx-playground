import { Button } from '@headlessui/react';
import LineSvg from '../../assets/svgTsx/LineSvgIcon';
import clsx from 'clsx';
interface LineButtonProps {
  onClick: () => void;
  txt: string;
  disabled?: boolean;
}
function LineButton(props: LineButtonProps) {
  return (
    <Button
      onClick={() => props.onClick()}
      className={clsx(
        'w-full p-0',
        'inline-flex items-center justify-between rounded-[9px]',
        'shadow-inner shadow-white/10',
        'bg-line_default text-white',
        'hover:bg-line_dark data-[hover]:bg-line_dark',
        'focus:bg-line_darker focus-visible:bg-line_darker focus-within:bg-line_darker target:bg-line_darker data-[target]:bg-line_darker active:bg-line_darker data-[active]:bg-line_darker',
        'disabled:bg-white disabled:text-gary_default '
      )}
      disabled={props.disabled}
    >
      <span
        className={clsx(
          'border-r border-r-base',
          'inline-flex items-center justify-center'
        )}
      >
        <LineSvg />
      </span>
      <p className='h6 w-full text-center'>{props.txt}</p>
    </Button>
  );
}

export default LineButton;
