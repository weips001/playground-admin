import React, { useRef } from 'react'
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
import {sexType, gameBiType} from '@/utils/constant'
import {add} from '../service'
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

  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      const {name, phone} = currentRow
      const values = {
        name,
        phone
      }
      formRef.current?.setFieldsValue(values)
    }
  }

  return <ModalForm<{
    name: string;
    company: string;
  }>
    title="充值"
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
      await add(values)
      onOk()
      message.success('充值成功');
      return true;
    }}
  >
    <ProForm.Group>
      <ProFormText width="md" name="name" readonly label="姓名" />
      <ProFormText width="md" name="phone" label="手机号" readonly />
    </ProForm.Group>
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
              const {label, total, month} = e.target
              const overdate= moment(new Date()).add(month, 'month').format('YYYY-MM-DD')
              formRef.current?.setFieldsValue({
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
        <ProFormText width="md" name="total" label="游戏币个数" readonly />
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
      <ProForm.Group>
        <ProFormTextArea
          name="remark"
          label="备注"
          width="xl"
          placeholder="请输入备注"
        />
      </ProForm.Group>
  </ModalForm>
}

export default UserMoadl