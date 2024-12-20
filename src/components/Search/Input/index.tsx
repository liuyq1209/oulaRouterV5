import { useCallback, useState } from 'react';
import { Input as AntdInput } from '@ht/sprite-ui';
import { useDebounceFn } from 'ahooks';

import type { ChangeEvent } from 'react';
import type { InputProps as AntdInputProps } from '@ht/sprite-ui';

export type InputProps = g.e<
  AntdInputProps,
  {
    /**
     * @description 搜索的间隔
     * @default 500
     */
    wait?: number;
  }
>;

export default function Input({
  value,
  onChange,
  wait = 500,
  ...others
}: InputProps) {
  const [v, setV] = useState(value);
  const { run } = useDebounceFn(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    },
    { wait },
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setV(event.target.value);
      run(event);
    },
    [run],
  );

  return <AntdInput {...others} onChange={onInputChange} value={v} />;
}
