import { Button } from '@headlessui/react';
import clsx from 'clsx';
interface AvatarButtonProps {
  selected: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  name: string;
  src: string;
}
/**
 * A button with an avatar image.
 *
 * @param {AvatarButtonProps} props
 * @prop {boolean} selected Whether the button is selected.
 * @prop {() => void} onClick The click handler.
 * @prop {(e: React.KeyboardEvent<HTMLButtonElement>) => void} onKeyDown The keydown handler.
 * @prop {string} name The name of the avatar.
 * @prop {string} src The source of the avatar image.
 *
 * @example
 * <AvatarButton
 *   selected={selected}
 *   onClick={() => setSelected(!selected)}
 *   onKeyDown={(e) => { if (e.key === 'Enter') setSelected(!selected); }}
 *   name="John Doe"
 *   src="https://example.com/avatar.png"
 * />
 */
function AvatarButton(props: AvatarButtonProps) {
  const { onClick, src, name, selected, onKeyDown } = props;
  return (
    <Button
      onClick={() => onClick()}
      onKeyDown={onKeyDown}
      className={clsx(
        'w-[86px] h-[86px] rounded-full border-2 ',
        'inline-flex items-center justify-center ',
        'shadow-inner shadow-white/10',
        'hover:border-primary_lightest data-[hover]:border-primary_lightest',
        'focus:border-primary focus-visible:border-primary focus-within:border-primary target:border-primary data-[target]:border-primary active:border-primary data-[active]:border-primary',
        'disabled:opacity-40',
        { 'border-avatar_default': !selected },
        { 'border-primary': selected }
      )}
    >
      <img className='w-full' src={src} alt={name || 'avatar'} />
    </Button>
  );
}

export default AvatarButton;
