import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';
import StepResult from './components/StepResult';
import BaiduMap from '@/components/BaiduMap';
import type {
  CurrentStepType,
  algorithmDataType,
  POIType,
  StepAndComponentPropsType,
} from './data';
import styles from './style.less';

const { Step } = Steps;

const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CurrentStepType>('step1');
  const [algorithmData, setAlgorithmData] = useState<algorithmDataType>({
    algorithm: 'SA',
    initialTemp: 1e3,
    finalTemp: 1e-3,
    coolingRate: 0.9,
    chainLength: 10,
  });
  const [POIs, setPOIs] = useState<POIType[]>([]);

  const stepAndComponentProps: StepAndComponentPropsType = {
    currentStep,
    setCurrentStep,
    algorithmData,
    setAlgorithmData,
    POIs,
    setPOIs,
  };

  const { step, component } = useMemo(() => {
    const getCurrentStepAndComponent = (curr = 'step1') => {
      const stepAndComponent = {
        // spreading syntax
        step1: {
          step: 0,
          component: <Step1Form {...stepAndComponentProps} />
        },
        step2: {
          step: 1,
          component: <Step2Form {...stepAndComponentProps} />
        },
        result: {
          step: 2,
          component: <StepResult {...stepAndComponentProps} />
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
      <Row gutter={[16, 16]}>
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
        <Col span={10} />
        <Col span={14} />
      </Row>
    </>
  );
};

export default StepForm;
