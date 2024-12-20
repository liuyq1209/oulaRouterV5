import { Form } from '@ht/sprite-ui';
import React, { useCallback, useEffect, useState } from 'react';
import LruCache from 'lru-cache';
import { reduce, entries, isFunction, isEmpty } from 'lodash';
import cn from 'classnames';
import { useCreation as useMemo } from 'ahooks';
import type { ReactNode } from 'react';
import type { FormProps } from '@ht/sprite-ui';
import { typeToComponent } from './mapUtil';
import styles from './style.less';

import type { SearchConfig, SearchItem, BaseSearchItem } from './types';

const { useForm } = Form;
const cache = new LruCache<string, unknown>(50);

export type SearchProps<V extends g.o = g.o> = {
  /**
   * @description 搜索对应配置项
   * @example
   *
   * import Search from '@/components/Search';
   * import type { SearchConfig } from '@/components/Search';
   *
   * type SearchEntity = { key: string };
   *
   * const config: SearchConfig<SearchEntity> = {
   *   key: {
   *     label: '关键字',
   *     type: 'input',
   *     props: { size: 'small' },
   *   },
   *   // ...
   * };
   *
   * function Page() {
   *   return <Search config={config} />;
   * }
   */
  config?: SearchConfig<V>;

  /**
   * @description 表单名称
   */
  name?: string;

  /**
   * @description 样式类名
   */
  className?: string;

  /**
   * @description 指定缓存 key 后 将使用 lru 策略缓存
   * 注：使用 `cacheKey` 后，将回调一次 `onSearch`
   */
  cacheKey?: string;

  /**
   * @description 第一次进入页面之后是否回调 `onSearch`
   * @default false
   */
  // eslint-disable-next-line react/boolean-prop-naming
  firstSearch?: boolean;

  /**
   * @description 存放 tree select 的选择列表
   */
  constants?: g.o;

  /**
   * @description 位于搜索表单右侧的内容
   */
  rightContent?: ReactNode;

  /**
   * @description 搜索时触发
   * @param query 经过 `config.handleQuery` 转换的结果
   * @param rawValue 未经转换 直接从表单获取的值
   */
  onSearch?: (query: g.o, rawValue: V) => void;
};

const defaultFormProps: FormProps = {
  layout: 'inline',
};

/**
 * @description 搜索表单内容
 * @template V 表单配置中 表单内容的 js 对象类型
 */
export default function Search<V extends g.o = g.o>(
  searchProps: SearchProps<V>
) {
  const {
    name: formName,
    config,
    className,
    cacheKey,
    firstSearch,
    rightContent,
    onSearch,
  } = searchProps;

  if (cacheKey === '') {
    throw Error('cacheKey 不能为空串');
  }

  const [extra, setExtra] = useState<g.o>({});

  const [form] = useForm();

  const items = useMemo(
    () => entries(config).map(([name, value]) => ({ name, ...value! })),
    [config]
  );

  const onValuesChange = useCallback(
    async (_, values = {}) => {
      let passed = true;
      try {
        await form.validateFields();
      } catch (error) {
        passed = isEmpty(error.errorFields);
      }
      if (!passed) {
        return;
      }
      const query = reduce(
        items,
        (acc, cur) => {
          if (isFunction(cur.handleQuery)) {
            return cur.handleQuery(acc);
          }
          return acc;
        },
        values
      );
      onSearch?.(query, values);
      if (cacheKey) {
        cache.set(cacheKey, values);
      }
    },
    [items, onSearch, form, cacheKey]
  );

  useEffect(() => {
    // cacheKey 的判断是为了刷掉缓存数据 ?
    if (firstSearch || cacheKey) {
      onValuesChange(undefined, cacheKey && cache.get(cacheKey));
    }
  }, []);

  const itemRender = (it: typeof items[number]) => {
    const { name, label, props, type, formItemProps } = it;
    const {
      component: Comp,
      needExtra,
      customProps,
      ...defaultProps
    } = typeToComponent[type];

    let computedProps: g.o = {};
    if (needExtra) {
      computedProps.extra = extra[name];
      computedProps.onExtraChange = (v: g.o) => {
        setExtra((p) => ({ ...p, name: v }));
      };
    }
    if (isFunction(customProps)) {
      computedProps = { ...computedProps, ...customProps(it, searchProps) };
    }
    return (
      <Form.Item key={name} {...formItemProps} name={name} label={label}>
        <Comp
          allowClear={true}
          {...defaultProps}
          {...props}
          {...computedProps}
          name={name}
        />
      </Form.Item>
    );
  };

  return (
    <div className={cn(styles.searchForm, className)}>
      <Form
        size="small"
        {...defaultFormProps}
        form={form}
        name={formName}
        onValuesChange={onValuesChange}
        initialValues={cacheKey && (cache.get(cacheKey) as any)}
      >
        {items.map(itemRender)}
      </Form>
      <div>{rightContent}</div>
    </div>
  );
}

export type { SearchConfig, SearchItem, BaseSearchItem };
