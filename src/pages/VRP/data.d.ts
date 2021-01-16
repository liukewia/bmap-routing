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
  name: string;
  uid: string;  // unique id
  lng: number;  // longitude
  lat: number;  // latitude
};

// props type
export type StepAndComponentPropsType = {
  currentStep: CurrentStepType;
  setCurrentStep: React.Dispatch<React.SetStateAction<CurrentStepType>>;
  algorithmData: algorithmDataType;
  setAlgorithmData: React.Dispatch<React.SetStateAction<algorithmDataType>>;
  POIData: POIDataType[];
  setPOIData: React.Dispatch<React.SetStateAction<POIDataType[]>>;
};
