import { Tag, FormInstance } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getTableList } from './service';
import { cardTypeEnum } from '@/utils/constant';

const compStatusList = {
  0: {
    text: <Tag color="default">体验期</Tag>,
    status: 'Default',
  },
  1: {
    text: <Tag color="success">已激活</Tag>,
    status: 'Success',
  },
  2: {
    text: <Tag color="error">已过期</Tag>,
    status: 'Error',
  },
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const searchFormRef = useRef<FormInstance>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      order: 2,
    },
    {
      title: '卡号',
      dataIndex: 'cardId',
      order: 1,
    },
    {
      title: '充值日期',
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '卡种',
      dataIndex: 'cardType',
      valueEnum: cardTypeEnum,
    },
    {
      title: '金额',
      hideInSearch: true,
      dataIndex: 'money',
    },
    {
      title: '总次数',
      hideInSearch: true,
      dataIndex: 'total',
    },
    {
      title: '有效期',
      dataIndex: 'overdate',
      hideInForm: true,
      sorter: true,
      hideInSearch: true,
      valueType: 'date',
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        bordered={true}
        actionRef={actionRef}
        formRef={searchFormRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
