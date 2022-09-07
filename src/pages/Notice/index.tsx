import { Tag, message, Table, Modal, FormInstance, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getTableList, syncUserInfo, sendMsg } from './service';
import moment from 'moment';

const { confirm } = Modal;

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateLoading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
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
      title: '金额',
      hideInSearch: true,
      dataIndex: 'money',
    },
    {
      title: '办卡日期',
      dataIndex: 'createTime',
      initialValue: moment().format('YYYY-MM'),
      hideInTable: true,
      sorter: true,
      valueType: 'dateYear',
      order: 1,
    },
    {
      title: '总次数',
      hideInSearch: true,
      dataIndex: 'total',
    },
    {
      title: '剩余次数',
      hideInSearch: true,
      dataIndex: 'restTotal',
    },
    {
      title: '办卡日期',
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'date',
    },
    {
      title: '上次消费日期',
      hideInTable: true,
      dataIndex: 'lastDateRange',
      valueType: 'dateRange',
      search: {
        transform(value) {
          return {
            start: value[0],
            end: value[1]
          }
        }
      }
    },
    {
      title: '上次消费日期',
      hideInSearch: true,
      dataIndex: 'lastUseDate',
      valueType: 'dateTime',
      render(_, record) {
        if (record.lastUseDate != undefined) {
          const date = moment(record.lastUseDate)
          return `${date.format('YYYY-MM-DD')}(${date.fromNow()})`
        }
        return <Tag color="#f50">暂无消费记录</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'isSend',
      valueEnum: {
        '0': <Tag color="processing">未发送</Tag>,
        '1': <Tag color="success">发送成功</Tag>,
        '2': <Tag color="error">发送失败</Tag>,
      }
    },
    {
      title: '备注',
      hideInSearch: true,
      dataIndex: 'remark',
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
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          getCheckboxProps(record) {
            return {
              disabled: record.isSend === '1'
            }
          },
          selectedRowKeys: selectedKeys,
          onChange: changeSelection
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
