
enum NodeColor {
  Red = 0,
  Black
};

class TNode<T> {
  color: number = NodeColor.Red;
  parent: TNode<T> | null = null;
  left: TNode<T> | null = null;
  right: TNode<T> | null = null;
  data: T | null = null;
}

export default TNode;