import { Link } from 'react-router-dom';
import clsx from 'clsx';
interface PrimaryTxtInterLinkProps {
  onClick?: () => void;
  disabled?: boolean;
  to: string;
  txt: string;
}
function PrimaryTxtInterLink(props: PrimaryTxtInterLinkProps) {
  const { disabled, to, txt, onClick } = props;
  return (
    <Link
      to={to}
      className={clsx(
        'p-0 px-1',
        'inline-flex items-center justify-center',
        'shadow-inner shadow-white/10',
        'bg-transparent text-primary',
        'hover:text-primary_light data-[hover]:text-primary_light',
        'focus:text-primary_dark focus-visible:text-primary_dark focus-within:text-primary_dark target:text-primary_dark data-[target]:text-primary_dark active:text-primary_dark data-[active]:text-primary_dark',
        'disabled:text-primary_lighter',
        { 'text-primary_lighter': disabled }
      )}
      onClick={e => {
        if (disabled) {
          e.preventDefault();
        } else if (onClick) {
          if (!to) {
            e.preventDefault();
          }
          onClick();
        }
      }}
    >
      <p>{txt}</p>
    </Link>
  );
}

export default PrimaryTxtInterLink;
