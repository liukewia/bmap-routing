import React, { useState } from 'react';
import { Form, Button, Divider, Space, message, Alert, Typography } from 'antd';
import EditableTable from "@/components/EditableTable";

import type { POIDataType, StepAndComponentPropsType } from '../../data';

const { Text } = Typography;

const customValidation = (data: POIDataType[]) => {
  const len = data.length;
  if ( len < 3 ) {
    throw new Error(`只输入了 ${len} 处地点，计算量过少。`);
  }

  const capacity: number = data[0].demand;
  // 普通 for 循环的性能远远高于 forEach 的性能
  for (let index = 0; index < len; index += 1) {
    const point = data[index];
    if ( point.lng === 0 || point.lat === 0 ) {
      throw new Error(`第 ${index + 1} 行的 ${point.name} 为无效地点！`);
    }
    if ( point.demand <= 0 ) {
      throw new Error(`第 ${index + 1} 行的 ${point.name} 的需求量不合法！`);
    }
    if ( capacity < point.demand ) {
      throw new Error(`车辆载重量过小，不足以装载第 ${index + 1} 行的 ${point.name} 处货物！`);
    }
  }
}


const Step2Form: React.FC<any> = ({
  rootPOIData,
  setRootPOIData,
  setCurrentStep
}) => {
  const [step2POIData, setStep2POIData] = useState<POIDataType[]>(rootPOIData);


  const [form] = Form.useForm();

  if (!rootPOIData) {
    return null;
  }

  // const { validateFields, getFieldsValue } = form;

  

  const onPrev = () => {
    // const values = getFieldsValue();  // 获取不到Editable Table的值
    try {
      customValidation(step2POIData);
      setRootPOIData(step2POIData);
      setCurrentStep('step1');
    } catch (e) {
      message.error(e.message);
    }
  };

  const onNext = () => {
    // const values = await validateFields();
    // validate step2POIData, then setRootPOIData, and go forward.
    try {
      customValidation(step2POIData);
      setRootPOIData(step2POIData);
      setCurrentStep('result');
    } catch (e) {
      message.error(e.message);
    }
  };

  return (
    <Form
      form={form}
      layout="horizontal"
    >
      <Divider />
      <Alert
        message={
          <Space direction="vertical">
            <Text>1. 点击地点可以直接在线搜索并修改；</Text>
            <Text>2. 首行地点为配送点，其需求量为每辆车的载重；其余行地点为需求点。</Text>
            <Text>3. 配送至需求点的车辆数不需要设置，由计算得出结果。</Text>
          </Space>}
        type="info"
        showIcon
        closable
        style={{ marginBottom: 20 }}
      />
      <Form.Item>
        <EditableTable
          step2POIData={step2POIData}
          setStep2POIData={setStep2POIData}
        />
      </Form.Item>
      <Form.Item>
        <Space
          // TODO 居中
          style={{ marginLeft: '150px' }}
          size='large'
        >
          <Button onClick={onPrev}>
            上一步
          </Button>
          <Button
            type="primary"
            onClick={onNext}
          >
            提交
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};


export default Step2Form;
