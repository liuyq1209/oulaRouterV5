import type { ComponentType } from 'react';
import type {
  InputNumberProps,
  TreeSelectProps,
  SelectProps,
  DatePickerProps,
  FormItemProps,
} from '@ht/sprite-ui';
import type { RangePickerProps } from '@ht/sprite-ui/lib/date-picker';
import type { AutoCompleteProps } from './AutoComplete';
import type { InputProps } from './Input';

type RegisteryComponent = {
  /**
   * 输入框
   */
  input: InputProps;

  /**
   * 输入数字
   */
  inputNumber: InputNumberProps;

  /**
   * 下拉框
   */
  select: Omit<SelectProps<string | number>, 'treeData' | 'options'> & {
    /**
     * @description 当 option 为 string 时，指定传入 Search Form 的 constants key
     */
    options?: string | SelectProps<string | number>['options'];
  };

  /**
   * 树形下拉
   */
  treeSelect: Omit<TreeSelectProps<string | number>, 'treeData'> & {
    /**
     * @description 当 treeData 为 string 时，指定传入 Search Form 的 constants key
     */
    treeData?: string | TreeSelectProps<string | number>['treeData'];
  };

  /**
   * 搜索选择
   */
  autoComplete: AutoCompleteProps;

  /**
   * 日期选择
   */
  datePicker: DatePickerProps;

  /**
   * 日期范围选择
   */
  rangePicker: RangePickerProps;
};
type SupportType = keyof RegisteryComponent;
export type SupportComponents = {
  [key in SupportType]: {
    /**
     * @description 该类型对应的表单组件
     */
    component: ComponentType<g.o>;

    /**
     * @description 该类型组件对应的默认 placeholder
     */
    placeholder?: string | [string, string];

    /**
     * 其他默认属性
     */
    [k: string]: unknown;
  };
};

export interface BaseSearchItem<T extends SupportType, V extends g.o = g.o> {
  /**
   * @description 搜索名称
   */
  label: string;

  /**
   * @description 搜索类型
   */
  type: T;

  /**
   * @example
   * function handleQuery(results) {
   *   const safeRange = results.range as [string, string];
   *   return { start: safeRange[0], end: safeRange[1], ...others };
   * }
   * @description 处理表单填写的结果 返回用于 query 的参数。注意：返回结果会替换掉入参
   */
  handleQuery?: (results: V) => g.o;

  /**
   * @description 对应 `type` 指定的组件的属性
   */
  props?: RegisteryComponent[T];

  /**
   * @description `Form.Item` 的属性
   */
  formItemProps?: Omit<FormItemProps<V>, 'name' | 'label'>;
}

type ExtractSearch<T, V extends g.o> = T extends SupportType
  ? BaseSearchItem<T, V>
  : never;

/**
 * @description 搜索表单项的配置
 * @template V 表单配置中 表单内容的 js 对象类型
 */
export type SearchItem<V extends g.o = g.o> = ExtractSearch<SupportType, V>;

/**
 * @description 搜索表单的配置
 * @template V 表单配置中 表单内容的 js 对象类型
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
export type SearchConfig<V extends g.o = g.o> = {
  /**
   * @description 表单项名称
   */
  [k in keyof V]?: SearchItem<V>;
};
