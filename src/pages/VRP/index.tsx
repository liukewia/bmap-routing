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
  POIDataType,
  StepAndComponentPropsType,
} from './data';
import styles from './style.less';

const { Step } = Steps;

const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CurrentStepType>('step1');

  const [rootAlgoData, setRootAlgoData] = useState<algorithmDataType>({
    algorithm: 'SA',
    initialTemp: 1e3,
    finalTemp: 1e-3,
    coolingRate: 0.9,
    chainLength: 10,
  });

  const [rootPOIData, setRootPOIData] = useState<POIDataType[]>([
    {
      key: 'ww1i25sk',
      name: '四季青阳光科技园区-东1门',
      lng: 116.426549,
      lat: 39.779675,
      demand: 6,  // 每车载重量
    },
    {
      key: 'p8lbmzcb',
      name: '北京师范大学北院-西3门',
      lng: 116.409614,
      lat: 39.942402,
      demand: 1,
    },
  ]);

  const stepAndComponentProps: StepAndComponentPropsType = {
    currentStep,
    setCurrentStep,
    rootAlgoData,
    setRootAlgoData,
    rootPOIData,
    setRootPOIData,
  };

  const { step, component } = useMemo(() => {
    const getCurrentStepAndComponent = (curr = 'step1') => {
      const stepAndComponent = {
        step1: {
          step: 0,
          // spreading syntax with only one object can be spreaded
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
        <Col span={16}>
          <Card>
            <Steps size="small" current={step} className={styles.steps}>
              <Step title="算法" />
              <Step title="选点" />
              <Step title="计算" />
            </Steps>
            {component}
          </Card>
        </Col>
        <Col span={8}>
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
