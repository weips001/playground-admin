import {  FormInstance, message } from 'antd';
import React, {  useRef,useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {useModel} from 'umi'
import type { TableListItem } from './data.d';
import { getTableList, recoveryVip } from './service';
import {  cardTypeEnum } from '@/utils/constant';



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
  const backVip = async (id) => {
    await recoveryVip(id)
    message.success('恢复成功')
    actionRef.current?.reload()
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '卡号',
      dataIndex: 'cardId',
      order: 1,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      order: 2,
    },
    {
      title: '创建日期',
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '生日',
      hideInSearch: true,
      hideInTable: true,
      dataIndex: 'birthday',
      valueType: 'date',
    },
    {
      title: '性别',
      hideInSearch: true,
      dataIndex: 'sex',
      valueEnum: {
        0: '男',
        1: '女',
      },
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
      render(_, record) {
        return record.total > 0 ? record.total : '不限次';
      },
    },
    {
      title: '剩余次数',
      hideInSearch: true,
      dataIndex: 'restTotal',
      render(_, record) {
        return record.restTotal > 0 ? record.restTotal : '不限次';
      },
    },
    {
      title: '已用次数',
      hideInSearch: true,
      dataIndex: 'usedTotal',
    },
    {
      title: '有效期',
      dataIndex: 'overdate',
      hideInForm: true,
      sorter: true,
      hideInSearch: true,
      valueType: 'date',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return [
          <a
            key="recharge"
            onClick={() => backVip(record.id)}
          >
            恢复
          </a>]
      }
    }
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
        params={search}
        onSubmit={onSubmit}
        onReset={onReset}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
