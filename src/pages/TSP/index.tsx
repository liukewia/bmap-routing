import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Step1Form from './components/Step1Form';
import Step2Form from './components/Step2Form';
import StepResult from './components/StepResult';
import { Map, Marker, NavigationControl, InfoWindow, MapApiLoaderHOC } from 'react-bmapgl';
import type { StepComponentTypeProps, CurrentStepType, algorithmDataType } from './data';
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

  const stepComponentProps: StepComponentTypeProps = {
    currentStep,
    setCurrentStep,
    algorithmData,
    setAlgorithmData,
  };

  const { step, component } = useMemo(() => {
    const getCurrentStepAndComponent = (curr = 'step1') => {
      const stepAndComponent = {
        // spreading syntax
        step1: { step: 0, component: <Step1Form {...stepComponentProps} /> },
        step2: { step: 1, component: <Step2Form {...stepComponentProps} /> },
        result: { step: 2, component: <StepResult {...stepComponentProps} /> },
      };
      return stepAndComponent[curr];
    };

    return getCurrentStepAndComponent(currentStep);
  }, [currentStep]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <PageHeaderWrapper content="求解单车辆路径问题 / 旅行商问题 (TSP)" />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <Card>
            <>
              <Steps size="small" current={step} className={styles.steps}>
                <Step title="算法" />
                <Step title="选点" />
                <Step title="计算" />
              </Steps>
              {component}
            </>
          </Card>
        </Col>
        <Col span={14}>
          <Card>
            <Map
              center={new BMapGL.Point(116.4, 39.91)}
              zoom={11}
              onClick={(e) => console.log(e)}
              enableDragging={true}
              enableScrollWheelZoom={true}
            >
              <Marker position={new BMapGL.Point(116.4, 39.91)} icon="start" />
              <NavigationControl />
              <InfoWindow position={new BMapGL.Point(116.4, 39.91)} title="标题" text="内容" />
            </Map>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12} />
        <Col span={12} />
      </Row>
    </>
  );
};

export default MapApiLoaderHOC({ ak: 'OalRnqTPhFKA9F4CwPQwCtprspgDqGG3' })(StepForm);
