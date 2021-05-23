import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormDatePicker, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { getTableList, update, add, remove } from './service';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {sexType, cardTypeEnum} from '@/utils/constant'
import Recharge from './components/Recharge'
import Consume from './components/Consume'
import moment from '_moment@2.29.1@moment';

const { confirm } = Modal
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    console.log(fields)
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
  const [searchPhone, setSearchPhone] = useState<string>('')
  const [rechargeVisible, setRechargeVisible] = useState<boolean>(false);
  const [consumeVisible, setConsumeVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<FormInstance>()
  const searchFormRef = useRef<FormInstance>()
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);

  const handleRemove = async (id) => {
    try {
      await remove(id);
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
  const confirmDel = (id: string) => {
    confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '您正在删除当前数据，是否继续？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        return handleRemove(id)
      },
      onCancel() { },
    })
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '手机号',
      dataIndex: 'phone',
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
      title: '卡号',
      dataIndex: 'cardId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '生日',
      hideInSearch: true,
      dataIndex: 'birthday',
      valueType: 'date'
    },
    {
      title: '性别',
      hideInSearch: true,
      dataIndex: 'sex',
      valueEnum: {
        0: '男',
        1: '女'
      }
    },
    {
      title: '卡种',
      dataIndex: 'cardType',
      valueEnum: cardTypeEnum
    },
    {
      title: '剩余次数',
      hideInSearch: true,
      dataIndex: 'totalRest'
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
      render: (_, record) => [
        <a
          key="recharge"
          onClick={() => {
            setRechargeVisible(true)
            setCurrentRow(record);
          }}
        >
          充值
        </a>,
        <a
          key="consume"
          onClick={() => {
            setConsumeVisible(true)
            setCurrentRow(record);
          }}
        >
          消费
        </a>,
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
  const cancelRechargeModal = () => {
    setRechargeVisible(false)
  }
  const cancelConsumeModal = () => {
    setConsumeVisible(false)
  }
  const onVisibleChange = (visible: boolean) => {
    const phone = searchFormRef.current?.getFieldValue('phone') || ''
    if (visible && phone.length === 11 && !currentRow) {
      modalRef.current?.setFieldsValue({phone})
    }
    handleModalVisible(visible);
  };
  const okConsumeModal = () => {
    cancelConsumeModal()
    actionRef.current?.reload()
  }
  const props = {
    name: 'file',
    showUploadList: false,
    action: '/api/vipUpload',
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
        formRef={searchFormRef}
        rowKey="id"
        search={{
          labelWidth: 120,
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
        title={currentRow ? "编辑会员" : "新建会员"}
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
          if (currentRow?.id) {
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
            width="md"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入娃子的姓名!',
              }
            ]}
            label="姓名"
            placeholder="请输入娃子的姓名"
          />

          <ProFormText width="md" name="phone" label="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^1\d{10}$/,
                message: '不合法的手机号格式!',
              },
            ]}
            placeholder="请输入家长的手机号" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDatePicker width="md"
            rules={[
              {
                required: true,
                message: '请选择娃子的生日!',
              },
            ]}
            name="birthday" label="生日" placeholder="请选择娃子的生日" />
          <ProFormSelect
            width="md"
            rules={[
              {
                required: true,
                message: '请选择娃子的性别!',
              },
            ]}
            options={sexType}
            name="sex"
            label="性别"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText width="md" name="cardId" label="卡号" placeholder="请输入卡号" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            name="remark"
            label="备注"
            width="xl"
            placeholder="请输入备注"
          />
        </ProForm.Group>

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
      <Recharge
        modalType="create"
        currentRow={currentRow}
        onCancel={cancelRechargeModal}
        visible={rechargeVisible} />
      <Consume
        modalType="create"
        currentRow={currentRow}
        onCancel={cancelConsumeModal}
        onOk={okConsumeModal}
        visible={consumeVisible} />
    </PageContainer>
  );
};

export default TableList;
