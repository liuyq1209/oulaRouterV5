/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Link } from '@oula/oula';
import { Menu } from '@ht/sprite-ui';
import React from 'react';
import getIcon from './getIcon';

import type { MenuTheme, MenuProps } from '@ht/sprite-ui';

import type {
  MenuDataItem,
  MessageDescriptor,
  Route,
  RouterTypes,
  WithFalse,
} from './typings';

export type MenuMode =
  | 'vertical'
  | 'vertical-left'
  | 'vertical-right'
  | 'horizontal'
  | 'inline';

export type BaseMenuProps = {
  menu?: {
    locale?: boolean;
    defaultOpenAll?: boolean;
    loading?: boolean;
    onLoadingChange?: (loading?: boolean) => void;
    params?: Record<string, any>;
    request?: (
      params: Record<string, any>,
      defaultMenuData: MenuDataItem[]
    ) => Promise<MenuDataItem[]>;
    type?: 'sub' | 'group';
    autoClose?: false;
  };
  className?: string;
  /** 默认的是否展开，会受到 breakpoint 的影响 */
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  splitMenus?: boolean;
  isMobile?: boolean;
  menuData?: MenuDataItem[];
  mode?: MenuMode;
  onCollapse?: (collapsed: boolean) => void;
  openKeys?: WithFalse<string[]> | undefined;
  handleOpenChange?: (openKeys: string[]) => void;
  iconPrefixes?: string;
  /** 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/ */
  menuProps?: MenuProps;
  style?: React.CSSProperties;
  theme?: MenuTheme;
  formatMessage?: (message: MessageDescriptor) => string;
} & Partial<RouterTypes<Route>> &
  Omit<MenuProps, 'openKeys' | 'onOpenChange' | 'title'>;

const { SubMenu, ItemGroup } = Menu;

class MenuUtil {
  constructor(props: BaseMenuProps) {
    this.props = props;
  }

  props: BaseMenuProps;

  getNavMenuItems = (
    menusData: MenuDataItem[] = [],
    isChildren: boolean
  ): React.ReactNode[] =>
    menusData
      .filter((item) => !item.redirect)
      .map((item) => this.getSubMenuOrItem(item, isChildren))
      .filter((item) => item);

  /** Get SubMenu or Item */
  getSubMenuOrItem = (
    item: MenuDataItem,
    isChildren: boolean
  ): React.ReactNode => {
    if (Array.isArray(item.children) && item && item.children.length > 0) {
      const name = this.getIntlName(item);
      const { prefixCls, menu, iconPrefixes } = this.props;
      //  get defaultTitle by menuItemRender
      const Icon = !isChildren ? null : getIcon(item.icon);

      const title = item.icon ? (
        <span className={`${prefixCls}-menu-item`} title={name}>
          {Icon && <Icon />}
          <span className={`${prefixCls}-menu-item-title`}>{name}</span>
        </span>
      ) : (
        <span className={`${prefixCls}-menu-item`} title={name}>
          {name}
        </span>
      );

      const MenuComponents: React.ElementType =
        menu?.type === 'group' ? ItemGroup : SubMenu;
      return (
        <MenuComponents
          title={title}
          key={item.key || item.path}
          onTitleClick={item.onTitleClick}
        >
          {this.getNavMenuItems(item.children, true)}
        </MenuComponents>
      );
    }

    return (
      <Menu.Item
        disabled={item.disabled}
        key={item.key || item.path}
        onClick={item.onTitleClick}
      >
        {this.getMenuItemPath(item, isChildren)}
      </Menu.Item>
    );
  };

  getIntlName = (item: MenuDataItem) => {
    // const { name, locale } = item;
    // const { menu, formatMessage } = this.props;
    // if (locale && menu?.locale !== false) {
    //   return formatMessage?.({
    //     id: locale,
    //     defaultMessage: name,
    //   });
    // }
    const { name } = item;
    return name;
  };

  getMenuItemPath = (item: MenuDataItem, isChildren: boolean) => {
    const itemPath = this.conversionPath(item.path || '/');
    const { iconPrefixes } = this.props;
    // if local is true formatMessage all name。
    const name = this.getIntlName(item);
    const { prefixCls } = this.props;
    const Icon = isChildren ? null : getIcon(item.icon);
    return (
      <Link to={itemPath}>
        <span className={`${prefixCls}-menu-item`}>
          {Icon && <Icon />}
          <span className={`${prefixCls}-menu-item-title`}>{name}</span>
        </span>
      </Link>
    );
  };

  conversionPath = (path: string) => {
    if (path && path.startsWith('http')) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
}

export default MenuUtil;
