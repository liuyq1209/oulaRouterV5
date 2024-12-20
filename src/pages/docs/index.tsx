import React, { useState, useEffect } from 'react';
import styles from './index.less';

const Doc = (props: any) => {
  console.log('v5 docs props', props);
  const [count, setcount] = useState(1);

  return (
    <div className={styles.docBox}>
      <div>count: {count}</div>
      <button onClick={() => setcount(count + 1)}>+1</button>
    </div>
  );
};
export default Doc;
