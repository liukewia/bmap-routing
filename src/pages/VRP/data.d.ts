// state types
export type CurrentStepType = 'step1' | 'step2' | 'result';

export type algorithmDataType = {
  algorithm: string;
  initialTemp: number;
  finalTemp: number;
  coolingRate: number;
  chainLength: number;
};

export type POIDataType = {
  key: React.Key;
  name: string;
  lng: number;  // longitude
  lat: number;  // latitude
  demand: number;
};

// props type
export type StepAndComponentPropsType = {
  currentStep: CurrentStepType;
  setCurrentStep: React.Dispatch<React.SetStateAction<CurrentStepType>>;
  rootAlgoData: algorithmDataType;
  setRootAlgoData: React.Dispatch<React.SetStateAction<algorithmDataType>>;
  rootPOIData: POIDataType[];
  setRootPOIData: React.Dispatch<React.SetStateAction<POIDataType[]>>;
};

export type CalcStatusType =  0 | 1 | 2;