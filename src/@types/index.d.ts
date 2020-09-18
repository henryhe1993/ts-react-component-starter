export interface SelectOption {
  text: string;
  value: string;
}

export interface TreeNode {
  name: string;
  id: string;
  children?: TreeNode[];
}