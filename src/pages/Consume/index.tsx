import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, message, Input, Modal, Drawer, Space, Tag, FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import ProForm, { QueryFilter, ProFormText, ProFormDigit, ProFormDateTimePicker } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { FormValueType } from './components/UpdateForm';
import type { CreateUpdateType } from './components/UserModal';
import type { TableListItem } from './data.d';
import { getTableList, update, add, remove } from './service';
import { ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import UserModal from './components/UserModal'
import CardRecharge from './components/CardRecharge'
import ProList from '@ant-design/pro-list';
import styles from './style.less'
const { confirm } = Modal
const { Search } = Input;
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
  const [tab, setTab] = useState('settle');
  const [rechargeType, setRechargeType] = useState('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [isRecharge, setIsRecharge] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [userMoadlVisible, setUserMoadlVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<CreateUpdateType>('create');
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<FormInstance>()
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<string[]>([]);

  const [form] = Form.useForm();

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
  const confirmDel = (selectedRows: string[]) => {
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
      title: '发票号码',
      dataIndex: 'billNumber',
      tip: '发票号码是唯一的',
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
      title: '发票代码',
      hideInSearch: true,
      dataIndex: 'billCode',
    },
    {
      title: '发票金额',
      hideInSearch: true,
      dataIndex: 'money',
    },
    {
      title: '报销人',
      dataIndex: 'applyUser'
    },
    {
      title: '凭证号',
      dataIndex: 'voucherNumber'
    },
    {
      title: '开票时间',
      dataIndex: 'billDate',
      hideInForm: true,
      sorter: true,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '录入时间',
      dataIndex: 'createTime',
      hideInForm: true,
      sorter: true,
      valueType: 'dateTime',
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
          await confirmDel([record.id])

        }}>
          删除
        </a>,
      ],
    },
  ];

  const onVisibleChange = (visible: boolean) => {
    handleModalVisible(visible);
  };
  const takeNoUserModal = () => {
    Modal.confirm({
      title: '此账号暂时还不是会员',
      icon: <ExclamationCircleOutlined />,
      content: '没有查到对应手机号的会员信息，是否需要新建会员？',
      okText: '确认',
      cancelText: '取消',
      onCancel() {
        console.log('cancel')
      },
      onOk() {
        setUserMoadlVisible(true)
        // console.log('confirm')
      }
    });
  }
  const onFinish = () => { }
  const reset = () => {
    setTab('settle')
    setRechargeType('card')
    setIsRecharge(false)
  }
  const onSearch = (searchKey: string) => {
    setSearchKey(searchKey)
    reset()
    takeNoUserModal()
  }

  const dataSource = [
    {
      name: '语雀的天空',
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      desc: '我是一条测试的描述',
    },
    {
      name: 'Ant Design',
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      desc: '我是一条测试的描述',
    },
    {
      name: '蚂蚁金服体验科技',
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      desc: '我是一条测试的描述',
    },
    {
      name: 'TechUI',
      image:
        'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      desc: '我是一条测试的描述',
    },
  ];
  const cancelUserModal = () => {
    setUserMoadlVisible(false)
  }
  const takeRecharge = (type) => {
    if (type !== rechargeType) {
      console.log(rechargeType)
      if (type === 'consume') {
        setIsRecharge(false)
        setRechargeType(type)
      } else {
        setIsRecharge(true)
        setRechargeType(type)
      }
    }
  }
  const editUser = () => {
    setModalType('update')
    setUserMoadlVisible(true)
  }
  return (
    <PageContainer>
      {/* <ProCard layout="center" bordered>
        <ProCard colSpan={12} layout="center" style={{marginBottom: '8px;'}}>
          <Search
            placeholder="请输入手机号/姓名/卡号"
            allowClear
            enterButton="查询"
            size="large"
            onSearch={onSearch}
          />
        </ProCard>
      </ProCard> */}

      <ProCard split="vertical">
        <ProCard colSpan="360px"

          actions={[
            <Button type="link" onClick={() => takeRecharge('card')}>套卡充值</Button>,
            <Button type="link" onClick={() => takeRecharge('gameBi')}>游戏币充值</Button>,
            <Button type="link" onClick={() => takeRecharge('consume')}>消费</Button>
          ]}>
          <Search
            placeholder="请输入手机号/姓名/卡号"
            allowClear
            enterButton="查询"
            size="large"
            onSearch={onSearch}
          />
          <ProDescriptions
            actionRef={actionRef}
            column={1}
            style={{ marginTop: '24px' }}
            title="个人详情"

            request={async () => {
              return Promise.resolve({
                success: true,
                data: { name: '张三', phone: '13652671667', money: '12121', rest: 20, overTime: '2022年-10月21日' }
              });
            }}
            extra={null}
          >
            <ProDescriptions.Item dataIndex="name" label="姓名" />
            <ProDescriptions.Item dataIndex="sex" label="性别" />
            <ProDescriptions.Item dataIndex="phone" label="手机号" />
            <ProDescriptions.Item dataIndex="phone" label="生日" />
            <ProDescriptions.Item dataIndex="rest" label="剩余次数" />
            <ProDescriptions.Item dataIndex="overTime" label="有效期" />
            {/* <ProDescriptions.Item dataIndex="phone" label="卡种" /> */}
            {/* <ProDescriptions.Item label="money" dataIndex="money" valueType="money" /> */}
            <ProDescriptions.Item label="文本" valueType="option">
              <Button
                type="link"
                onClick={() => {
                  editUser()
                }}
                icon={<EditOutlined />}
                key="reload"
              >
                修改用户信息
              </Button>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
        {
          isRecharge ? (
            <ProCard
              tabs={{
                tabPosition: 'top',
                activeKey: rechargeType,
                onChange: (key) => {
                  setRechargeType(key);
                },
              }}
            >
              <ProCard.TabPane key="card" tab="套卡充值">
                <CardRecharge />
              </ProCard.TabPane>
              <ProCard.TabPane key="gameBi" tab="游戏币充值">
                      内容二
              </ProCard.TabPane>
            </ProCard>
          ) : (
            <ProCard
              tabs={{
                tabPosition: 'top',
                activeKey: tab,
                onChange: (key) => {
                  setTab(key);
                },
              }}
            >
              <ProCard.TabPane key="settle" tab="结算">
                内容一
              </ProCard.TabPane>
                    <ProCard.TabPane key="recharge" tab="充值记录">
                      内容二
              </ProCard.TabPane>
                    <ProCard.TabPane key="consume" tab="消费记录">
                      内容二
              </ProCard.TabPane>
            </ProCard>
          )
        }

        {/* <ProCard title="左右分栏子卡片带标题" headerBordered>
          <ProList<any>
            toolBarRender={() => {
              return [
                <Button key="add" type="primary">
                  新建
                </Button>,
              ];
            }}
            onRow={(record: any) => {
              return {
                onMouseEnter: () => {
                  console.log(record);
                },
                onClick: () => {
                  console.log(record);
                },
              };
            }}
            rowKey="name"
            headerTitle="基础列表"
            tooltip="基础列表的配置"
            dataSource={dataSource}
            showActions="hover"
            showExtra="hover"
            metas={{
              title: {
                dataIndex: 'name',
              },
              avatar: {
                dataIndex: 'image',
              },
              description: {
                dataIndex: 'desc',
              },
              subTitle: {
                render: () => {
                  return (
                    <Space size={0}>
                      <Tag color="blue">Ant Design</Tag>
                      <Tag color="#5BD8A6">TechUI</Tag>
                    </Space>
                  );
                },
              },
              actions: {
                render: (text, row) => [
                  <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="link">
                    链路
                  </a>,
                  <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="warning">
                    报警
                  </a>,
                  <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="view">
                    查看
                  </a>,
                ],
              },
            }}
          />
        </ProCard> */}
      </ProCard>
      <UserModal
        phone={searchKey}
        modalType={modalType}
        onCancel={cancelUserModal}
        visible={userMoadlVisible} />
    </PageContainer>
  );
};

export default TableList;
