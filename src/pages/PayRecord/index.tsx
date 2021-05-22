import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef, Fragment } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormDigit, ProFormDateTimePicker } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { getTableList, update, add, remove, removeAll } from './service';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '卡号',
      dataIndex: 'cardId',
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
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '会员类型',
      dataIndex: 'cardType',
      valueEnum: {
        '0': { text: '次卡', status: 'Default' },
        '-1': { text: '时间卡', status: 'Success' }
      }
    },
    {
      title: '充值次数',
      hideInSearch: true,
      dataIndex: 'payTotal'
    },
    {
      title: '总次数',
      hideInSearch: true,
      dataIndex: 'total',
    },
    {
      title: '剩余次数',
      hideInSearch: true,
      dataIndex: 'totalRest',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   hideInForm: true,
    //   sorter: true,
    //   valueType: 'dateTime',
    // },
    // {
    //   title: '修改时间',
    //   dataIndex: 'updateTime',
    //   hideInForm: true,
    //   sorter: true,
    //   hideInSearch: true,
    //   valueType: 'dateTime',
    // },
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
          await confirmDel([record.id])
          
        }}>
          删除
        </a>,
      ],
    },
  ];

  const columnsItem: ProColumns<TableListItem>[] = [
    {
      title: '会员类型',
      dataIndex: 'cardType',
      valueEnum: {
        '0': { text: '次卡', status: 'Default' },
        '-1': { text: '时间卡', status: 'Success' }
      }
    },
    {
      title: '总次数',
      render(_, record) {
        if(record.cardType === '-1') {
          return '不限次'
        }
        return record.total
      }
    },
    {
      title: '已用次数',
      dataIndex: 'usedNum',
    },
    {
      title: '剩余次数',
      render(_, record) {
        if(record.cardType === '-1') {
          return '不限次'
        }
        return record.reset
      }
    },
    {
      title: '充值时间',
      dataIndex: 'time',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   hideInForm: true,
    //   sorter: true,
    //   valueType: 'dateTime',
    // },
    // {
    //   title: '修改时间',
    //   dataIndex: 'updateTime',
    //   hideInForm: true,
    //   sorter: true,
    //   hideInSearch: true,
    //   valueType: 'dateTime',
    // },
  ];

  const onVisibleChange = (visible: boolean) => {
    handleModalVisible(visible);
  };
  const takeRemoveAll = async () => {
    await removeAll()
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }
  const props = {
    name: 'file',
    showUploadList: false,
    action: '/api/payRecordImport',
    onChange(info) {
      const {response, name, status} = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if(response.code === 0) {
          message.success(`${name} 上传成功。`);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          const list = response.data.errInfo.map(item => (
            <p>第{item.index+2}行数据上传失败，失败原因：{item.msg}</p>
          ))
          Modal.error({
            title: '上传失败！',
            content: list,
          });
        }
      } else if (info.file.status === 'error') {
        message.error(`${name} 上传失败。`);
      }
    },
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
        pagination={{
          pageSize: 50
        }}
        toolBarRender={() => [
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
          <Button
            type="ghost"
            danger
            key="delete"
            onClick={() => {
              takeRemoveAll();
            }}
          >
            <PlusOutlined /> 删除全部
          </Button>
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
      <ModalForm
        formRef={modalRef}
        title={currentRow ? "编辑发票": "新建发票"}
        width="800px"
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
        <ProForm.Group>
          <ProFormText
            rules={[
              {
                required: true,
                message: '发票号码为必填项',
              },
            ]}
            label="发票号码"
            width="sm"
            name="billNumber"
          />
          <ProFormText
            label="发票代码"
            width="sm"
            rules={[
              {
                required: true,
                message: '发票代码为必填项',
              },
            ]}
            name="billCode"
          />
          <ProFormDigit
            label="发票金额"
            width="sm"
            rules={[
              {
                required: true,
                message: '发票金额为必填项',
              },
            ]}
            name="money"
            min={0}
            fieldProps={{ precision: 2 }}
          />
        </ProForm.Group>
        <ProForm.Group>
          
          <ProFormDateTimePicker width="sm" name="billDate" label="发票日期" />
          <ProFormText
            label="校验码"
            width="sm"
            name="checkCode"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            label="报销人"
            width="sm"
            name="applyUser"
          />
          <ProFormText
            label="凭证号"
            width="sm"
            name="voucherNumber"
          />
        </ProForm.Group>
        
      </ModalForm>
      <Drawer
        width={800}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <Fragment>
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
          >
          </ProDescriptions>
          <ProTable<TableListItem>
            bordered={false}
            cardBordered={false}
            actionRef={actionRef}
            rowKey="id"
            search={false}
            pagination={false}
            options={false}
            defaultData={currentRow.record}
            columns={columnsItem}
          />
        </Fragment>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
