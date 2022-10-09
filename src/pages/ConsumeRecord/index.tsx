import { Button, message, Upload, Modal,  FormInstance } from 'antd';
import React, { useRef, useState ,useEffect} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import {useModel} from 'umi'
import { getTableList, syncUserInfo } from './service';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateLoading, setLoading] = useState<boolean>(false);
  const searchFormRef = useRef<FormInstance>();
  const {search, changeSearch} = useModel('search', model => ({search: model.search, changeSearch: model.changeSearch}))

  useEffect(() => {
    searchFormRef.current?.setFieldsValue(search)
  }, [])
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
      title: '消费日期',
      dataIndex: 'consumeTime',
      initialValue: moment().format('YYYY-MM-DD'),
      hideInTable: true,
      sorter: true,
      valueType: 'date',
      order: 1,
    },
    {
      title: '消费次数',
      hideInSearch: true,
      dataIndex: 'shoppingNum',
    },
    {
      title: '消费日期',
      hideInSearch: true,
      dataIndex: 'consumeTime',
      valueType: 'dateTime',
    },
    {
      title: '备注',
      hideInSearch: true,
      dataIndex: 'remark',
    },
  ];
  const syncUser = async () => {
    setLoading(true);
    await syncUserInfo();
    setLoading(false);
  };
  const onSubmit = (params) => {
    changeSearch(params)
  }
  const onReset = () => {
    changeSearch({})
  }
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
        toolBarRender={() => [
          // <Upload {...props}>
          //   <Button icon={<UploadOutlined />}>上传消费记录</Button>
          // </Upload>,
          // <Button onClick={syncUser} loading={updateLoading}>
          //   同步用户信息
          // </Button>,
        ]}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
