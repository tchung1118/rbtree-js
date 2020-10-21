
export enum NodeColor {
  Red = 0,
  Black
}

class TNode<K, V> {
  color: number = NodeColor.Red;
  key: K | null = null;
  keyFunc?: (value: V) => K;
  parent: TNode<K, V> | null = null;
  left: TNode<K, V> | null = null;
  right: TNode<K, V> | null = null;
  value: V;

  constructor(value: V, key: K | null, keyFunc?: (value: V) => K) {
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

  rotateRight(): TNode<K, V> {
    const newPivot = this.left;
    if (newPivot) {
      // perform rotation and return newPivot
      const oldRightChild = newPivot.right;
      // make new old pivot's parent newPivot's parent
      newPivot.parent = this.parent;
      if (this.parent && this.parent.left === this) {
        this.parent.left = newPivot;
      } else if (this.parent && this.parent.right === this) {
        this.parent.right = newPivot;
      }
      // make old pivot the right child of newPivot
      newPivot.right = this;
      this.parent = newPivot;
      // make newPivot's oldRightChild the left child of old pivot
      this.left = oldRightChild;
      if (oldRightChild) {
        oldRightChild.parent = this;
      }
      return newPivot;
    }
    // can't perform right rotation if left child is null
    return this;
  }

  rotateLeft(): TNode<K, V> {
    const newPivot = this.right;
    if (newPivot) {
      // perform rotation and return newPivot
      const oldLeftChild = newPivot.left;
      // make new old pivot's parent newPivot's parent
      newPivot.parent = this.parent;
      if (this.parent && this.parent.left === this) {
        this.parent.left = newPivot;
      } else if (this.parent && this.parent.right === this) {
        this.parent.right = newPivot;
      }
      // make old pivot the left child of newPivot
      newPivot.left = this;
      this.parent = newPivot;
      // make newPivot's oldLeftChild the right child of old pivot
      this.right = oldLeftChild;
      if (oldLeftChild) {
        oldLeftChild.parent = this;
      }
      return newPivot;
    }
    // can't perform left rotation if right child is null
    return this;
  }
}

export default TNode;