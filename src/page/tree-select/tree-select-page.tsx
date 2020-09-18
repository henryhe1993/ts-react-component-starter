import React from 'react';
import { TreeNode } from '../../@types/index';
import TreeSelect from '../../components/tree-select/tree-select';

const tree: TreeNode[] = [
  {id: uuidv4(), name: '0', children: []},
  {id: uuidv4(), name: '1', children: []},
  {id: uuidv4(), name: '2', children: []}
];

for (let i = 0; i < tree.length; i++) {
  insertNodeAt(tree[i])
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function insertNodeAt(parent: TreeNode) {
  for (let i = 0; i < 10; i++) {
    const node = {
      id: uuidv4(), 
      name: `${parent.name}-${i}`, 
      children: []
    };
    for (let j = 0; j < 10; j++) {
      node.children.push({
        id: uuidv4(), 
        name: `${node.name}-${j}`, 
        children: []
      })
    }
    parent.children.push(node);
  } 
}

// insertNode();
// for (let i = 0; i < tree.length; i++) {
//   current = tree[i].children;
//   insertNode(current)
// }


export default function() {

  return (
    <TreeSelect tree={tree}
      value={[]}
      onOk={() => {}}
      onDismiss={() => {}}
    />
  )
}