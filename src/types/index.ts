type SLFIELD_OPTION = {
  text: string;
  needExplanation?: boolean;
};

export type SLFIELD_TYPE = {
  text: string;
  options: SLFIELD_OPTION[];
};
