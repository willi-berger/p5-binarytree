
/** @type Tree */
let tree;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const TREE_NODE_DIAMETER = 60;

/**
 * setup
 */
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, P2D, document.getElementById('my-canvas'));
  readValuesAndCreateTree();
}

function readValuesAndCreateTree() {
  /** @type [] */
  let values = document.getElementById('values').value.split(",");
  values = values.map(value => parseInt(value.trim()));
  console.dir(values);
  tree = new Tree();
  values.forEach((value) => 
    tree.insert(new TreeNode(0, 0, value)));
  console.dir(tree);
  tree.calculatePositions();
}

/**
 * draw
 */
function draw() {
  background(220);
  tree.nodes.forEach(item => item.show());
 
  /* places the x a y position of the mouse
  on the canvas as a coordinate pair x, y */
  fill(0)
  strokeWeight(0);
  textAlign(LEFT)
  text(`${Math.round(mouseX)}, ${Math.round(mouseY)}`, 20, 20);
}

function mouseDragged() {
    nodes.forEach(n => n.clicked(mouseX, mouseY));
}

/**
 * Class: TreeNode
 */
class TreeNode {

  radius = TREE_NODE_DIAMETER / 2;
  leftChild  = null;
  rightChild = null;
  parent     = null;
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  constructor (x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  clicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.radius) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
  
  /**
   * show
   */
  show() {
    fill(255);
    stroke(0);
    strokeWeight(2);

    if (this.rightChild) {
      line(this.x, this.y, this.rightChild.x, this.rightChild.y);
    }
    if (this.leftChild) {
      line(this.x, this.y, this.leftChild.x, this.leftChild.y);
    }
    circle(this.x, this.y, this.radius);
    fill(0)
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    text(`${this.value}`, this.x, this.y);
  }
}

/**
 * Class: Tree
 */
class Tree {
  constructor() {
    this.root = null;
    /** @type TreeNode[] */
    this.nodes = [];
  }

  /**
   * @param {TreeNode} node 
   */
  insert(node) {
    this.nodes.push(node)
    if (this.root == null) {
      this.root = node;
      return;
    }

    this.insertNode(this.root, node);
  }

  insertNode(parent, node) {
    console.debug(`p: ${parent.value} n: ${node.value}`)
    if (parent.value <= node.value) {
      if (parent.rightChild == null) {
        parent.rightChild = node;
        node.parent = parent;
        return;
      } else {
        this.insertNode(parent.rightChild, node);
      }

    } else {
      if (parent.leftChild == null) {
        parent.leftChild = node;
        node.parent = parent;
        return;
      } else {
        this.insertNode(parent.leftChild, node);
      }
    }
  }

  height() {
    let h = this._height(this.root);
    console.log(`heigt: ${h}`);
    return h;
  }

  /**
   * 
   * @param {TreeNode} root 
   */
  _height(root) {
    if (root == null) {
      return 0;
    } else {
      return 1 + Math.max(this._height(root.leftChild), this._height(root.rightChild));
    }
  }

  /**
   * 
   * @param {TreeNode} node 
   */
  walk(node, level) {
    if (node == null) {
      return;
    }
    console.log(`val: ${node.value} level ${level}`);
    this.walk(node.leftChild, level + 1);
    this.walk(node.rightChild, level + 1);
  }


  /**
   * 
   * @param {TreeNode} node 
   * @param {number} level 
   * @param {number} index 
   * @returns void
   */
  in_order(node, level, index) {

    if (node == null) {
      return;
    }

    this.in_order(node.leftChild, level + 1);
    node.posX = index * TREE_NODE_DIAMETER
    console.log(`val: ${node.value} level ${level}`);
    this.in_order(node.rightChild, level + 1);
  }

  
  
  /**
   * 
   * @param {TreeNode} node 
   * @param {number} posX 
   * @param {number} posY 
   * @param {number} levelHeight 
   * @param {number} distChildren
   */
walkAndCalcPosition(node, posX, posY, levelHeight, distChildren) {
  console.log(`${node.value}: x=${posX} y=${posY} d=${distChildren}`);
  node.x = posX;
  node.y = posY;

  if (node.leftChild != null) {
    this.walkAndCalcPosition(
      node.leftChild, 
      node.x - distChildren / 2,
      node.y + levelHeight,
      levelHeight,
      distChildren / 2
    )      
  }

  if (node.rightChild != null) {
    this.walkAndCalcPosition(
      node.rightChild, 
      node.x + distChildren / 2,
      node.y + levelHeight,
      levelHeight,
      distChildren / 2
    )      
  }

}

calculatePositions() {
  let heightOfTree = this.height();
  let levelHeight = (CANVAS_HEIGHT - 2 * TREE_NODE_DIAMETER) / (heightOfTree  - 1);
  let distChildren = heightOfTree > 2 
    ? Math.pow(2, heightOfTree - 2) * TREE_NODE_DIAMETER / 2 + 50
    : TREE_NODE_DIAMETER * 2;
  this.walkAndCalcPosition(
    this.root,
    CANVAS_WIDTH / 2, 
    TREE_NODE_DIAMETER, 
    levelHeight, 
    distChildren
  );
}
 
  calculatePositions1() {
    let heightOfTree = this.height();
    let levelHeight = (CANVAS_HEIGHT - 2 * TREE_NODE_DIAMETER) / (heightOfTree  - 1);
    let distChildren = heightOfTree > 2 
      ? Math.pow(2, heightOfTree - 2) * TREE_NODE_DIAMETER / 2 + 50
      : TREE_NODE_DIAMETER * 2;

    /**
     * @param {TreeNode} node 
     * @param {number} level 
     * @param {number} index 
     * @returns 
     */
    let in_order = function(node, level) {

      if (node == null) {
        return;
      }
  
      in_order(node.leftChild, level + 1);
      console.log(`val: ${node.value} level ${level}`);
      node.x = (index + 1) * TREE_NODE_DIAMETER / 2;
      node.y = TREE_NODE_DIAMETER + levelHeight * level;
      index++;
      in_order(node.rightChild, level + 1);
    }

    let index = 0;
    in_order(this.root, 0);
  }
}

function onBtnUpateClicked() {
  console.debug('onBtnUpateClicked');
  readValuesAndCreateTree();
}