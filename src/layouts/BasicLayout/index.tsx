import React, { useState } from 'react';
import { connect } from '@oula/oula';
import type { Dispatch } from '@oula/oula';
import { transformRoute } from '@umijs/route-utils';
import { Layout, Menu, ConfigProvider } from '@ht/sprite-ui';
import zhCN from '@ht/sprite-ui/lib/locale/zh_CN';
import getLocales from '../../locales';
import BaseSettings from '../../../config/BaseSettings';
import MenuUtil from './MenuUtil';
import type { Route } from './typings';
import LogoArea from './LogoArea';
import styles from './index.less';
import type { ConnectState } from '@/models/connect';

const { Header, Content, Sider } = Layout;

type BaiscLayoutProps = {
  collapsed: boolean;
  route?: Route;
  dispatch: Dispatch;
};
const BaiscLayout: React.FC<BaiscLayoutProps> = (props) => {
  const { collapsed, dispatch, route } = props;

  console.log('layout props', props);

  const formatMessage = ({
    id,
    defaultMessage,
  }: {
    id: string;
    defaultMessage?: string;
  }): string => {
    const locales = getLocales();
    return locales[id] ? locales[id] : (defaultMessage as string);
  };
  const { menuData } = transformRoute(
    route?.routes || [],
    // menu?.locale || false,
    false,
    formatMessage,
    true
  );
  const [menuUtils] = useState(() => new MenuUtil(props));

  const onCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  console.log(route, route?.routes, menuData);

  return (
    <ConfigProvider prefixCls={BaseSettings.appName} locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible={true} collapsed={collapsed} onCollapse={onCollapse}>
          <Header style={{ padding: 0 }}>
            <LogoArea collapsed={collapsed} />
          </Header>
          <Menu theme="dark" mode="inline">
            {menuUtils.getNavMenuItems(menuData, false)}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0 }} />
          <Content>
            <div className={styles.mainContent}>{props.children}</div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default connect(({ global }: ConnectState) => ({
  collapsed: global.collapsed,
}))(BaiscLayout);
