import React, { useContext, useState } from 'react';
import { Table, Select, InputNumber, Button, Form, message } from 'antd';
// 后期删除 pro 组件
import ProField from '@ant-design/pro-field';
import ProCard from '@ant-design/pro-card';
import type { FormInstance } from 'antd/lib/form';
import { DeleteOutlined } from '@ant-design/icons';


import type { POIDataType } from '@/pages/VRP/data';
import { fetchBmapPOI } from '@/services/bmap-service';

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
  handleSave: (record: POIDataType) => void;
}

type rawPOIDataType = {
  key: React.Key;
  name: string;
  lng: number;  // longitude
  lat: number;  // latitude
}

const { Option } = Select;

// below is for Cell definition
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,  // Editable Table 传来的 set state 方法
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);

  // 下面两个state是
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<rawPOIDataType[]>([]);
  
  // const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  // 这个副作用是点编辑时，input不一定在编辑态。
  // 此时 强制input进入编辑态，才能保证blur时还原到不可编辑状态
  // 然而，antd的select 和 inputnumber都有autofocus prop，就input没有.
  // useEffect(() => {
  //   if (editing && inputRef.current) {
  //     inputRef.current!.focus();
  //   }
  // }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const handleSearch = (userInput: string) => {
    if (userInput) {
      try {
        fetchBmapPOI(userInput, searchData => {
          console.log(searchData);
          setSearchResult(searchData);
        });
      } catch (errInfo) {
        console.log('Search failed:', errInfo);
      }
    } else {
      setSearchResult([]);
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      toggleEdit();
      handleSave({ ...record, ...values }); // values覆盖record相同key部分
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  
  // 在 oop 里，自然的想法是子类继承 Editable Cell 降低耦合，但在这里似乎无法做到，并且 https://ant.design/components/table-cn/#components-table-demo-edit-row 里的 official demo 也是在一个类里用 unary operator 实现 不同组件的。
  const renderSwitch = (dataIndexType: string) => {
    switch (dataIndexType) {
      case 'name':
        return (
          <Select
            // ref={selectorRef}
            showSearch
            autoFocus
            value={this.state.value}  // 搜索得到的n条数据
            placeholder="input search text"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onBlur={save}
          >
            {searchResult.map(d => <Option key={d.value}>{d.text}</Option>)}
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
        title: '需求(首行为车辆载重)',
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

  

  handleDelete = (key: React.Key) => {
    try {
      const dataSource = [...this.props.step2POIData];
      this.props.setStep2POIData(dataSource.filter(item => item.key !== key));
      message.success('删除地点成功！');
    } catch (e) {
      message.error(`删除地点失败，${e.message} !`);
    }
  };

  // 不改名
  handleAdd = () => {
    const dataSource = [...this.props.step2POIData];
    const newData: POIDataType = {
      key: Math.random().toString(36).slice(-8),  // 非 bmap poi key
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
          // props -> editable cell
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