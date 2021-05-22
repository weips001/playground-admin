import React from 'react';
import { message } from 'antd';
import ProForm, { ProFormText, ProFormRadio, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-form';
import {rechargeType, sexType} from '@/utils/constant'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type CardRechargeProps = {

}

const CardRecharge:React.FC<CardRechargeProps> = () => {
  return (
    <ProForm<{
      name: string;
      company: string;
    }>
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
      }}
      initialValues={{
        name: '蚂蚁设计有限公司',
        useMode: 'chapter',
      }}
    >
      <ProForm.Group>
        <ProFormRadio.Group
          name="radio"
          radioType="button"
          label="套卡类型"
          fieldProps={{
            onChange(e) {
              console.log('e', e)
            }
          }}
          options={rechargeType}
        >
        </ProFormRadio.Group>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="money" readonly label="金额" />
        <ProFormText width="md" name="nums" label="次数" readonly />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDatePicker width="md"
          rules={[
            {
              required: true,
              message: '请选择娃子的生日!',
            },
          ]}
          name="birthday" label="有效期至" placeholder="请选择娃子的生日" />
      </ProForm.Group>
    </ProForm>
  )
}

export default CardRecharge