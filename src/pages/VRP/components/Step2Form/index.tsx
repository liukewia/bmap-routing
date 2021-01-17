import React, { useState } from 'react';
import { Form, Button, Divider, Space } from 'antd';
import EditableTable from "@/components/EditableTable";
import SearchInput from "@/components/SearchInput";

import type { POIDataType, StepAndComponentPropsType } from '../../data';


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

  const { validateFields, getFieldsValue } = form;

  const onPrev = () => {
    // const values = getFieldsValue();  // 获取不到Editable Table的值
    console.log(step2POIData);
    
    // although go back, save POI data.
    setRootPOIData(step2POIData);
    setCurrentStep('step1');
  };

  const onValidateForm = async () => {
    // const values = await validateFields();
    console.log(step2POIData);
    // is going to step 3, save POI data.
    setRootPOIData(step2POIData);
    setCurrentStep('result');
  };

  return (
    <Form
      form={form}
      layout="horizontal"
    >
      <Divider />
      <Form.Item>
        <EditableTable
          step2POIData={step2POIData}
          setStep2POIData={setStep2POIData}
        />
      </Form.Item>
      <SearchInput />
      <Form.Item>
        <Space
          // TODO 如何居中
          style={{ marginLeft: '150px' }}
          size='large'
        >
          <Button onClick={onPrev}>
            上一步
          </Button>
          <Button
            type="primary"
            onClick={onValidateForm}
          >
            提交
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};


export default Step2Form;
