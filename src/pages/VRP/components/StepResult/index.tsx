import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProField from '@ant-design/pro-field';

import { initialAlgoData, initialPointData } from '@/pages/VRP';

import type { StepAndComponentPropsType } from '../../data';
import styles from './index.less';

const Step3: React.FC<any> = (props) => {
  const { setCurrentStep, rootAlgoData, setRootAlgoData, rootPOIData, setRootPOIData, setCalcStatus } = props;

  // constructor
  useEffect(() => {
    setCalcStatus(1); // 开始计算
    const timer = setTimeout(() => setCalcStatus(2), 3000);
    return () => clearTimeout(timer);
  });

  if (!rootAlgoData) {
    return null;
  }

  const onRestart = () => {
    setRootAlgoData(initialAlgoData);
    setRootPOIData(initialPointData);
    setCurrentStep('step1');
    setCalcStatus(0);
  };

  const extra = (
    <Button
      type="primary"
      onClick={onRestart}>
      重新开始
    </Button>
  );

  return (
    <>
      <Result
        status="success"
        title="计算中"
        // subTitle={calcStatus === 2 ? '已迭代500次，最优总路程为 116 km，共需 2 辆车。' : null}
        extra={extra}
        className={styles.result}
      >
      </Result>
      <ProCard
        title="表单数据"
        collapsible
        defaultCollapsed
        style={{ width: '100%' }
      }
      >
        <ProField
          fieldProps={{
            style: {
              width: '48%',
              float: 'left',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(rootAlgoData)}
        />
        <ProField
          fieldProps={{
            style: {
              width: '48%',
              float: 'right',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(rootPOIData)}
        />
      </ProCard>
    </>
  );
};

export default Step3;
