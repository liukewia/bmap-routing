import React, { useState } from 'react';
import { Form, Button, Divider, Space, message, Alert } from 'antd';
import EditableTable from "@/components/EditableTable";

import type { POIDataType, StepAndComponentPropsType } from '../../data';


const validatePOI = (data: POIDataType[]) => {
  const capacity: number = data[0].demand;
  data.forEach(POI => {
    if ( POI.lng === 0 || POI.lat === 0 ) {
      throw new Error(`${POI.name} 的经纬度不正确！`);
    }
    if ( POI.demand <= 0 ) {
      throw new Error(`${POI.name} 的需求量不合法！`);
    }
    if ( capacity < POI.demand ) {
      throw new Error(`车辆载重量过小，不足以装载 ${POI.name} 处货物！`);
    }
  });
}

const Step2Form: React.FC<StepAndComponentPropsType> = ({
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
    const POIData = JSON.parse(JSON.stringify(step2POIData));
    // const values = getFieldsValue();  // 获取不到Editable Table的值
    console.log(POIData);
    // Wrap it with try & catch since return cannot jump out of outer function.
    try {
      validatePOI(step2POIData);

      // if having thrown no error after check, continue; else shut down. although just go back, it still will set root state, so CHECK before saving POI data.
      setRootPOIData(POIData);
      setCurrentStep('step1');
    } catch (e) {
      message.error(e.message);
    }
  };

  const onNext = async () => {
    // const values = await validateFields();
    console.log(step2POIData);
    // validate step2POIData, then setRootPOIData, and go forward.
    try {
      validatePOI(step2POIData);

      // is going to step 3, save POI data.
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
        message="1. 点击地点可以直接在线搜索并修改；  2. 首行地点为配送点，其需求量为每辆车的载重；其余行地点为需求点。  3.配送至需求点的车辆数不需要设置，由计算得出结果。"
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
