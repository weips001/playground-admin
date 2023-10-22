import React, { useRef,useState } from 'react'
import { Button, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDatePicker,
  ProFormTextArea,
  ProFormDateTimePicker,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment'
import type {FormInstance} from 'antd'
import {consumeNum, rechargeType} from '@/utils/constant'
import {update} from '../service'
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
  currentRow: {string: any}
  phone: string
  onCancel: () => void
  onOk: () => void
}
const titleMap = {
  create: '创建会员',
  update: '更新会员',
}
const UserMoadl: React.FC<UserMoadlProps> = (props) => {
  const { visible, currentRow, onCancel, onOk } = props
  const formRef = useRef<FormInstance>()
  const [activeConsume, setActiveConsume] = useState(consumeNum)
  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      const {name, phone, restTotal} = currentRow
      const values = {
        name,
        phone
      }
      formRef.current?.setFieldsValue(values)
      console.log('restTotal', restTotal)
      if (restTotal == -1 || restTotal == -2) {
        const newConsume = activeConsume.filter(item => item.value === 1 )
        setActiveConsume(newConsume)
      } else {
        const newConsume = activeConsume.filter(item => item.value <= restTotal )
        setActiveConsume(newConsume)
      }
    } else {
      setActiveConsume(consumeNum)
    }
  }

  return <ModalForm<{
    name: string;
    company: string;
  }>
    title="消费"
    visible={visible}
    formRef={formRef}
    initialValues={{
      deleteNum: 1
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
      const params = {
        deleteNum: values.deleteNum,
        id: currentRow.id
      }
      await update(params)
      onOk()
      message.success('消费成功');
      return true;
    }}
  >
    <ProForm.Group>
      <ProFormText width="md" name="name" readonly label="姓名" />
    </ProForm.Group>
    <ProForm.Group>
      <ProFormText width="md" name="phone" label="手机号" readonly />
    </ProForm.Group>
    <ProForm.Group>
        <ProFormRadio.Group
          name="deleteNum"
          radioType="button"
          label="消费次数"
          rules={[
            {
              required: true,
              message: '请选择消费次数!',
            },
          ]}
          options={activeConsume}
        >
        </ProFormRadio.Group>
      </ProForm.Group>
  </ModalForm>
}

export default UserMoadl