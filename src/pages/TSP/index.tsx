import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StepBaseForm from './components/StepBaseForm';
import StepConfirmForm from './components/StepConfirmForm';
import StepResult from './components/StepResult';
import { Map, Marker, NavigationControl, InfoWindow, MapApiLoaderHOC } from 'react-bmapgl';
import type { StepComponentTypeProps, StepDataType, CurrentTypes } from './data';
import styles from './style.less';

const { Step } = Steps;

const StepForm: React.FC = () => {
  const [current, setCurrent] = useState<CurrentTypes>('base');
  const [stepData, setStepData] = useState<StepDataType>({
    payAccount: 'ant-design@alipay.com',
    receiverAccount: 'test@example.com',
    receiverName: 'Alex',
    amount: '500',
  });

  const stepComponentProps: StepComponentTypeProps = { current, setCurrent, stepData, setStepData };

  const { step, component } = useMemo(() => {
    const getCurrentStepAndComponent = (curr = 'base') => {
      const stepAndComponent = {
        base: { step: 0, component: <StepBaseForm {...stepComponentProps} /> },
        confirm: { step: 1, component: <StepConfirmForm {...stepComponentProps} /> },
        result: { step: 2, component: <StepResult {...stepComponentProps} /> },
      };
      return stepAndComponent[curr];
    };

    return getCurrentStepAndComponent(current);
  }, [current]);

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
                <Step title="完成" />
              </Steps>
              {component}
            </>
          </Card>
        </Col>
        <Col span={14}>
          <Card>
            <Map center={new BMapGL.Point(116.4, 39.91)} zoom={11} onClick={(e) => console.log(e)}>
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
