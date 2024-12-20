import React from 'react';
import { chunk } from 'lodash-es';
import AdvancedTale from '@ht/advanced-table';
import '@ht/advanced-table/dist/esm/index.less';

const unflatten = (
  array,
  rootId = null,
  dataIndex = 'id',
  parentKey = 'parentId'
) => {
  const tree = [];
  const childrenMap = {};

  const { length } = array;
  for (let i = 0; i < length; i++) {
    const item = { ...array[i] };
    const id = item[dataIndex];
    const parentId = item[parentKey];

    if (Array.isArray(item.children)) {
      childrenMap[id] = item.children.concat(childrenMap[id] || []);
    } else if (!childrenMap[id]) {
      childrenMap[id] = [];
    }
    item.children = childrenMap[id];

    if (parentId !== undefined && parentId !== rootId) {
      if (!childrenMap[parentId]) {
        childrenMap[parentId] = [];
      }
      childrenMap[parentId].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
};

const generateColumns = (count = 10, prefix = 'column-', props = {}) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataIndex: `${prefix}${columnIndex}`,
    title: <span>{`Column ${columnIndex}`}</span>,
    width: columnIndex === 0 ? 140 : 100,
    resizable: true,
    ellipsis: true,
  }));

const generateData = (columns, count = 200, prefix = 'row-') =>
  new Array(count).fill(0).map((row, rowIndex) =>
    columns.reduce(
      (rowData, column, columnIndex) => {
        // eslint-disable-next-line no-lone-blocks
        {
          if (rowIndex < 3) {
            return {
              ...rowData,
              [column.dataIndex]: `${prefix}${rowIndex} - Col ${columnIndex}`,
            };
          }
          return {
            ...rowData,
            [column.dataIndex]: `${prefix}${rowIndex} - Col ${columnIndex}`,
          };
        }
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  );

const App = () => {
  const columns = generateColumns(51);
  const data = generateData(columns, 1000);
  const [headNode, ...restCols] = columns;
  const groupCols = chunk(restCols, 4).reduce(
    (prev, children, groupIndex) => [
      ...prev,
      {
        key: `group${groupIndex}`,
        dataIndex: `group${groupIndex}`,
        title: <span>{`Group ${groupIndex}`}</span>,
        children,
      },
    ],
    [headNode]
  );
  groupCols.at(0).fixed = 'left';
  groupCols.at(-1).fixed = 'right';

  const expandColumnKey = 'column-0';
  // add some sub items
  for (let i = 0; i < 3; i++) {
    data.push({
      ...data[0],
      id: `${data[0].id}-sub-${i}`,
      parentId: data[0].id,
      [expandColumnKey]: `Sub ${i}`,
    });
    data.push({
      ...data[2],
      id: `${data[2].id}-sub-${i}`,
      parentId: data[2].id,
      [expandColumnKey]: `Sub ${i}`,
    });
    data.push({
      ...data[2],
      id: `${data[2].id}-sub-sub-${i}`,
      parentId: `${data[2].id}-sub-${i}`,
      [expandColumnKey]: `Sub-Sub ${i}`,
    });
    data.push({
      ...data[2],
      id: `${data[2].id}-sub-sub-sub-${i}`,
      parentId: `${data[2].id}-sub-sub-${i}`,
      [expandColumnKey]: `Sub-sub-Sub ${i}`,
    });
  }
  const treeData = unflatten(data);
  const summaryData = generateData(columns, 1, 'summary-');
  return (
    <div style={{ height: 600, minWidth: 800 }}>
      <AdvancedTale
        columns={groupCols}
        dataSource={treeData}
        summaryData={summaryData}
        expandable={{
          expandColumnKey,
          defaultExpandedRowKeys: ['row-0', 'row-2'],
          showLine: true,
        }}
      />
    </div>
  );
};

export default App;
