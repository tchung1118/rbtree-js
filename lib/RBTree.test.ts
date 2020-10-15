import RBTree, { KeyMode } from './RBTree';

import * as chai from 'chai';
import { NodeColor } from './TNode';

const expect = chai.expect;
describe('RBTree', function() {
  describe('Root is initialized as null', function() {
    const tree = new RBTree<number, number>(KeyMode.Static);
    it('root should be null', function() {
      expect(tree.root).to.equal(null);
    });
  });
  
  describe('first inserted node is root', function() {
    const tree = new RBTree<number, number>(KeyMode.Static);
    tree.insert(5, 5);
    it('root is not null', function() {
      expect(tree.root).to.not.equal(null);
      if (tree.root !== null) {
        expect(tree.root.value).to.equal(5);
      }
    });
    it('root is black', function() {
      if (tree.root !== null) {
        expect(tree.root.color).to.equal(NodeColor.Black);
      }
    })
  });
});
