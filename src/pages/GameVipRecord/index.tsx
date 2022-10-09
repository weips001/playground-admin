import { FormInstance } from 'antd';
import React, { useRef, useEffect } from 'react';
import {useModel} from 'umi'
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getTableList } from './service';
import moment from 'moment';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const searchFormRef = useRef<FormInstance>();
  const {search, changeSearch} = useModel('search', model => ({search: model.search, changeSearch: model.changeSearch}))

  useEffect(() => {
    searchFormRef.current?.setFieldsValue(search)
  }, [])

  const onSubmit = (params) => {
    changeSearch(params)
  }
  const onReset = () => {
    changeSearch({})
  }
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
      title: '充值金额',
      hideInSearch: true,
      dataIndex: 'money',
      valueType: 'money',
    },
    {
      title: '总个数',
      hideInSearch: true,
      dataIndex: 'total',
    },
    {
      title: '充值时间',
      dataIndex: 'createTime',
      // initialValue: moment(new Date()).format('YYYY-MM-DD'),
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: '充值时间',
      dataIndex: 'createTime',
      initialValue: new Date(),
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
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
        params={search}
        onSubmit={onSubmit}
        onReset={onReset}
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
