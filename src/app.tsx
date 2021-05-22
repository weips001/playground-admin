// import { createLogger } from 'redux-logger';
import { message, notification } from 'antd';

export const dva = {
  config: {
    // onAction: createLogger(),
    onError(e: Error) {
      console.log(e)
      const {msg = '位置错误'} = e
      // message.error(e, 3);
      notification.error({
        message: `操作失败`,
        description: msg,
      });
    },
  },
};