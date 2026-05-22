class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

function buildTree(arr) {
    if (arr.length === 0 || arr[0] === -1) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const curr = queue.shift();
        if (arr[i] !== -1) {
            curr.left = new TreeNode(arr[i]);
            queue.push(curr.left);
        }
        i++;
        if (i < arr.length && arr[i] !== -1) {
            curr.right = new TreeNode(arr[i]);
            queue.push(curr.right);
        }
        i++;
    }
    return root;
}

function levelOrder(root) {
    if (!root) return [];
    const res = [];
    const queue = [root];
    while (queue.length > 0) {
        const levelSize = queue.length;
        const level = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        res.push(level);
    }
    return res;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
if (input) {
    const arr = input.split(' ').map(Number);
    const root = buildTree(arr);
    console.log(JSON.stringify(levelOrder(root)));
} else {
    console.log("[]");
}