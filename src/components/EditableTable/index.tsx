import React, { useContext, useState } from 'react';
import { Table, Select, InputNumber, Button, Form, message } from 'antd';
// 后期删除 pro 组件
import ProField from '@ant-design/pro-field';
import ProCard from '@ant-design/pro-card';
import type { FormInstance } from 'antd/lib/form';
import { DeleteOutlined } from '@ant-design/icons';

import { localSearch } from '@/services/bmap-service';

import type { POIDataType } from '@/pages/VRP/data';

const { Option } = Select;

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
  record: POIDataType;
  handleSave: (record: POIDataType) => void;
}


// below is for Cell definition
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  // const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  // 这个副作用其实挺的，就是点编辑时，input不一定在编辑态。
  // 此时 强制input进入编辑态，才能保证blur时还原到不可编辑状态
  // 然而，antd的select 和 inputnumber都有autofocus prop，就input 没有...
  // 开心切换。
  // useEffect(() => {
  //   if (editing && inputRef.current) {
  //     inputRef.current!.focus();
  //   }
  // }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values }); // values覆盖record相同key部分
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  
  const renderSwitch = (dataIndexType: string) => {
    switch (dataIndexType) {
      case 'name':
        return (
          <Select
            // ref={selectorRef}
            showSearch
            autoFocus
            placeholder="input search text"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            // onSearch={this.handleSearch}
            onBlur={save}
          >
            {/* TODO 加入 {options} */}
          </Select>
        );
      case 'demand':
        return (
          <InputNumber
            // ref={inputRef}
            autoFocus
            onPressEnter={save}
            onBlur={save}
            min={0}  // 但不能等于 0，由于无法设置开区间，在validate时再检查
            step={1}
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

// type EditableTableState = {
//   dataSource: POIDataType[];
// }

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

class EditableTable extends React.Component<EditableTableProps & FormPassedProps, any> {
  columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];

  constructor(props: EditableTableProps & FormPassedProps) {
    
    super(props);
    // console.log(props);

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
            <DeleteOutlined onClick={() => this.handleDelete(record.key)}/>
          ) : null,
      },
    ];
  }

  handleDelete = (key: React.Key) => {
    const dataSource = [...this.props.step2POIData];
    this.props.setStep2POIData(dataSource.filter(item => item.key !== key));
  };

  // 不改名
  handleAdd = () => {
    const dataSource = [...this.props.step2POIData];
    const newData: POIDataType = {
      key: Math.random().toString(36).slice(-8),
      name: '[新地点]',
      lng: 0,
      lat: 0,
      demand: 1,
    };
    this.props.setStep2POIData([...dataSource, newData]);
    // console.log(this.props.step2POIData);
    
    message.success('已在底部添加一行！');
  };

  handleSave = (row: POIDataType) => {
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
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
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
        {/* 辅助 */}
        <ProCard title="表格数据" headerBordered collapsible defaultCollapsed>
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