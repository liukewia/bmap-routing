import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import styles from './Welcome.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message="更快更强的重型组件，已经发布。"
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};
