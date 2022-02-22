import Input from 'App/components/Input';
import { SLFIELD_TYPE } from 'App/types';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

type SelectBoxProps = {
  slOption: SLFIELD_TYPE;
  value: number;
  explanation: string;
  onChangeValue: (v: number) => void;
  onChangeExplanation: (v: string) => void;
};

const SelectBox = ({ slOption, value, explanation, onChangeExplanation, onChangeValue }: SelectBoxProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const wrapperRef = useRef<any>(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="flex flex-col">
      {slOption.text && (
        <span className={classNames('text-lg font-medium', 'mb-2', 'text-sky-500')}>{slOption.text}</span>
      )}
      <div
        className={classNames(
          'relative',
          'border-2 border-sky-500',
          'focus:border-sky-500 focus:rounded-md',
          'outline-none',
          'rounded-md',
          'w-full h-12',
          'mb-4',
          'px-4 py-2',
          'text-sky-500',
          'cursor-pointer',
        )}
        onClick={() => {
          setShowOptions(!showOptions);
        }}
        ref={wrapperRef}
      >
        {slOption.options[value].text}

        {showOptions && (
          <div className="absolute -bottom-20 border-t-2 border-sky-500 left-0 w-full z-50">
            {slOption.options.map((option, index) => {
              return (
                <div
                  key={option.text}
                  onClick={() => {
                    setShowOptions(false);
                    onChangeValue(index);
                  }}
                  className={classNames(
                    'border-2 border-sky-500',
                    'hover:border-sky-500 hover:bg-sky-500 hover:text-white',
                    'w-full h-10',
                    'px-4 py-2',
                    'caret-sky-500',
                    'text-sky-500',
                    'cursor-pointer',
                    'bg-white',
                    'border-t-0',
                  )}
                >
                  {option.text}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
