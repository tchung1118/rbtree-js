import TNode, { NodeColor } from './TNode';

export enum KeyMode {
  // static key mode uses node's key property to insert/search
  Static = 1,
  // dynamic key mode evaluates node's keyFunc at insertion/search time
  Dynamic
}

class RBTree<K, V> {
  root: TNode<K, V> | null = null;
  keyMode: KeyMode;

  constructor(keyMode?: KeyMode) {
    this.keyMode = keyMode || KeyMode.Static;
  }

  insert(value: V, key: K | null = null, keyFunc?: (value: V | null) => K) {
    switch (this.keyMode) {
      case KeyMode.Static:
        if (key === null) {
          throw new Error("TNode with key = null cannot be inserted when using static key mode");
        }
        break;
      case KeyMode.Dynamic:
        if (keyFunc === undefined) {
          throw new Error("TNode with keyFunc = null cannot be inserted when using dynamic key mode");
        }
    }
    const node = new TNode(value, key, keyFunc);
    const nodeKey = this.keyMode === KeyMode.Static ? node.key : (node.keyFunc && node.keyFunc(node.value)) || null;
    if (nodeKey !== null) {
      this.insertRec(this.root, node, nodeKey);
    }

    if (node.parent !== null && node.parent.color !== NodeColor.Black) {
      // fix if node is not root AND node's parent is not black

    }
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
    const currentKey = this.keyMode === KeyMode.Static ? current.key : (current.keyFunc && current.keyFunc(current.value)) || null;
    if (currentKey === null) {
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
      
    }
  }
}

export default RBTree;