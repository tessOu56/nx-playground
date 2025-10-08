import { Button } from '@headlessui/react';
import clsx from 'clsx';
interface SecondaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  txt: string;
}

function SecondaryButton(props: SecondaryButtonProps) {
  const { disabled, onClick, txt } = props;
  return (
    <Button
      className={clsx(
        'w-full py-[15.5px] px-3 border-[1.5px]',
        'inline-flex items-center justify-center rounded-[9px]',
        'shadow-inner shadow-white/10',
        'bg-base text-primary border-primary',
        'hover:text-primary_light hover:border-primary_light data-[hover]:text-primary_light data-[hover]:border-primary_light',
        'focus:text-primary_dark focus-visible:text-primary_dark focus-within:text-primary_dark target:text-primary_dark data-[target]:text-primary_dark active:text-primary_dark data-[active]:text-primary_dark',
        'focus:border-primary_dark focus-visible:border-primary_dark focus-within:border-primary_dark target:border-primary_dark data-[target]:border-primary_dark active:border-primary_dark data-[active]:border-primary_dark',
        'disabled:text-primary_lighter disabled:border-primary_lighter'
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
      <p>{txt}</p>
    </Button>
  );
}

export default SecondaryButton;
