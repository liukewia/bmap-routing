import React from 'react';
import { Form, Button, Divider, Input, Space } from 'antd';
import { useRequest } from 'umi';
import { fakeSubmitForm } from '../../service';
import type { StepComponentTypeProps } from '../../data';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const Step2: React.FC<StepComponentTypeProps> = (props) => {
  const [form] = Form.useForm();

  const { setAlgorithmData, setCurrentStep, algorithmData: data } = props;

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
      {...formItemLayout}
      form={form}
      layout="horizontal"
      className={styles.stepForm}
      initialValues={{ password: '123456' }}
    >
      {/* <Alert
        closable
        showIcon
        message="确认转账后，资金将直接打入对方账户，无法退回。"
        style={{ marginBottom: 24 }}
      /> */}
      <Divider style={{ margin: '24px 0' }} />
      <Form.Item
        label="支付密码"
        name="password"
        required={false}
        rules={[{ required: true, message: '需要支付密码才能进行支付' }]}
      >
        <Input type="password" autoComplete="off" style={{ width: '80%' }} />
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 8 }}
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: {
            span: formItemLayout.wrapperCol.span,
            offset: formItemLayout.labelCol.span,
          },
        }}
      >
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button type="link" htmlType="button">
            Fill
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default Step2;
