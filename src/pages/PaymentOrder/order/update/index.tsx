import React from 'react'
import {message} from 'antd'
import BaseForm from '../components/BaseForm'
import {update} from '@/pages/PaymentOrder/service'
import {history} from 'umi'
import {useParams} from 'react-router-dom'
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const UpdatePaymentOrder:React.FC = props => {
  const routeParams = useParams<{id: string}>()

  const updatePayment = async (values: Record<string, any>) => {
    const params = {
      ...values,
      id: routeParams.id
    }
    await update(params)
    history.push('/payment-order')
    message.success('编辑成功');
  }
  
  return <BaseForm formType="update" id={routeParams.id} onFinish={updatePayment}  />
}


export default UpdatePaymentOrder