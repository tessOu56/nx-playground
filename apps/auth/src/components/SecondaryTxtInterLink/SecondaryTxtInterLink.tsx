import { Link } from 'react-router-dom';
import clsx from 'clsx';
interface SecondaryTxtInterLinkProps {
  onClick?: () => void;
  disabled?: boolean;
  to: string;
  txt: string;
}
function SecondaryTxtInterLink(props: SecondaryTxtInterLinkProps) {
  const { disabled, to, txt, onClick } = props;
  return (
    <Link
      to={to}
      className={clsx(
        'p-0 px-1',
        'inline-flex items-center justify-center',
        'shadow-inner shadow-white/10',
        'bg-transparent underline text-text',
        'hover:text-text_light data-[hover]:text-text_light',
        'focus:text-text_dark focus-visible:text-text_dark focus-within:text-text_dark target:text-text_dark data-[target]:text-text_dark active:text-text_dark data-[active]:text-text_dark',
        'disabled:text-text_lighter',
        { 'text-primary_lighter': disabled }
      )}
      onClick={e => {
        if (disabled) {
          e.preventDefault();
        } else if (onClick) {
          onClick();
        }
      }}
    >
      <span>{txt}</span>
    </Link>
  );
}

export default SecondaryTxtInterLink;
