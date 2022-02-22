import { useMemo, useState } from 'react';
import classNames from 'classnames';
import Button from 'App/components/Button';
import { Link } from 'react-router-dom';

import Input from 'App/components/Input';
import SelectBox from 'App/components/SelectBox';
import { initializedValue } from 'App/utils/formData';
import { SLFIELD_TYPE } from 'App/types';

const MainForm = () => {
  const [step, setStep] = useState<number>(0);
  const mainClass = classNames('flex flex-col w-screen h-screen items-center justify-center p-12');

  const [formData, setFormData] = useState(initializedValue());

  const totalSteps = useMemo(() => {
    return Math.max(
      ...formData.fields.map((field: any) => {
        const key = Object.keys(field)[0];
        return field[key].spec.page;
      }),
    );
  }, [formData]);

  const stepElement = useMemo(() => {
    return formData.fields.map((field: any, idx: number) => {
      const stepType = Object.keys(field)[0];
      if (field[stepType].spec.page !== step + 1) return <div key={`field-${idx}`} />;

      switch (stepType) {
        case 'ffField':
          return (
            <div key={`field-${idx}`}>
              <Input
                label={field.ffField.spec.text}
                value={field.ffField.text || ''}
                onChange={(e) => {
                  const v = e.target.value;
                  const newFormData = JSON.parse(JSON.stringify(formData));
                  newFormData.fields[idx].ffField.text = v;

                  setFormData(newFormData);
                }}
                width="w-full"
              />
            </div>
          );
        case 'slField':
          return (
            <div key={`field-${idx}`}>
              <SelectBox
                slOption={field.slField.spec}
                value={field.slField?.selection?.index}
                explanation={field.slField?.selection?.explanation}
                onChangeValue={(v) => {
                  const newFormData = JSON.parse(JSON.stringify(formData));
                  newFormData.fields[idx].slField.selection.index = v;

                  setFormData(newFormData);
                }}
                onChangeExplanation={(v) => {
                  const newFormData = JSON.parse(JSON.stringify(formData));
                  newFormData.fields[idx].slField.selection.explanation = v;

                  setFormData(newFormData);
                }}
              />
            </div>
          );
        case 'nestedSlField':
          return (
            <div key={`field-${idx}`}>
              <p className={classNames('text-3xl font-medium', 'mb-2', 'text-sky-500')}>
                {field?.nestedSlField?.spec.text}
              </p>
              {field?.nestedSlField?.spec?.subFieldSpecs.map((spec: SLFIELD_TYPE, vIdx: number) => {
                return (
                  <SelectBox
                    key={spec.text}
                    slOption={spec}
                    value={field?.nestedSlField?.sub_field_selections[vIdx]?.index}
                    explanation={field?.nestedSlField?.sub_field_selections[vIdx]?.explanation}
                    onChangeValue={(v) => {
                      const newFormData = JSON.parse(JSON.stringify(formData));
                      newFormData.fields[idx].nestedSlField.sub_field_selections[vIdx].index = v;

                      setFormData(newFormData);
                    }}
                    onChangeExplanation={(v) => {
                      const newFormData = JSON.parse(JSON.stringify(formData));
                      newFormData.fields[idx].nestedSlField.sub_field_selections[vIdx].explanation = v;

                      setFormData(newFormData);
                    }}
                  />
                );
              })}
            </div>
          );
        case 'signField':
        default:
          return <div key={`field-${idx}`}>signField</div>;
      }
    });
  }, [step, formData]);

  const stepCompleted = useMemo(() => {
    for (let i = 0; i < formData.fields.length; i += 1) {
      const field = formData.fields[i];
      const fieldKey = Object.keys(field)[0];

      if (field[fieldKey].spec.page !== step + 1) continue;
      const fieldData = field[fieldKey];

      switch (fieldKey) {
        case 'ffField':
          if (fieldData.text === '') return false;
          break;
        case 'slField':
          if (
            fieldData.selection.index === 0 &&
            fieldData.selection.explanation === '' &&
            fieldData.spec.options[0].needsExplanation
          )
            return false;
          break;
        case 'nestedSlField':
          for (let i = 0; i < fieldData.sub_field_selections.length; i += 1) {
            if (
              fieldData.sub_field_selections[i].index === 0 &&
              fieldData.sub_field_selections[i].explanation === '' &&
              fieldData.spec.subFieldSpecs[i].options[0].needsExplanation
            )
              return false;
          }
          break;
        case 'signField':
        default:
          if (fieldData.signature_base64 === '') return false;
          break;
      }
    }

    return true;
  }, [formData, step]);

  return (
    <div className={mainClass}>
      <Link to="/">
        <Button text="↻" customStyle="absolute top-4 right-4 font-bold text-xl mx-0 border-0" fit />
      </Link>

      <div className="flex flex-col w-2/3">{stepElement}</div>

      <div className="flex mt-4">
        <Button
          action={() => {
            setStep(step - 1);
          }}
          text="Prev"
          disabled={step === 0}
          customStyle="font-bold mr-4 text-xl mx-0 "
        />
        <Button
          text="Next"
          action={() => {
            setStep(step + 1);
          }}
          disabled={!stepCompleted || step === totalSteps - 1}
          customStyle="font-bold text-xl mx-0 "
        />
      </div>
    </div>
  );
};

export default MainForm;
