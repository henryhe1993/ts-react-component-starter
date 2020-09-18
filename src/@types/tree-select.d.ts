import React from 'react';

export { TreeNode } from './index';

export interface Props {
  tree: TreeNode[];
  value: string[];
  onOk(val: TreeNode[]): void;
  onDismiss(): void;
}
export default class extends React.Component<Props> {

}