import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Upload, Modal, Drawer, Tag, FormInstance } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useModel } from 'umi';
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
import type { TableListItem } from './data.d';
import { getTableList, update, add, remove, getUserByPhone, sendMessage } from './service';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { sexType, rechargeType, cardTypeEnum } from '@/utils/constant';
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


const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const {search, changeSearch} = useModel('search', model => ({search: model.search, changeSearch: model.changeSearch}))
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

  const getTableDataList = async (params, sorter, filter) => {
    const res = await getTableList({ ...params, sorter, filter })
    setDataSource(res.data)
    return res
  }

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
      title: '卡号',
      dataIndex: 'cardId',
      order: 1,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      order: 2,
    },
    {
      title: '创建日期',
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '生日',
      hideInSearch: true,
      hideInTable: true,
      dataIndex: 'birthday',
      valueType: 'date',
    },
    {
      title: '性别',
      hideInSearch: true,
      dataIndex: 'sex',
      valueEnum: {
        0: '男',
        1: '女',
      },
    },
    {
      title: '卡种',
      dataIndex: 'cardType',
      valueEnum: cardTypeEnum,
    },
    {
      title: '金额',
      hideInSearch: true,
      dataIndex: 'money',
    },
    {
      title: '总次数',
      hideInSearch: true,
      dataIndex: 'total',
      render(_, record) {
        return record.total > 0 ? record.total : '不限次';
      },
    },
    {
      title: '剩余次数',
      hideInSearch: true,
      dataIndex: 'restTotal',
      render(_, record) {
        return record.restTotal > 0 ? record.restTotal : '不限次';
      },
    },
    {
      title: '已用次数',
      hideInSearch: true,
      dataIndex: 'usedTotal',
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
      title: '最近消费日期',
      dataIndex: 'lastUseTime',
      hideInForm: true,
      sorter: true,
      // hideInSearch: true,
      valueType: 'date',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        const { cardType, overdate } = record;
        const operate = [
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
              setTimeout(() => {
                modalRef.current?.setFieldsValue(record);
              }, 300);
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
          //   <Button icon={<UploadOutlined />}>上传充值记录</Button>
          // </Upload>,
          // <Upload {...Userprops}>
          //   <Button icon={<UploadOutlined />}>上传会员</Button>
          // </Upload>,
          <Button
            type="primary"
            key="send"
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
              let d = new Date()
              d.setFullYear(d.getFullYear() + 1);
              modalRef.current?.setFieldsValue({
                overdate: d
              });
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={(params, sorter, filter) => getTableDataList(params, sorter, filter)}
        columns={columns}
        rowSelection={{
          getCheckboxProps(record) {
            let disabled = false
            if (record.cardType === '1') {
              if (record.overdate) {
                const before = new Date(record.overdate).getTime()
                const now = new Date().getTime()
                disabled = before < now
              }
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
        <ProForm.Group>
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
          <ProFormText
            disabled={!!currentRow}
            width="md"
            name="cardId"
            label="卡号"
            placeholder="请输入卡号"
          />
        </ProForm.Group>
        <ProForm.Group>

        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea name="remark" label="备注" width="xl" placeholder="请输入备注" />
        </ProForm.Group>
        {currentRow ? null : (
          <>
            <ProForm.Group>
              <ProFormRadio.Group
                name="cardType"
                radioType="button"
                label="套卡类型"
                rules={[
                  {
                    required: true,
                    message: '请选择套卡类型!',
                  },
                ]}
                fieldProps={{
                  onChange(e) {
                    const { label, value, month, money } = e.target;
                    const overdate = moment(new Date()).add(month, 'month').format('YYYY-MM-DD');
                    modalRef.current?.setFieldsValue({
                      money,
                      total: value,
                      overdate,
                    });
                    console.log('e', e);
                  },
                }}
                options={rechargeType}
              ></ProFormRadio.Group>
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText width="md" name="money" label="金额" />
              <ProFormText width="md" name="total" label="次数" />
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
            <ProForm.Group>
              <ProForm.Group>
                <ProFormDateTimePicker name="createTime" label="充值时间" />
              </ProForm.Group>
            </ProForm.Group>
          </>
        )}
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
