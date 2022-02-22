import Input from 'App/components/Input';
import { SLFIELD_TYPE } from 'App/types';
import classNames from 'classnames';

type SelectBoxProps = {
  slOption: SLFIELD_TYPE;
  value: number;
  explanation: string;
  onChangeValue: (v: number) => void;
  onChangeExplanation: (v: string) => void;
};

const SelectBox = ({ slOption, value, explanation, onChangeExplanation, onChangeValue }: SelectBoxProps) => {
  return (
    <div className="flex flex-col">
      {slOption.text && (
        <span className={classNames('text-lg font-medium', 'mb-2', 'text-sky-500')}>{slOption.text}</span>
      )}
      <select
        name={slOption.text}
        className={classNames(
          'border-2 border-sky-500',
          'focus:border-sky-500 focus:rounded-md',
          'outline-none',
          'rounded-md',
          'w-full h-12',
          'mb-4',
          'px-4',
          'caret-sky-500',
          'text-sky-500',
        )}
        value={value}
        onChange={(e) => {
          onChangeValue(+e.target.value);
        }}
      >
        {slOption.options.map((option, index) => {
          return (
            <option key={option.text} value={index}>
              {option.text}
            </option>
          );
        })}
      </select>
      {value === 0 && (
        <Input
          // label="Explanation"
          value={explanation}
          onChange={(e) => {
            const v = e.target.value;
            onChangeExplanation(v);
          }}
          width="w-full"
        />
      )}
    </div>
  );
};

export default SelectBox;
