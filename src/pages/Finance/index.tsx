import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data';
import { getTableList, update, add, remove, getUserByPhone } from './service';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { sexType, rechargeType, cardTypeEnum } from '@/utils/constant';
import Recharge from './components/Recharge';
import Consume from './components/Consume';
import moment from '_moment@2.29.1@moment';

const { confirm } = Modal;
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
    console.log(error);
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

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [rechargeVisible, setRechargeVisible] = useState<boolean>(false);
  const [consumeVisible, setConsumeVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<FormInstance>();
  const searchFormRef = useRef<FormInstance>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);

  const handleRemove = async (id) => {
    try {
      await remove(id);
      actionRef.current?.reloadAndRest?.();
      message.success('删除成功，即将刷新');
      return true;
    } catch (error) {
      message.error(`删除失败,失败原因：${error.msg}`);
      return false;
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
        return handleRemove(id);
      },
      onCancel() {},
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '今日总收入',
      hideInSearch: true,
      dataIndex: 'totalMoney',
      
    },
    {
      title: '现金',
      hideInSearch: true,
      dataIndex: 'cashMoney',
      order: 1,
    },
    {
      title: '人数',
      hideInSearch: true,
      dataIndex: 'personNum',
      order: 2,
    },
    {
      title: '今日支出',
      hideInSearch: true,
      dataIndex: 'paidMoney',
    },
    {
      title: '备注',
      hideInSearch: true,
      dataIndex: 'paidDesc',
    },
    {
      title: '创建日期',
      hideInSearch: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const { cardType, overdate } = record;
        const operate = [
          <a
            key="config"
            onClick={() => {
              handleModalVisible(true);
              setCurrentRow(record);
              modalRef.current?.setFieldsValue(record);
            }}
          >
            编辑
          </a>,
          <a
            key="subscribeAlert"
            onClick={async () => {
              await confirmDel(record.id);
            }}
          >
            删除
          </a>,
        ];
        if (cardType === '1') {
          if (overdate) {
            const isDelay = new Date(overdate).getTime() < new Date().getTime();
            if (isDelay) {
              return null;
            }
          }
        }
        return operate;
      },
    },
  ];
  const cancelRechargeModal = () => {
    setRechargeVisible(false);
  };
  const cancelConsumeModal = () => {
    setConsumeVisible(false);
  };
  const onVisibleChange = async (visible: boolean) => {
    const phone = searchFormRef.current?.getFieldValue('phone') || '';
    if (visible && phone.length === 11 && !currentRow) {
      const { data } = await getUserByPhone(phone);
      if (data) {
        const { name, phone, birthday, sex, cardId, remark } = data;
        const values = {
          name,
          phone,
          birthday,
          sex,
          cardId,
          remark,
        };
        modalRef.current?.setFieldsValue(values);
      } else {
        modalRef.current?.setFieldsValue({ phone });
      }
    }
    handleModalVisible(visible);
  };
  const okConsumeModal = () => {
    cancelConsumeModal();
    actionRef.current?.reload();
  };
  const okRechargeModal = () => {
    cancelRechargeModal();
    actionRef.current?.reload();
  };
  const props = {
    name: 'file',
    showUploadList: false,
    action: '/api/vipUpload',
    onChange(info) {
      const { response, name, status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (response.code === 0) {
          message.success(`${name} 上传成功。`);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          const list = response.data.errInfo.map((item) => (
            <p>
              第{item.index + 2}行数据上传失败，失败原因：{item.msg}
            </p>
          ));
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
  const Userprops = {
    name: 'file',
    showUploadList: false,
    action: '/api/vipUserUpload',
    onChange(info) {
      const { response, name, status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if (response.code === 0) {
          message.success(`${name} 上传成功。`);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          const list = response.data.errInfo.map((item) => (
            <p>
              第{item.index + 2}行数据上传失败，失败原因：{item.msg}
            </p>
          ));
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
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected}) => {
          // onCleanSelected(true)

          return (
          <div>123</div>
          )
        }}
        tableAlertOptionRender={() => {
          return null;
        }}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            const ids = selectedRows.map((item) => item.id);
            setSelectedRows(ids);
          },
        }}
      />
      <ModalForm
        formRef={modalRef}
        title={currentRow ? '编辑' : '新建'}
        width="800px"
        modalProps={{
          afterClose() {
            setCurrentRow(undefined);
            modalRef.current?.resetFields();
          },
        }}
        initialValues={{
          cardId: moment().format('YYYYMMDDhhmmss'),
          createTime: new Date(),
        }}
        visible={createModalVisible}
        onVisibleChange={onVisibleChange}
        onFinish={async (value) => {
          let success;
          value.cardType = value.cardType < 0 ? '1' : '0';
          if (currentRow?.id) {
            const params = {
              ...currentRow,
              ...value,
            };
            success = await handleUpdate(params);
          } else {
            const params = {
              ...value,
              restTotal: value.total,
            };
            // console.log('params---', params);
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
        <ProForm.Group>
          <ProFormText
            width="md"
            name="totalMoney"
            rules={[
              {
                required: true,
                message: '请输入今日总收入!',
              },
            ]}
            label="今日总收入"
            placeholder="请输入今日总收入"
          />

          <ProFormDatePicker
            width="md"
            name="createdAt"
            label="日期"
            rules={[
              {
                required: true,
                message: '请选择日期',
              }
            ]}
            placeholder="请选择日期"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="cashMoney"
            label="现金"
            rules={[
              {
                required: true,
                message: '请输入现金',
              }
            ]}
            placeholder="请输入现金"
          />
          <ProFormText
            width="md"
            name="personNum"
            label="人数"
            rules={[
              {
                required: true,
                message: '请输入人数',
              }
            ]}
            placeholder="请输入人数"
          />
        </ProForm.Group>
        <ProForm.Group>
         <ProFormText
            width="md"
            name="paidMoney"
            label="今日支出"
            rules={[
              {
                required: true,
                message: '请输入今日支出',
              }
            ]}
            placeholder="请输入今日支出"
          />
          <ProFormText
            width="md"
            name="paidDesc"
            label="备注"
            placeholder="请输入备注"
          />
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
