import React, { useRef } from 'react'
import { Button, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDateRangePicker,
  ProFormDatePicker,
  ProFormTextArea,
  ProFormDateTimePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import type {FormInstance} from 'antd'
import {sexType} from '@/utils/constant'
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type CreateUpdateType = 'create' | 'update'

type UserMoadlProps = {
  visible: boolean
  modalType: CreateUpdateType
  phone: string
  onCancel: () => void
}
const titleMap = {
  create: '创建会员',
  update: '更新会员',
}
const UserMoadl: React.FC<UserMoadlProps> = (props) => {
  const { visible, modalType, onCancel, phone } = props
  const formRef = useRef<FormInstance>()

  const onVisibleChange = (visible: boolean) => {
    if (visible && phone.length === 11) {
      formRef.current?.setFieldsValue({
        phone
      })
    }
  }

  return <ModalForm<{
    name: string;
    company: string;
  }>
    title={titleMap[modalType]}
    visible={visible}
    formRef={formRef}
    initialValues={{
      sex: '0'
    }}
    onVisibleChange={onVisibleChange}
    modalProps={{
      onCancel: () => {
        onCancel()
      },
      afterClose: () => {
        formRef.current?.resetFields()
      }
    }}
    onFinish={async (values) => {
      await waitTime(2000);
      console.log(values);
      message.success('提交成功');
      return true;
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
      {/* <ProFormDatePicker width="md"
        rules={[
          {
            required: true,
            message: '请选择娃子的生日!',
          },
        ]}
        name="birthday" label="生日" placeholder="请选择娃子的生日1" /> */}
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
         <ProFormText width="md" name="cardId" label="卡号" placeholder="请输入卡号" />
    </ProForm.Group>
    <ProForm.Group>
     
    </ProForm.Group>
    <ProForm.Group>
      <ProFormTextArea
        name="text"
        label="备注"
        width="xl"
        placeholder="请输入备注"
      />
    </ProForm.Group>
  </ModalForm>
}

export default UserMoadl