import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';
import { getTableList } from '@/pages/Role/service'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    console.log(error)
    message.error(`添加失败，失败原因：${error.msg}！`);
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule(fields);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};




const userStatusList = {
  0: {
    text: <Tag color="success">在职</Tag>,
    status: 'Success',
  },
  1: {
    text: <Tag color="error">离职</Tag>,
    status: 'Error',
  },
};

const filterSelect = () => {

}

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<FormInstance>()
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);
  const [roleList, setRoleList] = useState([])
  useEffect(() => {
    async function getRoleList() {
      const { data = [] } = await getTableList()
      console.log(data)
      const list = data.map(item => ({
        value: item.id,
        label: item.name
      }))
      setRoleList(list)
    }
    getRoleList()
  }, [])
  const handleRemove = async (selectedRows: string) => {
    if (!selectedRows) return true;
    try {
      await removeRule(selectedRows);
      actionRef.current?.reloadAndRest?.();
      message.success('删除成功，即将刷新');
      return true
    } catch (error) {
      message.error(`删除失败,失败原因：${error.msg}`);
      return false
    }
  };

  /**
   * 删除节点
   *
   * @param selectedRows
   */
  const confirmDel = (selectedRows: string) => {
    confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '您正在删除当前数据，是否继续？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return handleRemove(selectedRows)
      },
      onCancel() { },
    })
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      hideInSearch: true,
      render(_, record) {
        const roleName = record.roleName.join('、')
        return roleName
      }
    },
    {
      title: '联系方式',
      hideInForm: true,
      dataIndex: 'callPhone',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInForm: true,
      sorter: true,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '人员状态',
      dataIndex: 'status',
      valueEnum: userStatusList,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleModalVisible(true);
            setCurrentRow(record);
            modalRef.current?.setFieldsValue(record)
          }}
        >
          编辑
        </a>,
        <a key="subscribeAlert" onClick={async () => {
          await confirmDel(record.id)

        }}>
          删除
        </a>,
      ],
    },
  ];

  const onVisibleChange = (visible: boolean) => {
    handleModalVisible(visible);
  };
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="人员管理"
        bordered={true}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            const ids = selectedRows.map(item => item.id)
            setSelectedRows(ids);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                {/* 服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万 */}
              </span>
            </div>
          }
        >
          {/* <Button
            onClick={async () => {
              await confirmDel(selectedRowsState);
              setSelectedRows([]);
            }}
          >
            批量删除
          </Button> */}
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <ModalForm
        formRef={modalRef}
        title={currentRow ? "修改人员信息" : "新建人员"}
        width="400px"
        modalProps={{
          afterClose() {
            setCurrentRow(undefined)
            modalRef.current?.resetFields()
          }
        }}
        visible={createModalVisible}
        onVisibleChange={onVisibleChange}
        onFinish={async (value) => {
          let params = {
            ...value,
            role: []
          }
          let success
          if (currentRow?.id) {
            params = {
              ...currentRow,
              ...value
            }
            success = await handleUpdate(params);
          } else {
            success = await handleAdd(params as TableListItem);
          }

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '姓名为必填项',
            },
          ]}
          label="姓名"
          width="md"
          name="name"
        />
        <ProFormText
          name="callPhone"
          label="联系方式"
          width="md"
          placeholder="请输入联系方式"
          rules={[
            {
              required: true,
              message: '联系方式为必填项'
            },
            {
              pattern: /^1\d{10}$/,
              message: '不合法的手机号格式!',
            },
          ]}
        />
        {/* <ProFormCheckbox.Group
          name="role"
          rules={[{ required: true }]}
          label="角色"
          options={roleList}
        />
        <ProFormText
          label="部门"
          width="md"
          name="department"
        />
        <ProFormText
          name="userEmail"
          label="邮箱"
          width="md"
          placeholder="请输入邮箱"
          rules={[
            {
              type: "email",
              message: '不合法的邮箱格式!',
            },
          ]}
        /> */}
      </ModalForm>
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.userName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.userName,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
