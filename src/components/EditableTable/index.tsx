import React, { useContext, useState } from 'react';
import { Table, InputNumber, Button, Form, message, Space, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProField from '@ant-design/pro-field';
import { DeleteOutlined } from '@ant-design/icons';
import SearchInput from '@/components/SearchInput';
import CitySelector from '@/components/CitySelector';
import { generatePointKey } from '@/services/bmap-service';
import { Typography } from 'antd';

import type { ReactText } from 'react';
import type { FormInstance } from 'antd/lib/form';
import type { RawPOIDataType } from '@/services/bmap-type';
import type { POIDataType } from '@/pages/VRP/data';

const { Text } = Typography;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

type EditableRowProps = {
  index: number;
}

// below is for Row definition
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

type EditableCellProps = {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof POIDataType;
  record: POIDataType;  // 仅显示 name & demand
  priorSearchCity: { arr: ReactText[] };
  handleSave: (record: POIDataType) => void;
}


const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  priorSearchCity,
  handleSave,  // Editable Table 传来的 set state 方法
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);

  const form = useContext(EditableContext)!;

  // 这个副作用是点编辑时，input不一定在编辑态。
  // 此时 强制input进入编辑态，才能保证blur时还原到不可编辑状态
  // 然而，antd的select 和 inputnumber都有autofocus prop，就input没有.
  // useEffect(() => {
  //   if (editing && inputRef.current) {
  //     inputRef.current!.focus();
  //   }
  // }, [editing]);

  const toggleEdit = (): void => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const saveSearchResult = async (selectedRow: RawPOIDataType) => {
    try {
      const { key, ...resultWithoutKey } = selectedRow;
      await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...resultWithoutKey });  // 不改 key
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const saveDemand = async (): Promise<void> => {
    try {
      const values = await form.validateFields();  // 检查NamePath[]是否符合 form rules
      toggleEdit();  // !edit 并 更新 form 显式内容
      handleSave({ ...record, ...values }); // values覆盖record相同key部分
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  // 在 oop 里，自然的想法是子类继承 Editable Cell 降低耦合，但在这里似乎无法做到，并且 https://ant.design/components/table-cn/#components-table-demo-edit-row 里的 official demo 也是在一个类里用判断来实现对不同组件的切换的。

  const renderSwitch = (dataIndexType: string): JSX.Element => {
    switch (dataIndexType) {
      case 'name':
        return (
          <SearchInput
            record={record}
            saveSearchResult={saveSearchResult}
            priorSearchCity={priorSearchCity}
          />
        );
      case 'demand':
        return (
          <InputNumber
            autoFocus
            onPressEnter={saveDemand}
            onBlur={saveDemand}
            min={0}  // 但不能等于 0，由于无法设置开区间，在validate时再检查
            step={1}
            style={{ width: '100%' }}
          />
        );
      default:
        return <></>;
    }
  };

  let childNode = children;

  if (editable) {    
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        {renderSwitch(dataIndex)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type FormPassedProps = {
  step2POIData: POIDataType[];
  setStep2POIData: React.Dispatch<React.SetStateAction<POIDataType[]>>;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

class EditableTable extends React.Component<EditableTableProps & FormPassedProps, any> {
  columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];
  // 变量声明在最小化的作用域内，同时修改时仅修改object的引用值，就不用作为状态刷新多个子组件
  priorSearchCity: { arr: ReactText[] } = { arr: ['北京市'] };

  constructor(props: EditableTableProps & FormPassedProps) {
    
    super(props);

    this.columns = [
      {
        title: '地点',
        dataIndex: 'name',
        editable: true,
      },
      {
        title: '需求',
        dataIndex: 'demand',
        width: '25%',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 65,
        render: (_, record: { key: React.Key }) =>
          this.props.step2POIData.length >= 1 ? (
            <DeleteOutlined disabled onClick={() => this.handleDelete(record.key)}/>
          ) : null,
      },
    ];
  }

  handleDefaultCity = (newCity: ReactText[]): void => {
    this.priorSearchCity.arr = newCity;
  }

  handleDelete = (key: React.Key): void => {
    try {
      const dataSource = [...this.props.step2POIData];
      this.props.setStep2POIData(dataSource.filter(item => item.key !== key));
      message.success('删除地点成功！');
    } catch (e) {
      message.error(`删除地点失败，${e.message} !`);
    }
  };

  handleAdd = (): void => {
    const dataSource = [ ...this.props.step2POIData ];

    const newData: POIDataType = {
      key: generatePointKey(),  // 非 bmap poi key
      name: '[新地点]',
      lng: 0,
      lat: 0,
      demand: 1,
    };
    this.props.setStep2POIData([...dataSource, newData]);
    
    message.success('已在底部添加一行！');
  };

  handleSave = (row: POIDataType): void => {
    const newData = [...this.props.step2POIData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.setStep2POIData(newData);
  };

  render() {
    const { step2POIData } = this.props;

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: POIDataType) => ({
          // props -> editable cell
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          priorSearchCity: this.priorSearchCity,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 20 }}  // Add row 按钮与表格之间距离
        >
          Add a row
        </Button>
        <Space style={{ float: 'right' }}>
        <Tooltip title="优先是指输入地点时无需输入城市名也优先在该城市内查找。但若输入城市+地址，则尝试在全国范围内查找。">
          <Text>优先搜索城市：</Text>
        </Tooltip>
          <CitySelector
            priorSearchCity={this.priorSearchCity}
            handleDefaultCity={this.handleDefaultCity}
          />
        </Space>
        <Table
          components={components}
          rowClassName="editable-row"
          bordered
          sticky
          dataSource={step2POIData}
          columns={columns as ColumnTypes}
          pagination={false}
          scroll={{ y: 300 }}  // 可观察到的y高度 单位px
        />
        <ProCard title="表格数据" collapsible defaultCollapsed>
          <ProField
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            mode="read"
            valueType="jsonCode"
            text={JSON.stringify(step2POIData)}
          />
        </ProCard>
      </>
    );
  }
}

export default EditableTable;