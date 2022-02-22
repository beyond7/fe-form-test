import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import CanvasDraw from 'react-canvas-draw';

import Button from 'App/components/Button';
import Input from 'App/components/Input';
import SelectBox from 'App/components/SelectBox';
import { initializedValue } from 'App/utils/formData';
import { SLFIELD_TYPE } from 'App/types';
import { useAuth0 } from '@auth0/auth0-react';

const MainForm = () => {
  const { user, logout } = useAuth0();
  const canvasRef = useRef<any>(null);

  const [step, setStep] = useState<number>(0);
  const mainClass = classNames('flex flex-col w-screen h-screen items-center justify-center p-12');

  const [formData, setFormData] = useState(initializedValue());

  useEffect(() => {
    const prevForm = window.localStorage.getItem(`formData-${user?.sub}`);

    if (prevForm) {
      setFormData(JSON.parse(prevForm));
    }
  }, [user?.sub]);

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
                  window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(newFormData));
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
                  window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(newFormData));
                }}
                onChangeExplanation={(v) => {
                  const newFormData = JSON.parse(JSON.stringify(formData));
                  newFormData.fields[idx].slField.selection.explanation = v;

                  setFormData(newFormData);
                  window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(newFormData));
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
                      window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(newFormData));
                    }}
                    onChangeExplanation={(v) => {
                      const newFormData = JSON.parse(JSON.stringify(formData));
                      newFormData.fields[idx].nestedSlField.sub_field_selections[vIdx].explanation = v;

                      setFormData(newFormData);
                      window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(newFormData));
                    }}
                  />
                );
              })}
            </div>
          );
        case 'signField':
        default:
          const saveData = window.localStorage.getItem(`drawing-${user?.sub}`);

          return (
            <div key={`field-${idx}`} className=" self-center">
              <p className={classNames('text-3xl font-medium', 'mb-2', 'text-sky-500')}>{field.signField.spec.text}</p>
              <div className="w-max relative">
                <CanvasDraw
                  lazyRadius={0}
                  brushRadius={2}
                  ref={canvasRef}
                  saveData={saveData ? JSON.parse(saveData) : null}
                  brushColor="#0ea5e9"
                  catenaryColor="#0ea5e9"
                  gridColor="rgba(14, 165, 233, 0.2)"
                  immediateLoading
                  onChange={(e) => {
                    const newFormData = JSON.parse(JSON.stringify(formData));
                    const base64 = canvasRef?.current?.getDataURL();

                    newFormData.fields[idx].signField.signature_base64 = base64;
                    window.localStorage.setItem(
                      `drawing-${user?.sub}`,
                      JSON.stringify(canvasRef.current?.getSaveData()),
                    );

                    setFormData(newFormData);
                    window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(newFormData));
                  }}
                />
                <Button
                  text="⨯"
                  customStyle="absolute top-2 right-2 border-0 text-xl"
                  action={() => {
                    canvasRef?.current?.clear();
                    window.localStorage.setItem(
                      `drawing-${user?.sub}`,
                      JSON.stringify(canvasRef.current?.getSaveData()),
                    );
                  }}
                  fit
                />
              </div>
            </div>
          );
      }
    });
  }, [step, formData, user?.sub]);

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
        <Button text="⌂" customStyle="absolute top-4 right-4 font-bold text-xl mx-0 border-0" fit />
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
        {step === totalSteps - 1 ? (
          <Button
            text="Submit"
            action={() => {
              console.log(formData);
              window.localStorage.setItem(`formData-${user?.sub}`, JSON.stringify(formData));
              alert('Thank you for filling out this form.');
              logout();
            }}
            customStyle="font-bold text-xl mx-0 "
          />
        ) : (
          <Button
            text="Next"
            action={() => {
              setStep(step + 1);
            }}
            disabled={!stepCompleted || step === totalSteps - 1}
            customStyle="font-bold text-xl mx-0 "
          />
        )}
      </div>
    </div>
  );
};

export default MainForm;
