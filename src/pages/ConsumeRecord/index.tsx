import { Button, message, Upload, Modal, FormInstance } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { getTableList, syncUserInfo } from './service';
import { UploadOutlined } from '@ant-design/icons';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateLoading, setLoading] = useState<boolean>(false);
  const searchFormRef = useRef<FormInstance>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      order: 2,
    },
    {
      title: '卡号',
      dataIndex: 'cardId',
      order: 1,
    },
    {
      title: '消费次数',
      hideInSearch: true,
      dataIndex: 'shoppingNum',
    },
    {
      title: '消费日期',
      hideInSearch: true,
      dataIndex: 'consumeTime',
      valueType: 'dateTime',
    },
    {
      title: '备注',
      hideInSearch: true,
      dataIndex: 'remark',
    },
  ];
  const syncUser = async () => {
    setLoading(true);
    await syncUserInfo();
    setLoading(false);
  };
  const props = {
    name: 'file',
    showUploadList: false,
    action: '/api/uploadConsumeRecord',
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
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传消费记录</Button>
          </Upload>,
          <Button onClick={syncUser} loading={updateLoading}>
            同步用户信息
          </Button>,
        ]}
        request={(params, sorter, filter) => getTableList({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
