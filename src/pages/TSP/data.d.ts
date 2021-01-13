export type algorithmDataType = {
  algorithm: string;
  initialTemp: number;
  finalTemp: number;
  coolingRate: number;
  chainLength: number;
};

export type CurrentStepType = 'step1' | 'step2' | 'result';

export type StepComponentTypeProps = {
  currentStep: CurrentStepType;
  algorithmData: algorithmDataType;
  setCurrentStep: React.Dispatch<React.SetStateAction<CurrentStepType>>;
  setAlgorithmData: React.Dispatch<React.SetStateAction<algorithmDataType>>;
};
