import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
// import type { FormValueType } from '/components/UpdateForm';
import type { TableListItem } from '../data.d';
import { getTableList, update, add, remove, submit } from '../service';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { history } from 'umi'
const {confirm} = Modal
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    await add({ ...fields });
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
    await update(fields);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};




const compStatusList = {
  0: {
    text: <Tag color="default">草稿</Tag>,
    status: 'Default',
  },
  1: {
    text: <Tag color="success">已提交</Tag>,
    status: 'Success',
  },
  2: {
    text: <Tag color="error">已退回</Tag>,
    status: 'Error',
  },
  3: {
    text: <Tag color="processing">已完成</Tag>,
    status: 'Processing',
  },
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<FormInstance>()
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);
  
  const handleRemove = async (selectedRows: string[]) => {
    if (!selectedRows) return true;
    try {
      await remove(selectedRows);
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
  const confirmDel = (selectedRows:string[]) => {
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
      onCancel() {},
    })
  }
  const submitOrder = async (id: string) => {
    await submit(id)
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '付款单号',
      dataIndex: 'paymentOrderId',
      tip: '规则名称是唯一的 key',
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
      title: '申请人',
      dataIndex: 'applyUserName',
    },
    {
      title: '收款人全称',
      dataIndex: 'payeeName',
    },
    {
      title: '付款金额',
      dataIndex: 'payMoney',
    },
    {
      title: '付款时间',
      dataIndex: 'payTime',
      sorter: true,
      hideInSearch: true,
      valueType: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: compStatusList,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const submitBtn = <a key="publish" onClick={() => submitOrder(record.id)}>提交</a>
        const continuePayBtn = <a key="publish" onClick={() => {}}>继续付款</a>
        const editBtn = <a
          key="edit"
          onClick={() => {
            history.push(`/payment-order/update/${record.id}`)
          }}
        >
          编辑
        </a>
        const removeBtn = <a key="remove" onClick={async () => {
          await confirmDel([record.id])
          
        }}>
          删除
        </a>
        const printBtn = <a key="print" onClick={async () => {
          // await confirmDel([record.id])
          
        }}>
          下载
        </a>
        const btnList = []
        if(record.status === '0') {
          btnList.push(submitBtn, editBtn, removeBtn)
        }
        if(record.status === '1') {
          btnList.push(printBtn)
        }
        if(record.status === '3') {
          btnList.push(continuePayBtn)
        }
        return btnList},
    },
  ];

  const onVisibleChange = (visible: boolean) => {
    handleModalVisible(visible);
  };
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
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
              // handleModalVisible(true);
              history.push('/payment-order/create')
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
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
          <Button
            onClick={async () => {
              await confirmDel(selectedRowsState);
              setSelectedRows([]);
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      {/* <ModalForm
        formRef={modalRef}
        title={currentRow ? "编辑公司": "新建公司"}
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
          let success
          if(currentRow?.id) {
            const params = {
              ...currentRow,
              ...value
            }
            success = await handleUpdate(params);
          } else {
             success = await handleAdd(value as TableListItem);

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
              message: '公司名称为必填项',
            },
          ]}
          label="公司名称"
          width="md"
          name="compName"
        />
        <ProFormText
          label="公司联系人"
          width="md"
          rules={[
            {
              required: true,
              message: '公司名称为必填项',
            },
          ]}
          name="bossName"
        />
        <ProFormText
          name="bossPhone"
          label="联系方式"
          width="md"
          placeholder="请输入联系方式"
          rules={[
            {
              required: true,
              message: '公司名称为必填项',
            },
            {
              pattern: /^1\d{10}$/,
              message: '不合法的手机号格式!',
            },
          ]}
        />
      </ModalForm> */}
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
            title={currentRow?.compName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.compName,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
