import React from 'react';
import { Form, Button, Divider, Space } from 'antd';
import EditableTable from "@/components/EditableTable";
import EditableTablePro from "@/components/EditableTablePro";
import { useRequest } from 'umi';
import { fakeSubmitForm } from '../../service';
import type { StepAndComponentPropsType } from '../../data';
import styles from './index.less';

// const formItemLayout = {
//   labelCol: {
//     span: 5,
//   },
//   wrapperCol: {
//     span: 19,
//   },
// };

const Step2Form: React.FC<StepAndComponentPropsType> = (props) => {
  const [form] = Form.useForm();

  const { algorithmData: data, setAlgorithmData, setCurrentStep } = props;

  const { loading: submitting, run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: (_, params) => {
      setAlgorithmData(params[0]);
      setCurrentStep('result');
    },
  });
  if (!data) {
    return null;
  }
  const { validateFields, getFieldsValue } = form;
  const onPrev = () => {
    const values = getFieldsValue();
    setAlgorithmData({ ...data, ...values });
    setCurrentStep('step1');
  };
  const onValidateForm = async () => {
    const values = await validateFields();
    run({ ...data, ...values });
  };

  return (
    <Form
      // {...formItemLayout}
      form={form}
      layout="horizontal"
      className={styles.stepForm}
    >
      <Divider />
      <Form.Item
        // label="支付密码"
        // name="password"
        // required={false}
        // rules={[{ required: true, message: '需要支付密码才能进行支付' }]}
      >
        <EditableTable />
        {/* <EditableTablePro /> */}
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 8 }}
        // wrapperCol={{
        //   xs: { span: 24, offset: 0 },
        //   sm: {
        //     span: formItemLayout.wrapperCol.span,
        //     offset: formItemLayout.labelCol.span,
        //   },
        // }}
      >
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};


export default Step2Form;
