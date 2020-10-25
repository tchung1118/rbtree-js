import TNode, { NodeColor } from './TNode';

export enum KeyMode {
  // static key mode uses node's key property to insert/search
  Static = 1,
  // dynamic key mode evaluates node's keyFunc at insertion/search time
  // user should make sure the overall order doesn't switch between insertion and search
  Dynamic
}

class RBTree<K, V> {
  root: TNode<K, V> | null = null;
  keyMode: KeyMode;

  constructor(keyMode?: KeyMode) {
    this.keyMode = keyMode || KeyMode.Static;
  }

  insert(value: V, key: K | null = null, keyFunc?: (value: V) => K): TNode<K, V> {
    switch (this.keyMode) {
      case KeyMode.Static:
        if (key === null) {
          throw new Error("TNode with key = null cannot be inserted when using static key mode");
        }
        break;
      case KeyMode.Dynamic:
        if (keyFunc === undefined) {
          throw new Error("TNode with keyFunc = undefined cannot be inserted when using dynamic key mode");
        }
    }
    const node = new TNode(value, key, keyFunc);
    const nodeKey = this.keyMode === KeyMode.Static ? node.key : (node.keyFunc && node.keyFunc(node.value));
    if (nodeKey !== null && nodeKey !== undefined) {
      this.insertRec(this.root, node, nodeKey);
    }

    if (node.parent !== null && node.parent.color !== NodeColor.Black) {
      // fix if node is not root AND node's parent is not black
      this.insertFixUp(node);
    }
    return node;
  }

  private insertRec(current: TNode<K, V> | null, node: TNode<K, V>, nodeKey: K, parent: TNode<K, V> | null = null): TNode<K, V> {
    if (current === null) {
      node.parent = parent;
      // no parent, must be root
      if (parent === null) {
        this.root = node;
        this.root.color = NodeColor.Black; // root should be black
      }
      return node;
    }
    const currentKey = this.keyMode === KeyMode.Static ? current.key : (current.keyFunc && current.keyFunc(current.value));
    if (currentKey === null || currentKey === undefined) {
      // just give up
      return node;
    }
    if (nodeKey < currentKey) {
      current.left = this.insertRec(current.left, node, nodeKey, current);
    } else if (nodeKey > currentKey) {
      current.right = this.insertRec(current.right, node, nodeKey, current);
    }
    return current;
  }

  private insertFixUp(node: TNode<K, V>) {
    if (node === null) return;

    if (node === this.root && node.color === NodeColor.Red) {
      node.color = NodeColor.Black;
      return;
    }

    const u = node.getUncle();
    const p = node.parent;
    const g = node.getGrandparent();
    if (node.color === NodeColor.Red && p && p.color === NodeColor.Red) {
      const uColor = u !== null ? u.color : NodeColor.Black;
      if (uColor === NodeColor.Red) {
        if (!!p) { p.color = NodeColor.Black; }
        if (!!u) { u.color = NodeColor.Black; }
        if (!!g) {
          g.color = NodeColor.Red;
          this.insertFixUp(g);
          return;
        }
      } else if (uColor === NodeColor.Black) {
        // four cases
        // i) left-left case
        if (p && p.left === node && g && g.left === p) {
          const newG = g.rotateRight();
          const gColor = g.color;
          g.color = p.color;
          p.color = gColor;
          if (newG.parent === null) {
            this.root = newG;
          }
          return;
        }
        // ii) left-right case
        if (p && p.right === node && g && g.left === p) {
          p.rotateLeft();
          this.insertFixUp(p);
          return;
        }
        // iii) right-right case
        if (p && p.right === node && g && g.right === p) {
          const newG = g.rotateLeft();
          const gColor = g.color;
          g.color = p.color;
          p.color = gColor;
          if (newG.parent === null) {
            this.root = newG;
          }
          return;
        }
        // iv) right-left case
        if (p && p.left === node && g && g.right === p) {
          p.rotateRight();
          this.insertFixUp(p);
          return;
        }
      }
    }
  }

  testInvariants(): boolean {
    // test this tree's red-black tree invariants. return true if no violation exists, false if it fails
    const ioInv = this.testInOrder();
    if (!ioInv) console.log('inorder invaraince violated');
    const bkInv = this.testBookkeeping();
    if (!bkInv) console.log('bookkeeping invariance violated');
    const balInv = this.testBalance();
    if (!balInv) console.log('balance invariance violated');
    return ioInv && bkInv && balInv;
  }

  private testInOrder(): boolean {
    // test in-order invariant
    if (this.root === null) {
      // empty tree doesn't need testing
      return true;
    }
    const inorderKeys: (K | null | undefined)[] = [];
    const reduceInorder = (node: TNode<K, V> | null) => {
      if (node === null) {
        return;
      }
      reduceInorder(node.left);
      const nodeKey = this.keyMode === KeyMode.Static ? node.key : (node.keyFunc && node.keyFunc(node.value));
      inorderKeys.push(nodeKey);
      reduceInorder(node.right);
    }

    reduceInorder(this.root);

    for (let i = 0; i < inorderKeys.length - 1; i++) {
      const prevKey = inorderKeys[i];
      const nextKey = inorderKeys[i+1];
      if (prevKey !== null && prevKey !== undefined && nextKey !== null && nextKey !== undefined && nextKey < prevKey) {
        return false;
      } else if (prevKey === null || nextKey === null || prevKey === undefined || nextKey === undefined) {
        return false;
      }
    }
    return true;
  }

  private testBookkeeping(): boolean {
    // test bookkeeping invariant (all paths through the tree contain the same number of black nodes)
    if (this.root === null) {
      // empty tree doesn't need testing
      return true;
    }
    let recordedNumBlackNodes: number[] = [];
    let currentBlackN = 0;
    
    const inspectAllPaths = (node: TNode<K, V> | null) => {
      if (node === null) {
        // record number of black nodes traversed so far
        recordedNumBlackNodes.push(currentBlackN);
        return;
      }
      if (node.color === NodeColor.Black) {
        currentBlackN += 1;
        inspectAllPaths(node.left);
        inspectAllPaths(node.right);
        currentBlackN -= 1;
      } else {
        inspectAllPaths(node.left);
        inspectAllPaths(node.right);
      }
    }
    inspectAllPaths(this.root);
    // recordedNumBlackNodes should contain all same numbers
    const testN = recordedNumBlackNodes[0];
    for (let i = 0; i < recordedNumBlackNodes.length; i++) {
      if (testN !== recordedNumBlackNodes[i]) {
        return false;
      }
    }
    return true;
  }

  private testBalance(): boolean {
    // test balance invariant (no red nodes have red parents)
    if (this.root === null) {
      // empty tree doesn't need testing
      return true;
    }
    return this.testBalanceRec(this.root);
  }

  private testBalanceRec(node: TNode<K, V> | null): boolean {
    if (node === null) {
      // sub-tree is empty, no need to test
      return true;
    }
    if (node.color === NodeColor.Black) {
      return this.testBalanceRec(node.left) && this.testBalanceRec(node.right);
    } else if (node.color === NodeColor.Red && node.parent !== null) {
      return (node.parent.color !== NodeColor.Red) && this.testBalanceRec(node.left) && this.testBalanceRec(node.right);
    }
    // this only happens if the root is colored red, which violates the invariant
    return false;
  }

  findMin(root: TNode<K, V>) {
    // given a non-empty binary search tree, return the node with minimum key value found in that tree
    let current = root;
    while (current && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  findPredSucc(key: K) {

  }

  delete(node: TNode<K, V>) {
  }
}

export default RBTree;