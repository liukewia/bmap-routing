import React from 'react';
import { Table } from 'antd';

const dataSource = [
  {
    key: '1',
    carIndex: '1',
    route: '四季青阳光科技园区-东1门 (@ 0 min) -> 对外经济贸易大学-西门 (@ 29 min) -> 北京师范大学北院-西3门 (@ 46 min) -> 四季青阳光科技园区-东1门 (@ 63 min)',
    distance: '43',
    loadRate: '100%',
  },
  {
    key: '2',
    carIndex: '2',
    route: '四季青阳光科技园区-东1门 (@ 0 min) -> 中央美术学院-东门 (@ 26 min) -> 四季青阳光科技园区-东1门 (@ 51 min)',
    distance: '31',
    loadRate: '66%',
  },
];

const columns = [
  {
    title: '车辆序号',
    dataIndex: 'carIndex',
    key: 'carIndex',
  },
  {
    title: '路径（到达各点时间）',
    dataIndex: 'route',
    key: 'route',
  },
  {
    title: '行驶路程（km）',
    dataIndex: 'distance',
    key: 'distance',
  },
  {
    title: '满载率',
    dataIndex: 'loadRate',
    key: 'loadRate',
  },
];


const ResultTable = () => {

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
    />
  );
};

export default ResultTable;
