import React from 'react';
import logo from '../../assets/logo.svg';
import styles from './index.less';

type LogoAreaProps = {
  collapsed: boolean;
};
const LogoArea: React.FC<LogoAreaProps> = ({ collapsed }) => (
  <div className={styles.logoArea}>
    <img src={logo} alt="logo" />
    {collapsed ? null : 'LogoArea'}
  </div>
);

export default LogoArea;
