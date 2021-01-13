import React, { useState } from 'react';
import { Form, Button, Divider, Select, InputNumber, message } from 'antd';
import type { StepComponentTypeProps } from '../../data';
import styles from './index.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 10,
  },
};

const Step1Form: React.FC<StepComponentTypeProps> = (props) => {
  const { setAlgorithmData, setCurrentStep, algorithmData } = props;
  const { algorithm, initialTemp, finalTemp, coolingRate, chainLength } = algorithmData;

  const [algorithmSelected, reselectAlgorithm] = useState<string>(algorithm);

  const [form] = Form.useForm();

  if (!algorithmData) {
    return null;
  }

  // will be going to step 2
  const onValidateForm = async () => {
    const values = await form.validateFields();
    // console.log(values);
    // console.log(values.finalTemp, finalTemp);
    // validate again before entering step 2
    if (algorithmSelected === 'SA') {
      if (
        values.initialTemp <= 0 ||
        values.finalTemp <= 0 ||
        values.initialTemp <= values.finalTemp ||
        values.coolingRate <= 0 ||
        values.coolingRate >= 1 ||
        values.chainLength <= 1
      ) {
        message.error(`某些参数不合法！`);
        return;
      }
    } else {
      message.error(`选中算法不合法！`);
      return;
    }
    setAlgorithmData({ ...algorithmData, ...values });
    // TODO step3 计算后，可通过set TSP页面的State，传step3界面实时计算结果至father comp,再从props传给 1、3、4 child comp.
    setCurrentStep('step2');
  };

  const algorithmSelectorHandler = (value: string) => {
    reselectAlgorithm(value);
  };

  const renderSwitch = (algorithmChoice: string) => {
    switch (algorithmChoice) {
      case 'SA':
        return (
          <>
            <Form.Item
              label="初始温度"
              name="initialTemp"
              rules={[{ required: true, message: '请输入初始温度' }]}
            >
              <InputNumber
                // @ts-ignore
                initialValues={initialTemp}
                min={1}
                formatter={(value) => `${value}  'C`}
                parser={(value) => (value ? value.replace("  'C", '') : initialTemp)}
              />
            </Form.Item>
            <Form.Item
              label="终止温度"
              name="finalTemp"
              rules={[{ required: true, message: '请输入终止温度' }]}
            >
              <InputNumber
                // @ts-ignore
                initialValues={finalTemp}
                min={1e-9}
                step={1}
                formatter={(value) => `${value}  'C`}
                parser={(value) => (value ? value.replace("  'C", '') : finalTemp)}
              />
            </Form.Item>
            <Form.Item
              label="降温速率"
              name="coolingRate"
              rules={[{ required: true, message: '请输入降温速率' }]}
            >
              <InputNumber
                // @ts-ignore
                initialValues={coolingRate}
                min={0}
                max={0.99}
                step={0.1}
              />
            </Form.Item>
            <Form.Item
              label="Markov 链长"
              name="chainLength"
              rules={[{ required: true, message: '请输入 Markov 链长' }]}
            >
              <InputNumber
                // @ts-ignore
                initialValues={chainLength}
                min={1}
                max={500}
                step={10}
              />
            </Form.Item>
          </>
        );
      case 'GA':
        return (
          <Form.Item
            label="演示参数随算法切换"
            name="param"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber
              // @ts-ignore
              initialValues={1}
            />
          </Form.Item>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        hideRequiredMark
        initialValues={algorithmData}
      >
        <Form.Item
          label="算法选择"
          name="algorithm"
          rules={[{ required: true, message: '请选择算法' }]}
        >
          <Select placeholder="请选择" onChange={algorithmSelectorHandler}>
            <Option value="SA">模拟退火算法</Option>
            <Option value="GA">遗传算法</Option>
          </Select>
        </Form.Item>
        <Divider />
        {renderSwitch(algorithmSelected)}
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

export default Step1Form;
