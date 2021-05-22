import { useEffect, useState,useRef } from 'react';
import { Checkbox, Divider, Row, Col, Card, FormInstance, message } from 'antd';
import type { CheckboxChangeEvent } from '_antd@4.14.1@antd/lib/checkbox';
import type { CheckboxValueType } from '_antd@4.14.1@antd/es/checkbox/Group';
import { getAllAuthCode } from '@/utils/utils';
import { connect } from 'dva';
import type { ConnectState } from '@/models/connect';
import {RoleActionType} from '../index'
import ProForm, { ProFormText, ProFormCheckbox, ProFormSelect } from '@ant-design/pro-form';
import { edit, add } from '../service';
import styles from './index.less'
const CheckboxGroup = Checkbox.Group;
type RoleListProps = {
  currentAllAuthList: { label: string; value: string }[];
  currentRow: {};
  loading?: boolean
  reload: () => void
  action: RoleActionType
};

const RoleList: React.FC<RoleListProps> = (props) => {
  console.log('render Role', props);
  const { currentRow, currentAllAuthList, dispatch, reload, loading, action} = props;
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const formRef = useRef<FormInstance>()
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const allAuthCode = getAllAuthCode();
  const readonly: boolean = action === 'detail'
  useEffect(() => {
    if(currentRow?.id) {
      formRef.current?.setFieldsValue(currentRow)
      return
    }
    formRef.current?.resetFields()
  })
  const editRole = async (params) => {
    const {msg} = await edit(params)
    reload()
    message.success(msg)
  }
  const addRole = async (params) => {
    const {msg} = await add(params)
    reload()
    message.success(msg)
  }
  return (
    <Card>
      <ProForm<{
        name: string;
        company: string;
      }>
        formRef={formRef}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            }
          }
        }}
        onFinish={async (values) => {
          if (action === 'add') {
            return addRole(values)
          }
          const params = {
            ...currentRow,
            ...values
          }
          return editRole(params)
        }}
        className={styles.form}
      >
        <ProFormText
          width="md"
          name="name"
          readonly={readonly}
          label="角色名称"
          tooltip="角色名称不能重复"
          placeholder="请输入角色名称"
          rules={[
            {
              required: true,
              max: 10,
              message: '请输入角色名称!',
            }
          ]}
        />
        <ProFormText
          width="md"
          readonly={readonly}
          rules={[
            {
              required: true,
              max: 10,
              message: '请输入角色描述!',
            }
          ]}
          name="desc"
          label="角色描述"
          placeholder="请输入角色描述" />
        <ProFormCheckbox.Group
          name="auth"
          label="权限"
          readonly={readonly}
          layout="vertical"
          options={currentAllAuthList}
          />
      </ProForm>
      
      {/* <Divider />
      <Row justify="end">
        <Button type="primary" loading={loading} onClick={addRole}>
          确定
        </Button>
      </Row> */}
    </Card>
  );
};

export default connect((state:ConnectState) => {
  console.log('state', state);
  return {
    currentAllAuthList: state.user.currentAllAuthList,
    loading: state.loading.effects['role/edit']
  };
})(RoleList);
