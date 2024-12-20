import React, { useCallback, useEffect, useState } from 'react';
import { identity, first, has, isUndefined } from 'lodash';
import cn from 'classnames';
import { Alert, Button, Table } from '@ht/sprite-ui';
import { useRequest } from '@@/plugin-request/request';
import type {
  TableProps,
  TableColumnsType,
  TablePaginationConfig,
} from '@ht/sprite-ui';
import Search from '../Search';
import type { SearchConfig, SearchProps } from '../Search';
import styles from './style.less';

import type { ResultWrapper, ListData } from '@/utils/request';
import request from '@/utils/request';

type TableData<R> = {
  dataSource: R[];
  pagination: TableProps<R>['pagination'];
};

export type ListPageProps<R> = {
  className?: string;

  /**
   * @description 搜索控件的配置文件
   */
  searchConfig?: SearchConfig;

  /**
   * @description 表格列配置
   */
  tableColumns: TableColumnsType<R>;

  /**
   * @description 表格底部显示内容
   */
  footer?: TableProps<R>['footer'];

  /**
   * @description treeSelect 与 select 依赖的枚举
   */
  constants?: g.o;

  /**
   * @description 表格用来区分行之间 item 的关键字，默认为 'key'，取 item 在表格中的 index
   * @default 'key'
   */
  rowKey?: string;

  /**
   * @description 获取列表内容的 url
   */
  fetchUrl?: string;

  /**
   * @description `fetchUrl` 对应的 method
   * @default 'get'
   */
  fetchMethod?: 'get' | 'post';

  /**
   * @description 通过 `fetchUrl` 获取数据后，转换成 列表数据与分页数据
   * @default
   * function dataResolver(resp) {
   *   // 获取 resp.data 中的列表数据与分页数据 此处省略处理逻辑
   *   return { dataSource: resp.data.list, pagination: resp.data };
   * }
   */
  dataResolver?: <T>(resp: T, props: ListPageProps<R>) => TableData<R>;

  /**
   * @description 缓存搜索条件
   */
  cacheKey?: string;

  /**
   * @description 剩余的表格属性
   */
  tableProps?: Omit<TableProps<R>, keyof ListPageProps<R>>;

  /**
   * @description 搜索时触发
   * @param query 经过 `config.handleQuery` 转换的结果
   * @param rawValue 未经转换 直接从表单获取的值
   */
  onSearch?: SearchProps['onSearch'];
};

/**
 * 将接口返回的数据解析成表格需要的列表数据与分页数据
 */
function defaultDataResolver<R extends g.o>(
  input: ResultWrapper<ListData<R>>,
  props: ListPageProps<R>
): TableData<R> {
  const { list, total, current, pageSize } = input?.data || {};
  return {
    // 不传入 rowKey 时，使用 (pageSize - 1) * current + currentIndex 作为 rowKey
    dataSource: isUndefined(props.rowKey)
      ? list?.map((it, i) =>
          has(it, 'key')
            ? it
            : { key: `${i + (current - 1) * pageSize}`, ...it }
        )
      : list,
    pagination: {
      total,
      current,
      pageSize,
      showTotal: (t) => `共 ${t} 条`,
      showSizeChanger: false,
    },
  };
}

const defaultPagination = { current: 1, pageSize: 10 };

export default function ListPage<R extends g.o = g.o>(props: ListPageProps<R>) {
  const {
    className,
    searchConfig,
    tableColumns,
    constants,
    rowKey = 'key',
    fetchUrl,
    fetchMethod = 'get',
    dataResolver,
    footer,
    cacheKey,
    tableProps,
    onSearch: onSearchCallback,
  } = props;
  // 因为不同分页的内容请求可能会失败，导致原分页数据也丢失，所以将成功请求的结果放入缓存
  const [cachedData, setCachedData] = useState<TableData<R>>();

  // 请求列表数据
  const { data, loading, run, params, error, refresh } = useRequest<
    TableData<R>,
    [g.o],
    TableData<R>
  >(
    async (query) => {
      if (!fetchUrl) {
        throw Error('请指定获取数据 url');
      }
      const payload =
        fetchMethod.toLocaleLowerCase() === 'post'
          ? {
              method: 'POST',
              data: {
                ...query,
              },
            }
          : {
              params: query,
            };
      const resp = await request[fetchMethod]<ListData<R>>(fetchUrl, payload);
      return ((dataResolver as any) || defaultDataResolver)(resp, props);
    },
    {
      defaultParams: [defaultPagination],
      formatResult: identity,
      manual: true,
    }
  );

  const onSearch = useCallback(
    (values: g.o, rawValue: g.o) => {
      run({ ...values, ...defaultPagination });
      onSearchCallback?.(values, rawValue);
    },
    [run, onSearchCallback]
  );

  const onTableChange = useCallback(
    ({ current, pageSize }: TablePaginationConfig) => {
      run({ ...first(params), current, pageSize });
    },
    [run, params]
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    setCachedData(data);
  }, [data]);

  const cls = cn(className, styles.page);
  return (
    <div className={cls}>
      <Search
        className={styles.search}
        firstSearch={true}
        config={searchConfig}
        constants={constants}
        cacheKey={cacheKey}
        onSearch={onSearch}
      />
      {error && (
        <Alert
          banner={true}
          type="error"
          message={error.message || '请求错误，请重试'}
          action={
            <Button size="small" onClick={refresh}>
              重新加载
            </Button>
          }
        />
      )}
      <Table<R>
        {...tableProps}
        size="small"
        tableLayout="fixed"
        loading={loading}
        columns={tableColumns}
        dataSource={cachedData?.dataSource}
        pagination={cachedData?.pagination}
        onChange={onTableChange}
        rowKey={rowKey}
        footer={footer}
      />
    </div>
  );
}
