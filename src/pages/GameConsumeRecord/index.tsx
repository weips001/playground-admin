import { FormInstance } from 'antd';
import React, { useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getTableList } from './service';
import {useModel} from 'umi'
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
      title: '消费个数',
      hideInSearch: true,
      dataIndex: 'gameBiNum',
    },
    {
      title: '消费时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '消费时间',
      dataIndex: 'createTime',
      // initialValue: moment().format('YYYY-MM-DD'),
      hideInTable: true,
      sorter: true,
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
        onSubmit={onSubmit}
        onReset={onReset}
        params={search}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
