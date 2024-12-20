import {
  InputNumber,
  DatePicker,
  TreeSelect,
  Select,
  Tooltip,
} from '@ht/sprite-ui';
import { isString, isEmpty } from 'lodash';
import type { LabelValueType } from 'rc-select/lib/interface/generator';
import AutoComplete from './AutoComplete';
import Input from './Input';

import type { BaseSearchItem, SupportComponents } from './types';
import type { SearchProps } from '.';

const { RangePicker } = DatePicker;

const defaultMaxTagProps = {
  maxTagCount: 'responsive',
  maxTagPlaceholder: (omitValues: LabelValueType[]) => {
    if (isEmpty(omitValues)) {
      return null;
    }
    return (
      <Tooltip title={omitValues.map(it => it.label).join('、')}>
        +{omitValues.length}
      </Tooltip>
    );
  },
};

/**
 * @description 将类型字符串映射成组件及其默认属性
 */
export const typeToComponent: SupportComponents = {
  input: {
    component: Input,
    placeholder: '请输入',
  },
  inputNumber: {
    component: InputNumber,
    placeholder: '请输入',
  },
  select: {
    component: Select,
    placeholder: '请选择',
    ...defaultMaxTagProps,
    customProps: (
      { props }: BaseSearchItem<'select'>,
      formProps: SearchProps,
    ) => {
      const { options } = props || {};
      if (!options || !isString(options)) {
        return undefined;
      }
      const { constants } = formProps;
      return { options: constants?.[options] };
    },
  },
  treeSelect: {
    component: TreeSelect,
    placeholder: '请选择',
    ...defaultMaxTagProps,
    customProps: (
      { props }: BaseSearchItem<'treeSelect'>,
      formProps: SearchProps,
    ) => {
      const { treeData } = props || {};
      if (!treeData || !isString(treeData)) {
        return undefined;
      }
      const { constants } = formProps;
      return { treeData: constants?.[treeData] };
    },
  },
  autoComplete: {
    component: AutoComplete,
    placeholder: '请输入',
    needExtra: true,
  },
  datePicker: {
    component: DatePicker,
    placeholder: '请选择',
  },
  rangePicker: {
    component: RangePicker,
  },
};
