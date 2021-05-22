import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import RoleList from './component/roleList';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Modal, Button, Row, Col, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getTableList, remove } from './service'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
const {confirm} = Modal
type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  children?: DataSourceType[];
};
export type RoleActionType = 'detail' | 'add' | 'update'

const Role = (props) => {
  const {dispatch} = props
  const [isShow, toggleShow] = useState(false);
  const [currentRow, setCurrentRow] = useState(undefined);
  const [action, setAction] = useState<RoleActionType>('add');
  const actionRef = useRef<ActionType>()
  const reload = () => {
    actionRef.current?.reload()
    toggleShow(false)
  }
  const view = (record) => {
    setAction('detail')
    !isShow && toggleShow(true)
    setCurrentRow(record)
  }
  const addRole = () => {
    setAction('add')
    !isShow && toggleShow(true)
    setCurrentRow(undefined)
  }
  
  const removeRole = (id: string) => {
    confirm({
      title: '删除角色确认',
      icon: <ExclamationCircleOutlined />,
      content: '是否要删除该角色？',
      async onOk() {
        const {msg} = await remove(id)
        message.success(msg)
        reload()
      },
      onCancel() {}
    })
  }
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '序号',
      valueType: 'index',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      render: (_, record) => (
        <a onClick={() => view(record)}>{record.name}</a>
      )
    },
    {
      title: '角色描述',
      hideInSearch: true,
      dataIndex: 'desc',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            setAction('update')
            !isShow && toggleShow(true)
            setCurrentRow(record)
          }}
        >
          编辑
        </a>,
        <a
          key={record.id}
          onClick={() => removeRole(record.id)}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <Row gutter={12}>
        <Col span={16}>
          <ProTable<DataSourceType>
            actionRef={actionRef}
            rowKey="id"
            bordered
            search={{
              labelWidth: 100,
            }}
            pagination={false}
            headerTitle="角色列表"
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  addRole();
                }}
              >
                <PlusOutlined /> 新增
              </Button>,
            ]}
            columns={columns}
            request={(params) => getTableList(params)}
          />
        </Col>
        <Col span={8}>
          {isShow && (
            <RoleList
              action={action}
              reload={reload}
              currentRow={currentRow}
            />
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default connect()(Role);
