import React from 'react';
import { Spin } from '@ht/sprite-ui';
import type { SpinProps } from '@ht/sprite-ui';

const PageLoading: React.FC<SpinProps & any> = ({
  isLoading,
  pastDelay,
  timedOut,
  error,
  retry,
  ...reset
}) => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <Spin size="large" {...reset} />
  </div>
);

export default PageLoading;
