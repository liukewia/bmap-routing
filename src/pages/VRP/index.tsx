import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';
import StepResult from './components/StepResult';
import BaiduMap from '@/components/BaiduMap';
import ResultTable from '@/components/ResultTable';
import { generatePointKey } from '@/services/bmap-service';

import type {
  CurrentStepType,
  algorithmDataType,
  POIDataType,
  StepAndComponentPropsType,
  CalcStatusType,
} from './data';

import styles from './style.less';
import { Skeleton } from 'antd';

const { Step } = Steps;

export const initialAlgoData: algorithmDataType = {
  algorithm: 'SA',
  initialTemp: 1e3,
  finalTemp: 1,
  coolingRate: 0.9,
  chainLength: 10,
};

export const initialPointData: POIDataType[] = [
  {
    key: generatePointKey(),
    name: '四季青阳光科技园区-东1门（配送点）',
    lng: 116.426549,
    lat: 39.779675,
    demand: 3,  // 每车载重量
  },
  {
    key: generatePointKey(),
    name: '北京师范大学北院-西3门',
    lng: 116.409614,
    lat: 39.942402,
    demand: 1,
  },
  {
    key: generatePointKey(),
    name: '对外经济贸易大学-西门',
    lng: 116.431244,
    lat: 39.986622,
    demand: 2,
  },
  {
    key: generatePointKey(),
    name: '中央美术学院-东门',
    lng: 116.472828,
    lat: 39.988674,
    demand: 2,
  },
];

const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CurrentStepType>('step1');

  const [rootAlgoData, setRootAlgoData] = useState<algorithmDataType>(initialAlgoData);

  const [rootPOIData, setRootPOIData] = useState<POIDataType[]>(initialPointData);

  // 0 = 未开始计算   1 = 正在计算   2 = 计算结束
  const [calcStatus, setCalcStatus] = useState<CalcStatusType>(0);


  const stepAndComponentProps: StepAndComponentPropsType = {
    currentStep,
    setCurrentStep,
    rootAlgoData,
    setRootAlgoData,
    rootPOIData,
    setRootPOIData,
  };

  const renderResultTable = (_calcStatus: CalcStatusType): JSX.Element => {
    switch (_calcStatus) {
      case 1:
        return (
          <Card>
            <h3>计算结果：</h3>
            <Skeleton active />
          </Card>
        );
      case 2:
        return (
          <Card>
            <h3>计算结果：</h3>
            <ResultTable/>
          </Card>
        );
      case 0:
      default:
      return <></>;
    }
  }

  const { step, component } = useMemo(() => {
    const getCurrentStepAndComponent = (curr = 'step1') => {
      const stepAndComponent = {
        step1: {
          step: 0,
          // 在重复将一些props传给子组件时，可以wrap成对象并用spread syntax展开给子组件{}
          component: (
            <Step1Form
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              rootAlgoData={rootAlgoData}
              setRootAlgoData={setRootAlgoData}
            />
          )
        },
        step2: {
          step: 1,
          component: (
            <Step2Form
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              rootPOIData={rootPOIData}
              setRootPOIData={setRootPOIData}
            />
          )
        },
        result: {
          step: 2,
          component: (
            <StepResult
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              rootAlgoData={rootAlgoData}
              setRootAlgoData={setRootAlgoData}
              rootPOIData={rootPOIData}
              setRootPOIData={setRootPOIData}
              calcStatus={calcStatus}
              setCalcStatus={setCalcStatus}
            />
          )
        },
      };
      return stepAndComponent[curr];
    };

    return getCurrentStepAndComponent(currentStep);
  }, [currentStep]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <PageHeaderWrapper content="求解多车辆路径问题 (VRP)" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card>
            <Steps size="small" current={step} className={styles.steps}>
              <Step title="算法" />
              <Step title="选点" />
              <Step title="计算" />
            </Steps>
            {component}
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <BaiduMap />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {renderResultTable(calcStatus)}
        </Col>
      </Row>
    </>
  );
};

export default StepForm;
