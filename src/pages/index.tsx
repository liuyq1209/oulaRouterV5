import { history } from '@oula/oula';
import React, { useState, useEffect } from 'react';

interface Props {}

const Index: React.FC<Props> = (props) => {
  useEffect(() => {
    history.push('/docs');
  }, []);

  return <>default</>;
};
export default Index;
