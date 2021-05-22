import React from 'react'
import {message} from 'antd'
import BaseForm from '../components/BaseForm'
import {add} from '@/pages/PaymentOrder/service'
import {history} from 'umi'
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const CreatePaymentOrder = () => {
  // const formRef = useRef<FormInstance>()
  const createPayment = async (values: Record<string, any>) => {
    const params = {
      ...values,
      status: '1'
    }
    await add(params)
    history.push('/payment-order')
    message.success('提交成功');
  }
  const savePayment = async (values: Record<string, any>) => {
    const params = {
      ...values,
      status: '0'
    }
    await add(params)
    history.push('/payment-order')
    message.success('保存成功');
  } 
  
  return <BaseForm formType="create" onFinish={createPayment} onSave={savePayment}  />
}


export default CreatePaymentOrder