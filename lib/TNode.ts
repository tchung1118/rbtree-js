
export enum NodeColor {
  Red = 0,
  Black
}

class TNode<K, V> {
  color: number = NodeColor.Red;
  key: K | null = null;
  keyFunc?: (value: V | null) => K;
  parent: TNode<K, V> | null = null;
  left: TNode<K, V> | null = null;
  right: TNode<K, V> | null = null;
  value: V | null = null;

  constructor(value: V | null, key: K | null, keyFunc?: (value: V | null) => K) {
    this.value = value;
    this.key = key;
    this.keyFunc = keyFunc;
  }

  getGrandparent(): TNode<K, V> | null {
    return this.parent && this.parent.parent;
  }

  getSibling(): TNode<K, V> | null {
    if (this.parent === null) {
      return null;
    }
    if (this.parent.left == this) {
      return this.parent.right;
    } else {
      return this.parent.left;
    }
  }

  getUncle(): TNode<K, V> | null {
    if (this.parent === null) {
      return null;
    }
    return this.parent.getSibling();
  }
}

export default TNode;