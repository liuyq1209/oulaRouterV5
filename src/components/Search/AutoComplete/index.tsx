import { useCallback, useEffect, useState } from 'react';
import { get, identity, find } from 'lodash';
import { AutoComplete as AntdAutoComplete, Input } from '@ht/sprite-ui';
import { SearchOutlined, LoadingOutlined } from '@ht-icons/sprite-ui-react';
import { useDebounceFn } from 'ahooks';

import type { ReactNode } from 'react';
import type { AutoCompleteProps as AntdAutoCompleteProps } from '@ht/sprite-ui';
import type { OptionsType } from 'rc-select/lib/interface';
import request from '@/utils/request';

type OptionType = {
  label: ReactNode;
  value: string;
  extra?: g.o;
};
type OptionTypes = OptionType[];

export type AutoCompleteProps = g.e<
  AntdAutoCompleteProps,
  {
    placeholder?: string;

    /**
     * @description 请求搜索数据对应的接口
     */
    url?: string;

    /**
     * @description 将输入的字符串组合成搜索传递的内容
     */
    query?: (input: string) => g.o;

    /**
     * @description 接口请求方法
     * @default 'get'
     */
    method?: 'get' | 'post';

    /**
     * @description 返回结果对应的选项路径
     * @default 'data'
     */
    path?: string | string[];

    /**
     * @description 将接口的结果项转换成 option 的展示项
     * @default lodash.identity
     */
    convert?: (value: any) => string;

    /**
     * @description option 中用于表单对应值的 key，默认使用 convert 的返回值
     */
    targetKey?: string;

    /**
     * @description 是否根据设置的初始值进行搜索
     * @default false
     */
    searchWithInitalValue?: boolean;

    /**
     * @description 该组件依赖的值
     */
    extra?: g.o;

    /**
     * @description 将该组件依赖的某些值存储到表单中
     */
    onExtraChange?: (extra: g.o) => void;
  }
>;

export default function AutoComplete(props: AutoCompleteProps) {
  const {
    url,
    query,
    method = 'get',
    path = 'data',
    convert = identity,
    targetKey,
    allowClear,
    placeholder,
    // searchWithInitalValue = false,
    extra,
    onExtraChange,
    value: formValue,
    onChange,
    ...others
  } = props;

  const [value, setValue] = useState<string>();
  const [options, setOptions] = useState<OptionTypes>(
    extra?.options as OptionTypes
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(
      formValue &&
        find(
          options,
          (it) => (targetKey ? it.extra?.[targetKey] : it.value) === formValue
        )?.value
    );
  }, [formValue]);

  const { run: fetchOption } = useDebounceFn(
    async (key: string) => {
      if (!url || !query) {
        return;
      }
      try {
        setLoading(true);
        const resp = await request[method](url, query(key));
        setOptions(
          get(resp, path)?.map((it: g.o) => {
            const display = convert(it);
            return {
              value: display,
              label: display,
              extra: it,
            };
          })
        );
      } finally {
        setLoading(false);
      }
    },
    { wait: 500 }
  );

  const onSelect = useCallback(
    (v: string, option: OptionsType[number]) => {
      setValue(v);
      onChange?.(targetKey ? option.extra?.[targetKey] : v, option);
    },
    [onChange, targetKey]
  );

  const onSearch = useCallback(
    (key: string) => {
      setValue(key);
      if (key) {
        fetchOption(key);
      } else {
        setOptions([]);
        onChange?.(undefined!, undefined!);
      }
    },
    [fetchOption, onChange]
  );

  return (
    <AntdAutoComplete
      {...others}
      value={value}
      options={options}
      onSearch={onSearch}
      onSelect={onSelect}
    >
      <Input
        placeholder={placeholder}
        allowClear={allowClear}
        suffix={loading ? <LoadingOutlined /> : <SearchOutlined />}
      />
    </AntdAutoComplete>
  );
}
