import { PlusOutlined } from '@ant-design/icons';
import { Button, message, DatePicker, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormText, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { getTableList, update, add, remove } from './service';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { sexType, gameBiType, cardTypeEnum } from '@/utils/constant'
import Recharge from './components/Recharge'
import Consume from './components/Consume'
import moment from 'moment';

const { confirm } = Modal
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  try {
    await add(fields);
    message.success('添加成功');
    return true;
  } catch (error) {
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '充值金额',
      hideInSearch: true,
      dataIndex: 'money',
      valueType: 'money'
    },
    {
      title: '总个数',
      hideInSearch: true,
      dataIndex: 'total'
    },
    {
      title: '充值时间',
      dataIndex: 'createTime',
      initialValue: moment(new Date()).format('YYYY-MM-DD'),
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: '充值时间',
      dataIndex: 'createTime',
      initialValue: new Date(),
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
    }
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
      modalRef.current?.setFieldsValue({ phone })
    }
    handleModalVisible(visible);
  };
  const okConsumeModal = () => {
    cancelConsumeModal()
    actionRef.current?.reload()
  }
  const okRechargeModal = () => {
    cancelRechargeModal()
    actionRef.current?.reload()
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
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
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
        initialValues={{
          cardId: moment().format('YYYYMMDDhhmmss')
        }}
        visible={createModalVisible}
        onVisibleChange={onVisibleChange}
        onFinish={async (value) => {
          console.log(value)
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
        {
          currentRow ? null : (
            <>
              <ProForm.Group>
                <ProFormRadio.Group
                  name="money"
                  radioType="button"
                  label="充值金额"
                  rules={[
                    {
                      required: true,
                      message: '请选择充值金额!',
                    },
                  ]}
                  fieldProps={{
                    onChange(e) {
                      const { label, total, month } = e.target
                      const overdate = moment(new Date()).add(month, 'month').format('YYYY-MM-DD')
                      modalRef.current?.setFieldsValue({
                        total,
                        overdate
                      })
                      console.log('e', e)
                    }
                  }}
                  options={gameBiType}
                >
                </ProFormRadio.Group>
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText width="md" name="total" label="个数" readonly />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormDatePicker width="md"
                  rules={[
                    {
                      required: true,
                      message: '请选择有效期!',
                    },
                  ]}
                  name="overdate" label="有效期至" placeholder="请选择有效期" />
              </ProForm.Group>
            </>
          )
        }
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
        onOk={okRechargeModal}
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
