import { Button } from '@ht/sprite-ui';
import React, { useState, useEffect } from 'react';
import { Link } from '@oula/oula';

const index = (props: any) => {
  return (
    <div>
      嵌套路由/docs/a
      <Link to="/docs">跳转到上级</Link>
    </div>
  );
};
export default index;
