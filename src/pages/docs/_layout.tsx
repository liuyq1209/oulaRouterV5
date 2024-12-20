import React, { useState, useEffect } from 'react';

interface Props {}

const Layout: React.FC<Props> = (props) => {
  return (
    <div>
      嵌套路由layout
      {props.children}
    </div>
  );
};
export default Layout;
