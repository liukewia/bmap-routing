import React from 'react';
import { Form, Button, Divider, Space } from 'antd';
import EditableTable from "@/components/EditableTable";
import SearchInput from "@/components/SearchInput";
import type { StepAndComponentPropsType } from '../../data';


const Step2Form: React.FC<StepAndComponentPropsType> = (props) => {
  const [form] = Form.useForm();

  const { POIData, setPOIData, setCurrentStep } = props;

  if (!POIData) {
    return null;
  }

  const { validateFields, getFieldsValue } = form;

  const onPrev = () => {
    const values = getFieldsValue();
    // although go back, save POI data.
    setPOIData({ ...POIData, ...values });
    setCurrentStep('step1');
  };

  const onValidateForm = async () => {
    const values = await validateFields();

    // is going to step 3, save POI data.
    setPOIData({ ...POIData, ...values });
    setCurrentStep('result');
  };

  return (
    <Form
      form={form}
      layout="horizontal"
    >
      <Divider />
      <Form.Item>
        <EditableTable />
      </Form.Item>
      <Form.Item>
        <SearchInput />
      </Form.Item>
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
