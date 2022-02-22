import initialForm from 'App/constants/initialForm.json';

export const initializedValue = () => {
  const newFormData = JSON.parse(JSON.stringify(initialForm));

  for (let i = 0; i < newFormData.fields.length; i += 1) {
    const field = newFormData.fields[i];
    const fieldKey = Object.keys(field)[0];

    switch (fieldKey) {
      case 'ffField':
        newFormData.fields[i].ffField.text = '';
        break;
      case 'slField':
        newFormData.fields[i].slField.selection = { index: 1, explanation: '' };
        break;
      case 'nestedSlField':
        newFormData.fields[i].nestedSlField.sub_field_selections = [];
        for (let j = 0; j < newFormData.fields[i].nestedSlField.spec.subFieldSpecs.length; j += 1) {
          newFormData.fields[i].nestedSlField.sub_field_selections[j] = {
            index: 1,
            explanation: '',
          };
        }
        break;
      case 'signField':
      default:
        newFormData.fields[i].signField.signature_base64 = '';
        break;
    }
  }

  return newFormData;
};
