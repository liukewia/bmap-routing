import { Button, Result } from 'antd';
import React from 'react';
import type { StepAndComponentPropsType } from '../../data';
import styles from './index.less';

const Step3: React.FC<StepAndComponentPropsType> = (props) => {
  const { setCurrentStep, algorithmData: data } = props;

  if (!data) {
    return null;
  }

  const onFinish = () => {
    setCurrentStep('step1');
  };
  const extra = (
    <>
      <Button type="primary" onClick={onFinish}>
        再转一笔
      </Button>
      <Button>查看账单</Button>
    </>
  );
  return (
    <Result
      status="success"
      title="操作成功"
      subTitle="预计两小时内到账"
      extra={extra}
      className={styles.result}
    ></Result>
  );
};

export default Step3;
