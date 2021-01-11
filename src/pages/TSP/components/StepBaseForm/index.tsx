import React from 'react';
import { Form, Button, Divider, Input, Select } from 'antd';
import type { StepComponentTypeProps } from '../../data';
import styles from './index.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const StepBaseForm: React.FC<StepComponentTypeProps> = (props) => {
  const { setStepData, setCurrent, stepData: data } = props;

  const [form] = Form.useForm();

  if (!data) {
    return null;
  }
  const { validateFields } = form;
  const onValidateForm = async () => {
    const values = await validateFields();
    setStepData({ ...data, ...values });
    setCurrent('confirm');
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        hideRequiredMark
        initialValues={data}
      >
        <Form.Item
          label="算法选择"
          name="payAccount"
          rules={[{ required: true, message: '请选择付款账户' }]}
        >
          <Select placeholder="test@example.com">
            <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
          </Select>
        </Form.Item>
        <Divider />
        <Form.Item
          label="收款人姓名"
          name="receiverName"
          rules={[{ required: true, message: '请输入收款人姓名' }]}
        >
          <Input placeholder="请输入收款人姓名" />
        </Form.Item>
        <Form.Item
          label="转账金额"
          name="amount"
          rules={[
            { required: true, message: '请输入转账金额' },
            {
              pattern: /^(\d+)((?:\.\d+)?)$/,
              message: '请输入合法金额数字',
            },
          ]}
        >
          <Input prefix="￥" placeholder="请输入金额" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default StepBaseForm;
