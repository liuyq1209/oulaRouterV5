import React from 'react';
import { Inspector } from 'react-dev-inspector';

const InspectorWrapper =
  process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const Layout: React.FC = ({ children }) => (
  <InspectorWrapper>{children}</InspectorWrapper>
);

export default Layout;
