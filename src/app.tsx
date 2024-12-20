// 运行时代码。使用 antd prefix 时，对于 notification, message 需要手动设置 prefixCls; 如果希望全局设置，可以放在这里

import { notification, message } from '@ht/sprite-ui';
import BaseSettings from '@config/BaseSettings';

notification.config({
  prefixCls: `${BaseSettings.appName}-notification`,
});

message.config({
  prefixCls: `${BaseSettings.appName}-message`,
});
