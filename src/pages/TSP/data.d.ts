export type StepDataType = {
  payAccount: string;
  receiverAccount: string;
  receiverName: string;
  amount: string;
};

export type CurrentTypes = 'base' | 'confirm' | 'result';

export type StepComponentTypeProps = {
  current: CurrentTypes;
  stepData: StepDataType;
  setCurrent: React.Dispatch<React.SetStateAction<CurrentTypes>>;
  setStepData: React.Dispatch<React.SetStateAction<StepDataType>>;
};
