import RBTree, { KeyMode } from './RBTree';

import * as chai from 'chai';
import TNode, { NodeColor } from './TNode';

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

  describe('inserts do not violate invariants', function() {
    it('empty tree does not violate invariants', function() {
      const tree = new RBTree<number, number>(KeyMode.Static);
      expect(tree.testInvariants()).to.equal(true);
    });
    it('inserting [5, 4, 3, 2, 1] does not violate invariants', function() {
      const tree = new RBTree<number, number>(KeyMode.Static);
      for (let i = 5; i >= 1; i--) {
        tree.insert(i, i);
        expect(tree.testInvariants()).to.equal(true);
      }
    });
    it('inserting [1, 2, 3, 4, 5] does not violate invariants', function() {
      const tree = new RBTree<number, number>(KeyMode.Static);
      for (let i = 1; i <= 5; i++) {
        tree.insert(i, i);
        expect(tree.testInvariants()).to.equal(true);
      }
    });
    it('inserting [1, 2, ... 16] does not violate invariants', function() {
      const tree = new RBTree<number, number>(KeyMode.Static);
      for (let i = 1; i <= 16; i++) {
        tree.insert(i, i);
        expect(tree.testInvariants()).to.equal(true);
      }
    });

    it('inserting [1, 2, ... 16] does not violate invariants (dynamic key mode)', function() {
      const tree = new RBTree<number, number>(KeyMode.Dynamic);
      for (let i = 1; i <= 16; i++) {
        tree.insert(i, null, (val) => val);
        expect(tree.testInvariants()).to.equal(true);
      }
    });
  })
});
