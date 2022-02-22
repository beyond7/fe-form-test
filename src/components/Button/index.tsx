import classNames from 'classnames';

type ButtonProps = {
  text: string;
  action?: () => void;
  customStyle?: string;
  fit?: boolean;
  disabled?: boolean;
};

const Button = ({ text, action, customStyle, fit, disabled }: ButtonProps) => {
  return (
    <button
      className={classNames(
        'flex items-center justify-center h-12 p-4 mx-8 border-2 rounded-md',
        'transition duration-700 ease-in-out',
        'hover:bg-sky-500 border-sky-500',
        'text-sky-500 hover:text-white font-medium',
        fit ? 'w-fit' : 'min-w-8',
        customStyle,
        disabled ? 'bg-sky-200 border-sky-200 hover:bg-sky-200 hover:text-sky-500 cursor-not-allowed' : '',
      )}
      disabled={disabled}
      onClick={action}
    >
      {text}
    </button>
  );
};

export default Button;
