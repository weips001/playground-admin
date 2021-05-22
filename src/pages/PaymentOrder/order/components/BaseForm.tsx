import React, { useRef, useEffect } from 'react'
import { Button, Card, Form, FormInstance } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProForm, { ProFormText,ProFormTextArea, ProFormDigit, ProFormRadio, ProFormDatePicker, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';
import {getItemDetail} from '../../service'
import styles from './index.less'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type BaseFormProps = {
  formType: "create" | "update"
  id?: string
  onFinish?: (values: Record<string, any>) => Promise<boolean | void>
  onSave?: (values: Record<string, any>) => Promise<boolean | void>
}

const BaseForm: React.FC<BaseFormProps> = (props) => {
  const {onFinish, onSave, id, formType} = props
  const formRef = useRef<FormInstance>()

  const saveOrder = () => {
    const values = formRef.current?.getFieldsValue()
    onSave(values)
  }
  const getDetail = async(id: string) => {
    const res = await getItemDetail(id)
    formRef.current?.setFieldsValue(res.data)
    // console.log(res)
  }
  useEffect(() => {
    getDetail(id as string)
  }, [id])

  return <ProForm<{
    name: string;
    company: string;
  }>
    submitter={{
      searchConfig: {
        resetText: '取消',
        submitText: formType === 'create' ? '提交' : '编辑',
      },
      render(_, dom) {
        if (formType === 'create') {
          dom.push(<Button key="save" onClick={saveOrder}>保存</Button>)
          return <FooterToolbar>{dom}</FooterToolbar>
        }
        return <FooterToolbar>{dom}</FooterToolbar>
      }
    }}
    formRef={formRef}
    onFinish={(values) => onFinish(values)}
    onReset={() => history.back()}
    initialValues={{
      createTime: new Date(),
      hasLastTime: '1',
      hasNote: '1'
    }}
  >
    <PageContainer content="创建付款申请单。">
      <Card title="基本信息" className={styles.card}>
        <ProForm.Group>
          <ProFormText
            width="md"
            rules={[{required: true}]}
            name="applyUserName"
            label="姓名"
            placeholder="请输入姓名"
          />
          <ProFormText width="md" rules={[{required: true}]} name="department" label="单位或部门名称" placeholder="请输入单位或部门名称" />
          <ProFormDatePicker width="md" readonly name="createTime" label="日期" />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea width="xl" rules={[{required: true}]} label="付款摘要" name="payDigest" placeholder="请输入付款摘要" />
        </ProForm.Group>
      </Card>
      <Card title="付款信息" className={styles.card}>
        <ProForm.Group>
          <ProFormDigit
            tooltip="保留两位小数"
            label="应付款总金额"
            name="payableAll"
            width="md"
            rules={[{required: true}]}
            min={0}
            fieldProps={{
              precision: 2,
              formatter: value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              parser: (value:any) => value?.replace(/\￥\s?|(,*)/g, '')
              }} />
          <ProFormDigit
            tooltip="保留两位小数"
            label="累计已付款"
            name="payedMoney"
            width="md"
            min={0}
            fieldProps={{
              precision: 2,
              formatter: value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              parser: (value:any) => value?.replace(/\￥\s?|(,*)/g, '')
              }} />
          <ProFormDigit
            tooltip="保留两位小数"
            label="本次付款金额"
            name="payMoney"
            rules={[{required: true}]}
            width="md"
            min={0}
            fieldProps={{
              precision: 2,
              formatter: value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
              parser: (value:any) => value?.replace(/\￥\s?|(,*)/g, '')
              }} />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: '0',
                label: '转账',
              },
              {
                value: '1',
                label: '承兑',
              },
            ]}
            width="md"
            rules={[{required: true}]}
            name="payMethod"
            label="付款方式"
          />
          <ProFormSelect
            options={[
              {
                label: '否',
                value: '0',
              },
              {
                label: '已提供',
                value: '1',
              },
              {
                label: '付款后提供',
                value: '2',
              },
              {
                label: '自定义',
                value: '3',
              },
            ]}
            width="md"
            rules={[{required: true}]}
            name="hasProvideInvoice"
            label="是否提供发票及时间"
          />
          <Form.Item noStyle shouldUpdate>
            {(form) => {
              if(form.getFieldValue("hasProvideInvoice") === '3') {
                return <ProFormText width="md" rules={[{required: true}]} label="自定义内容" name="invoiceNote" placeholder="请输入备注" />
              }
              return null
            }}
          </Form.Item>
        </ProForm.Group>
      </Card>
      <Card title="收款人信息" className={styles.card}>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="payeeName"
            label="收款人全称"
            rules={[{required: true}]}
            placeholder="请输入收款人全称"
          />
          <ProFormText
            width="md"
            name="payeeBankName"
            label="开户银行"
            rules={[{required: true}]}
            placeholder="请输入开户银行"
          />
          <ProFormText
            width="md"
            name="bankAccount"
            label="账号"
            rules={[{required: true}, {pattern: /^[0-9]*$/, message: "只能输入数字"}]}
            placeholder="请输入账号"
          />
        </ProForm.Group>
      </Card>
      <Card title="其它信息" className={styles.card}>
        <ProForm.Group>
          <ProFormRadio.Group
            name="hasLastTime"
            label="是否有最晚付款时间"
            rules={[{required: true}]}
            options={[
              {
                label: '是',
                value: '0',
              },
              {
                label: '否',
                value: '1',
              },
            ]}
          />
          <Form.Item noStyle shouldUpdate>
            {(form) => {
              if(form.getFieldValue("hasLastTime") === '0') {
                return <ProFormDatePicker rules={[{required: true}]} name="latestPayTime" width="sm" label="最晚付款时间" />
              }
              return null
            }}
          </Form.Item>
        </ProForm.Group>
        <ProFormRadio.Group
          name="hasNote"
          label="是否备注"
          rules={[{required: true}]}
          options={[
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ]}
        />
        <Form.Item noStyle shouldUpdate>
            {(form) => {
              if(form.getFieldValue("hasNote") === '0') {
                return <ProFormTextArea fieldProps={{showCount: true, maxLength: 30}} width="xl" rules={[{required: true}]} label="备注" name="note" placeholder="请输入备注" />
              }
              return null
            }}
          </Form.Item>
      </Card>
    </PageContainer>
  </ProForm>
}


export default BaseForm