import classNames from 'classnames';

type InputProps = {
  label?: string;
  width: string;
  type?: React.HTMLInputTypeAttribute;
  customStyle?: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = ({ label, width, type, customStyle, value, onChange }: InputProps) => {
  return (
    <div className={classNames('flex flex-col mb-4', width, customStyle)}>
      {label && <span className={classNames('text-lg font-medium', 'mb-2', 'text-sky-500')}>{label}</span>}
      <input
        value={value}
        onChange={onChange}
        type={type}
        className={classNames(
          'border-2 border-sky-500',
          'focus:border-sky-500 focus:rounded-md',
          'outline-none',
          'rounded-md',
          'w-full h-12',
          'px-4 py-4',
          'caret-sky-500',
          'text-sky-500',
        )}
      />
    </div>
  );
};

export default Input;
