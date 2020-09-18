import React from 'react';
import { Props } from '../../@types/tree-select';
import { TreeNode } from '../../@types/index';
import styles from './tree-select.module.scss';
import TreeBackImage from './images/tree-back.png';

export default class extends React.Component<Props> {
  rootRef: HTMLDivElement;
  scrollRef: HTMLDivElement;
  startY: number = 0;
  originalScrollTop: number;

  originalValues: string[] = [];
  state = {
    value: [],
    key: [],
    currentLevel: 1,
    selectedNodes: [] as TreeNode[],
    checkedNodes: [] as TreeNode[],
  }
  
  componentDidMount() {
    document.body.style.overflow = 'hidden';
    this.rootRef.addEventListener('touchmove', this.preventScroll);
    this.scrollRef.addEventListener('touchstart', this.handleTouchStart);
    this.scrollRef.addEventListener('touchmove', this.handleTouchMove);

    this.originalValues = JSON.parse(JSON.stringify(this.props.value));

    const checkedNodes = [];
    let treeSection = this.props.tree;
    for (let i = 0; i < this.props.value.length; i++) {
      for (let j = 0; j < treeSection.length; j++) {
        if (this.props.value[i] === treeSection[j].id) {
          checkedNodes.push(treeSection[j]);
          treeSection = treeSection[j].children;
          break
        }
      }
    }


    this.setState({
      checkedNodes,
      value: JSON.parse(JSON.stringify(this.props.value))
    })
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
    this.rootRef.removeEventListener('touchmove', this.preventScroll);
    this.scrollRef.removeEventListener('touchstart', this.handleTouchStart);
    this.scrollRef.removeEventListener('touchmove', this.handleTouchMove)
  }

  render() {
    const { tree } = this.props;
    const { selectedNodes, value } = this.state;
    const currentNode = selectedNodes[selectedNodes.length - 1];

    const displayNodes = 
      Array.isArray(selectedNodes) && selectedNodes.length ? currentNode.children : tree;

    const displayTitle = 
      Array.isArray(selectedNodes) && selectedNodes.length ? currentNode.name : '工厂模型';

    return (
      <div className={styles["modal"]} ref={ref => this.rootRef = ref}>
        <div className={styles["tree-container"]}>
          <div className={styles["tree-header"]}>
            <div className={styles["title"]}>{displayTitle}</div>
            {selectedNodes.length > 0 && (
              <img src={TreeBackImage} className={styles["back-btn"]} onClick={this.handleBack} />
            )}
          </div>
          
          <div className={styles["tree-node-container"]} ref={ref => this.scrollRef = ref}>
            {displayNodes.map(node => (
              <div key={node.id} className={styles["tree-node"]}>
                <div className={styles["tree-node-check-container"]} onClick={() => this.handleChange(node)}>
                  <div className={`
                    ${styles["tree-node-check"]}
                    ${node.id === value[selectedNodes.length] && styles["check"]}
                  `}/>
                </div>
                
                <div className={styles["tree-node-text"]}
                  data-next={Array.isArray(node.children) && node.children.length > 0}
                  onClick={() => this.handleNextNode(node)}
                >
                  {node.name}
                </div>
              </div>
            ))}
          </div>

          <div className={styles["tree-footer"]}>
            <div className={styles["cancel"]} onClick={this.handleCancel}>取消</div>
            <div className={styles["confirm"]} 
              onClick={this.handleOK}
              data-disabled={!value.length}
            >
              确定
            </div>
          </div>
        </div>
      </div>
    )
  }

  preventScroll = e => {
    e.preventDefault();
  }
  
  handleTouchStart = (e) => {
    if (e.touches.length > 1) return;
    this.startY = e.targetTouches[0].clientY;
    this.originalScrollTop = this.scrollRef.scrollTop;
  }

  handleTouchMove = (e) => {
    if (e.touches.length > 1) return;
    this.scrollRef.scrollTop = this.originalScrollTop - e.targetTouches[0].clientY + this.startY;;
  }

  handleNextNode = (node: TreeNode) => {
    if (!Array.isArray(node.children) || !node.children.length) return;

    this.setState({
      selectedNodes: [...this.state.selectedNodes, node]
    })
  }

  handleBack = () => {
    if (this.state.selectedNodes.length === 0) return;
    this.state.selectedNodes.pop();
    this.forceUpdate(); 
  }

 
  handleChange = (node: TreeNode) => {
    const checkedNodes = [...this.state.selectedNodes, node];
    // this.props.onChange(checkedNodes);
    this.setState({ value: checkedNodes.map(n => n.id), checkedNodes })
  }
  

  handleOK = () => {
    if (!this.state.value.length) return;
    this.props.onOk(this.state.checkedNodes);
  }

  handleCancel = () => {
    this.props.onDismiss();
  }
}