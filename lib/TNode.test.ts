import TNode, { NodeColor } from './TNode';

import * as chai from 'chai';

const expect = chai.expect;
describe('TNode', function() {
  describe('TNode initialized as red node', function() {
    const node = new TNode<number, number>(1, 1);
    it('should be red', function() {
      expect(node.color).to.equal(NodeColor.Red);
    });
    it('should have correct key and data', function() {
      expect(node.value).to.equal(1);
      expect(node.key).to.equal(1);
    });
    it('should contain null children and parent', function() {
      expect(node.left).to.equal(null);
      expect(node.right).to.equal(null);
      expect(node.parent).to.equal(null);
    });
  });

  describe('TNode getSibling is correct', function() {
    const p = new TNode<number, number>(1, 1);
    const c1 = new TNode<number, number>(2, 2);
    const c2 = new TNode<number, number>(3, 3);
    it('should return null if parent does not exist', function() {
      expect(c1.getSibling()).to.equal(null);
    });
    it('should return null if sibling does not exist', function() {
      p.left = c1;
      c1.parent = p;
      expect(c1.getSibling()).to.equal(null);
    });
    it('should return correct sibling', function() {
      p.right = c2;
      c2.parent = p;
      expect(c1.getSibling()).to.equal(c2);
      expect(c2.getSibling()).to.equal(c1);
    });
  });

  describe('TNode getGrandparent is correct', function() {
    const g = new TNode(1, 1);
    const p = new TNode(2, 2);
    const c = new TNode(3, 3);
    it('should return null if grandparent does not exist', function() {
      expect(c.getGrandparent()).to.equal(null);
      p.left = c;
      c.parent = p;
      expect(c.getGrandparent()).to.equal(null);
    });
    it('should return correct grandparent', function() {
      g.left = p;
      p.parent = g;
      expect(c.getGrandparent()).to.equal(g);
    });
  });

  describe('TNode getUncle is correct', function() {
    const g = new TNode(1, 1);
    const p1 = new TNode(2, 2);
    const p2 = new TNode(3, 3);
    const c = new TNode(4, 4);
    it('should return null if uncle does not exist', function() {
      expect(c.getUncle()).to.equal(null);
      p1.left = c;
      c.parent = p1;
      expect(c.getUncle()).to.equal(null);
      g.left = p1;
      p1.parent = g;
      expect(c.getUncle()).to.equal(null);
    });
    it('should return correct uncle', function() {
      g.right = p2;
      p2.parent = g;
      expect(c.getUncle()).to.equal(p2);
      p1.left = null;
      c.parent = p2;
      p2.left = c;
      expect(c.getUncle()).to.equal(p1);
    });
  })
})
