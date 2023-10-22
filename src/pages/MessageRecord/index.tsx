import { Tag, Button, Table, Modal, FormInstance, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getTableList, remove, sendMsg } from './service';
import moment from 'moment';

const { confirm } = Modal;

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateLoading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const searchFormRef = useRef<FormInstance>();

  const needDel = (record): boolean => {
    const { total, restTotal, lastUseDate } = record;
    const diff = new Date().getTime() - new Date(lastUseDate).getTime()
    const base = 2 * 365 * 24 * 60 * 60 * 1000
    const delay = diff > base
    return total == record.restTotal || delay
  }

  const delay = () => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 2000)
    })
  }

  const delNotice = (id) => {
    console.log(id)
    Modal.confirm({
      title: '删除确认',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除此条信息？',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await remove(id)
        actionRef.current?.reload()
        return 
      }
    });
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',
      hideInSearch: true,
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      order: 2,
    },
    {
      title: '状态',
      dataIndex: 'isSuccess',
      valueEnum: {
        '1': <Tag color="success">发送成功</Tag>,
        '2': <Tag color="error">发送失败</Tag>,
      }
    },
    {
      title: '失败原因',
      hideInSearch: true,
      dataIndex: 'remark',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'date',
    },
  ];
  const sendMulipleMsg = async () => {
    confirm({
      title: '短信发送确认?',
      icon: <ExclamationCircleOutlined />,
      content: `您已选择${selectedKeys.length}条信息准备发送`,
      async onOk() {
        await sendMsg(selectedKeys)
        actionRef.current?.reloadAndRest?.()
        return
      },
    })
  };
  const changeSelection = (keys: React.Key[]) => {
    setSelectedKeys(keys)
  }
  const multipleDel = () => {
    
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
          span: 4,
          labelWidth: 120,
          layout: 'vertical',
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a onClick={sendMulipleMsg}>发送短信</a>
            </Space>
          );
        }}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
