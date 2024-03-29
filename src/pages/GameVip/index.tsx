import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import {useModel} from 'umi'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDatePicker,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem } from './data.d';
import { getTableList, update, add, remove, sendMessage } from './service';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { gameBiType } from '@/utils/constant';
import Recharge from './components/Recharge';
import Consume from './components/Consume';
import moment from 'moment';

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
  const {search, changeSearch} = useModel('search', model => ({search: model.search, changeSearch: model.changeSearch}))
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
  const [dataSource, setDataSource] = useState<any[]>([]);

  useEffect(() => {
    searchFormRef.current?.setFieldsValue(search)
  }, [])

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
  const sendMessageByIds = () => {
    confirm({
      title: '是否确认发送',
      icon: <ExclamationCircleOutlined />,
      content: `即将给${selectedRowsState.length}位顾客发送短信通知`,
      okText: '确定',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        const idMap = {}
        selectedRowsState.forEach(id => {
          idMap[id] = true
        })
        const ids = new Set<string>()
        dataSource.forEach(item => {
          const {id, phone} = item
          if(idMap[id]) {
            ids.add(phone)
          }
        })
        return sendMessage([...ids])
      },
      onCancel() {},
    });
  };

  const requestTableList = async (params, sorter, filter) => {
    const res = await getTableList({ ...params, sorter, filter })
    setDataSource(res.data)
    return res
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
      title: '手机号',
      dataIndex: 'phone',
      order: 2,
    },
    {
      title: '充值金额',
      hideInSearch: true,
      dataIndex: 'money',
      valueType: 'money',
    },
    {
      title: '总个数',
      hideInSearch: true,
      dataIndex: 'total',
    },
    {
      title: '消费个数',
      hideInSearch: true,
      render(_, record) {
        const { total, restTotal } = record;
        const used = total - restTotal;
        if (typeof used === 'number') {
          return Math.min(used, total);
        }
        return '-';
      },
    },
    {
      title: '剩余个数',
      hideInSearch: true,
      dataIndex: 'restTotal',
    },
    {
      title: '充值时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '过期日期',
      dataIndex: 'overdate',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '最近消费日期',
      dataIndex: 'lastUseTime',
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if(record.restTotal == 0) {
          return null
        }
        return [
          <a
            key="recharge"
            onClick={() => {
              setRechargeVisible(true);
              setCurrentRow(record);
            }}
          >
            充值
          </a>,
          <a
            key="consume"
            onClick={() => {
              setConsumeVisible(true);
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
              modalRef.current?.setFieldsValue(record);
            }}
          >
            编辑
          </a>,
          // <a
          //   key="subscribeAlert"
          //   onClick={async () => {
          //     await confirmDel(record.id);
          //   }}
          // >
          //   删除
          // </a>,
        ]
      }
    },
  ];
  const cancelRechargeModal = () => {
    setRechargeVisible(false);
  };
  const cancelConsumeModal = () => {
    setConsumeVisible(false);
  };
  const onVisibleChange = (visible: boolean) => {
    const phone = searchFormRef.current?.getFieldValue('phone') || '';
    if (visible && phone.length === 11 && !currentRow) {
      modalRef.current?.setFieldsValue({ phone });
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
        params={search}
        onSubmit={onSubmit}
        onReset={onReset}
        toolBarRender={() => [
          // <Upload {...props}>
          //   <Button icon={<UploadOutlined />}>上传游戏币记录</Button>
          // </Upload>,
          <Button
            type="primary"
            key="primary"
            disabled={!selectedRowsState.length}
            onClick={() => {
              sendMessageByIds()
            }}
          >
            发送短信
          </Button>,
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
        request={(params, sorter, filter) => requestTableList(params, sorter, filter)}
        columns={columns}
        rowSelection={{
          getCheckboxProps(record) {
            let disabled = false
            if (record.restTotal === 0) {
              disabled = true
            }
            
            return {              
              disabled
            }
          },
          onChange: (_, selectedRows) => {
            const ids = selectedRows.map((item) => item.id);
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
        title={currentRow ? '编辑会员' : '新建会员'}
        width="800px"
        modalProps={{
          afterClose() {
            setCurrentRow(undefined);
            modalRef.current?.resetFields();
          },
        }}
        initialValues={{
          cardId: moment().format('YYYYMMDDhhmmss'),
        }}
        visible={createModalVisible}
        onVisibleChange={onVisibleChange}
        onFinish={async (value) => {
          let success;
          if (currentRow?.id) {
            const params = {
              ...currentRow,
              ...value,
            };
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
              },
            ]}
            label="姓名"
            placeholder="请输入娃子的姓名"
          />

          <ProFormText
            width="md"
            name="phone"
            label="手机号"
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
            placeholder="请输入家长的手机号"
          />
        </ProForm.Group>
        {currentRow ? null : (
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
                    const { label, total, month } = e.target;
                    const overdate = moment(new Date()).add(month, 'month').format('YYYY-MM-DD');
                    modalRef.current?.setFieldsValue({
                      total,
                      overdate,
                    });
                    console.log('e', e);
                  },
                }}
                options={gameBiType}
              ></ProFormRadio.Group>
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText width="md" name="money" label="金额" />
              <ProFormText width="md" name="total" label="个数" />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDatePicker
                width="md"
                rules={[
                  {
                    required: true,
                    message: '请选择有效期!',
                  },
                ]}
                name="overdate"
                label="有效期至"
                placeholder="请选择有效期"
              />
            </ProForm.Group>
          </>
        )}
        <ProForm.Group>
          <ProFormTextArea name="remark" label="备注" width="xl" placeholder="请输入备注" />
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
        visible={rechargeVisible}
      />
      <Consume
        modalType="create"
        currentRow={currentRow}
        onCancel={cancelConsumeModal}
        onOk={okConsumeModal}
        visible={consumeVisible}
      />
    </PageContainer>
  );
};

export default TableList;
