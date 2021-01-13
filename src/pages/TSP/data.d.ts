export type StepDataType = {
  algorithm: string;
  initialTemp: number;
  finalTemp: number;
  coolingRate: number;
  chainLength: number;
};

export type CurrentStepType = 'step1' | 'step2' | 'result';

export type StepComponentTypeProps = {
  currentStep: CurrentStepType;
  stepData: StepDataType;
  setCurrentStep: React.Dispatch<React.SetStateAction<CurrentStepType>>;
  setStepData: React.Dispatch<React.SetStateAction<StepDataType>>;
};
