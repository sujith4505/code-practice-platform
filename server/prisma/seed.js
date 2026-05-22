const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const problems = [
  {
    title: "Two Sum",
    difficulty: "EASY",
    topic: "Hashing",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: "- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9\n- Only one valid answer exists.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "[0,1]", isSample: true },
      { input: "3\n3 2 4\n6", expectedOutput: "[1,2]", isSample: true },
      { input: "2\n3 3\n6", expectedOutput: "[0,1]", isSample: false }
    ],
    codeTemplates: {
      javascript: `// Javascript Template
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
            return [map.get(diff), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (input.length >= 3) {
    const n = parseInt(input[0]);
    const nums = input[1].trim().split(' ').map(Number);
    const target = parseInt(input[2]);
    const res = twoSum(nums, target);
    console.log(JSON.stringify(res));
}`,
      python: `import sys
import json

def twoSum(nums, target):
    # Write your logic here
    seen = {}
    for i, num in enumerate(nums):
        remaining = target - num
        if remaining in seen:
            return [seen[remaining], i]
        seen[num] = i
    return []

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 3:
        n = int(lines[0])
        nums = list(map(int, lines[1].split()))
        target = int(lines[2])
        res = twoSum(nums, target)
        print(json.dumps(res))

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    int n, target;
    if (cin >> n) {
        vector<int> nums(n);
        for (int i = 0; i < n; ++i) {
            cin >> nums[i];
        }
        cin >> target;
        vector<int> ans = twoSum(nums, target);
        cout << "[" << ans[0] << "," << ans[1] << "]" << endl;
    }
    return 0;
}`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = sc.nextInt();
            }
            int target = sc.nextInt();
            int[] ans = twoSum(nums, target);
            System.out.println("[" + ans[0] + "," + ans[1] + "]");
        }
    }
}`
    },
    referenceSolutions: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen: return [seen[diff], i]
        seen[num] = i
    return []`
    }
  },
  {
    title: "Reverse String",
    difficulty: "EASY",
    topic: "Strings",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    constraints: "- 1 <= s.length <= 10^5\n- `s[i]` is a printable ascii character.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      }
    ],
    testCases: [
      { input: "h e l l o", expectedOutput: '["o","l","l","e","h"]', isSample: true },
      { input: "H a n n a h", expectedOutput: '["h","a","n","n","a","H"]', isSample: true }
    ],
    codeTemplates: {
      javascript: `function reverseString(s) {
    let left = 0, right = s.length - 1;
    while (left < right) {
        let temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        left++;
        right--;
    }
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
if (input) {
    const s = input.split(' ');
    reverseString(s);
    console.log(JSON.stringify(s));
}`,
      python: `import sys
import json

def reverseString(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1

def main():
    line = sys.stdin.read().strip()
    if line:
        s = line.split()
        reverseString(s)
        print(json.dumps(s))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      javascript: `function reverseString(s) {
    s.reverse();
}`,
      python: `def reverseString(s):
    s.reverse()`
    }
  },
  {
    title: "Valid Parentheses",
    difficulty: "EASY",
    topic: "Stack",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: "- 1 <= s.length <= 10^4\n- `s` consists of parentheses only.",
    examples: [
      { input: "s = \"()\"", output: "true" },
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    testCases: [
      { input: "()", expectedOutput: "true", isSample: true },
      { input: "()[]{}", expectedOutput: "true", isSample: true },
      { input: "(]", expectedOutput: "false", isSample: true },
      { input: "([)]", expectedOutput: "false", isSample: false }
    ],
    codeTemplates: {
      javascript: `function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (let char of s) {
        if (char in map) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
console.log(isValid(input).toString());`,
      python: `import sys

def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

def main():
    s = sys.stdin.read().strip()
    print(str(isValid(s)).lower())

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      javascript: `function isValid(s) {
    const stack = [];
    for(let c of s) {
        if(c==='(') stack.push(')');
        else if(c==='{') stack.push('}');
        else if(c==='[') stack.push(']');
        else if(stack.length === 0 || stack.pop() !== c) return false;
    }
    return stack.length === 0;
}`,
      python: `def isValid(s):
    stack = []
    for c in s:
        if c == '(': stack.append(')')
        elif c == '{': stack.append('}')
        elif c == '[': stack.append(']')
        elif not stack or stack.pop() != c: return False
    return not stack`
    }
  },
  {
    title: "SQL: Employees Earning More Than Managers",
    difficulty: "EASY",
    topic: "SQL",
    description: "Write a solution to find the employees who earn more than their managers.\n\nTable: `Employee`\n- `id` (int, primary key)\n- `name` (varchar)\n- `salary` (int)\n- `managerId` (int, foreign key referencing Employee.id)",
    constraints: "All salaries are positive integers.",
    examples: [
      {
        input: "Employee table:\n+----+-------+--------+-----------+\n| id | name  | salary | managerId |\n+----+-------+--------+-----------+\n| 1  | Joe   | 70000  | 3         |\n| 2  | Henry | 80000  | 4         |\n| 3  | Sam   | 60000  | Null      |\n| 4  | Max   | 90000  | Null      |\n+----+-------+--------+-----------+",
        output: "Joe earns more than his manager Sam."
      }
    ],
    testCases: [
      {
        input: `CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, managerId INT);
INSERT INTO Employee VALUES (1, 'Joe', 70000, 3);
INSERT INTO Employee VALUES (2, 'Henry', 80000, 4);
INSERT INTO Employee VALUES (3, 'Sam', 60000, NULL);
INSERT INTO Employee VALUES (4, 'Max', 90000, NULL);`,
        expectedOutput: "Joe",
        isSample: true
      }
    ],
    codeTemplates: {
      sql: `-- Write your SQL query here
SELECT e1.name AS Employee
FROM Employee e1
JOIN Employee e2 ON e1.managerId = e2.id
WHERE e1.salary > e2.salary;`
    },
    referenceSolutions: {
      sql: `SELECT a.name AS Employee FROM Employee a, Employee b WHERE a.managerId = b.id AND a.salary > b.salary;`
    }
  },
  {
    title: "SQL: Second Highest Salary",
    difficulty: "MEDIUM",
    topic: "SQL",
    description: "Write a solution to find the second highest salary from the `Employee` table. If there is no second highest salary, return `null`.\n\nTable: `Employee`\n- `id` (int, primary key)\n- `salary` (int)",
    constraints: "Salary table can have duplicate or single entries.",
    examples: [
      {
        input: "Employee table:\n| id | salary |\n| 1  | 100    |\n| 2  | 200    |\n| 3  | 300    |",
        output: "200"
      }
    ],
    testCases: [
      {
        input: `CREATE TABLE Employee (id INT PRIMARY KEY, salary INT);
INSERT INTO Employee VALUES (1, 100);
INSERT INTO Employee VALUES (2, 200);
INSERT INTO Employee VALUES (3, 300);`,
        expectedOutput: "200",
        isSample: true
      },
      {
        input: `CREATE TABLE Employee (id INT PRIMARY KEY, salary INT);
INSERT INTO Employee VALUES (1, 100);`,
        expectedOutput: "null",
        isSample: false
      }
    ],
    codeTemplates: {
      sql: `-- Write your SQL query here
SELECT (
    SELECT DISTINCT salary 
    FROM Employee 
    ORDER BY salary DESC 
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`
    },
    referenceSolutions: {
      sql: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`
    }
  },
  {
    title: "Merge Sorted Arrays",
    difficulty: "EASY",
    topic: "Arrays",
    description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order in-place inside `nums1`.",
    constraints: "- nums1.length == m + n\n- nums2.length == n\n- 0 <= m, n <= 200",
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]"
      }
    ],
    testCases: [
      { input: "3 3\n1 2 3 0 0 0\n2 5 6", expectedOutput: "[1,2,2,3,5,6]", isSample: true }
    ],
    codeTemplates: {
      javascript: `function merge(nums1, m, nums2, n) {
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 3) {
    const [m, n] = lines[0].split(' ').map(Number);
    const nums1 = lines[1].trim().split(' ').map(Number);
    const nums2 = lines[2].trim().split(' ').map(Number);
    merge(nums1, m, nums2, n);
    console.log(JSON.stringify(nums1));
}`,
      python: `import sys
import json

def merge(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 3:
        m, n = map(int, lines[0].split())
        nums1 = list(map(int, lines[1].split()))
        nums2 = list(map(int, lines[2].split()))
        merge(nums1, m, nums2, n)
        print(json.dumps(nums1))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      javascript: `function merge(nums1, m, nums2, n) {
    let idx1 = m-1, idx2 = n-1, ptr = m+n-1;
    while(idx2 >= 0) {
        if(idx1 >= 0 && nums1[idx1] > nums2[idx2]) nums1[ptr--] = nums1[idx1--];
        else nums1[ptr--] = nums2[idx2--];
    }
}`
    }
  },
  {
    title: "Binary Tree Inorder Traversal",
    difficulty: "EASY",
    topic: "Trees",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.\n\nInput representation: Tree represented as a space-separated level-order array where -1 represents NULL/None.",
    constraints: "- The number of nodes in the tree is in the range [0, 100].\n- -100 <= Node.val <= 100",
    examples: [
      { input: "root = [1,-1,2,3]", output: "[1,3,2]" }
    ],
    testCases: [
      { input: "1 -1 2 3", expectedOutput: "[1,3,2]", isSample: true },
      { input: "1 2 3 4 5 -1 -1", expectedOutput: "[4,2,5,1,3]", isSample: true }
    ],
    codeTemplates: {
      javascript: `class TreeNode {
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

function inorderTraversal(root) {
    const res = [];
    function traverse(node) {
        if (!node) return;
        traverse(node.left);
        res.push(node.val);
        traverse(node.right);
    }
    traverse(root);
    return res;
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
if (input) {
    const arr = input.split(' ').map(Number);
    const root = buildTree(arr);
    console.log(JSON.stringify(inorderTraversal(root)));
} else {
    console.log("[]");
}`,
      python: `import sys
import json

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr or arr[0] == -1: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        curr = queue.pop(0)
        if arr[i] != -1:
            curr.left = TreeNode(arr[i])
            queue.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != -1:
            curr.right = TreeNode(arr[i])
            queue.append(curr.right)
        i += 1
    return root

def inorderTraversal(root):
    res = []
    def traverse(node):
        if not node: return
        traverse(node.left)
        res.append(node.val)
        traverse(node.right)
    traverse(root)
    return res

def main():
    line = sys.stdin.read().strip()
    if line:
        arr = list(map(int, line.split()))
        root = buildTree(arr)
        print(json.dumps(inorderTraversal(root)))
    else:
        print("[]")

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def inorderTraversal(root):
    res = []
    def solve(r):
        if r:
            solve(r.left)
            res.append(r.val)
            solve(r.right)
    solve(root)
    return res`
    }
  },
  {
    title: "Graph BFS: Find Path",
    difficulty: "MEDIUM",
    topic: "Graphs",
    description: "Given an undirected graph with `n` vertices, represented as edges. Determine if a path exists between a `source` vertex and a `destination` vertex.\n\nInput input template:\nLine 1: N (number of vertices), E (number of edges)\nNext E lines: edges details (u v)\nLast Line: source destination",
    constraints: "- 1 <= n <= 10^4\n- 0 <= edges.length <= 2 * 10^4",
    examples: [
      {
        input: "3 3\n0 1\n1 2\n2 0\n0 2",
        output: "true"
      }
    ],
    testCases: [
      { input: "3 3\n0 1\n1 2\n2 0\n0 2", expectedOutput: "true", isSample: true },
      { input: "6 5\n0 1\n0 2\n3 5\n5 4\n4 3\n0 5", expectedOutput: "false", isSample: true }
    ],
    codeTemplates: {
      javascript: `function validPath(n, edges, source, destination) {
    const adj = Array.from({ length: n }, () => []);
    for (let [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }
    const visited = new Set();
    const queue = [source];
    visited.add(source);
    while (queue.length > 0) {
        const curr = queue.shift();
        if (curr === destination) return true;
        for (let neighbor of adj[curr]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    return false;
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length > 0) {
    const [n, e] = lines[0].split(' ').map(Number);
    const edges = [];
    for (let i = 1; i <= e; i++) {
        edges.push(lines[i].trim().split(' ').map(Number));
    }
    const [source, destination] = lines[e + 1].split(' ').map(Number);
    console.log(validPath(n, edges, source, destination).toString());
}`,
      python: `import sys

def validPath(n, edges, source, destination):
    adj = {i: [] for i in range(n)}
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = {source}
    queue = [source]
    while queue:
        curr = queue.pop(0)
        if curr == destination: return True
        for neighbor in adj[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return False

def main():
    lines = sys.stdin.read().splitlines()
    if lines:
        n, e = map(int, lines[0].split())
        edges = []
        for i in range(1, e + 1):
            edges.append(list(map(int, lines[i].split())))
        source, destination = map(int, lines[e + 1].split())
        print(str(validPath(n, edges, source, destination)).lower())

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def validPath(n, edges, source, destination):
    parent = list(range(n))
    def find(i):
        if parent[i] == i: return i
        parent[i] = find(parent[i])
        return parent[i]
    def union(i, j):
        rootI = find(i)
        rootJ = find(j)
        if rootI != rootJ: parent[rootI] = rootJ
    for u, v in edges: union(u, v)
    return find(source) == find(destination)`
    }
  },
  {
    title: "Fibonacci Number",
    difficulty: "EASY",
    topic: "Recursion",
    description: "The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven `n`, calculate `F(n)`.",
    constraints: "0 <= n <= 30",
    examples: [
      { input: "n = 2", output: "1" },
      { input: "n = 4", output: "3" }
    ],
    testCases: [
      { input: "2", expectedOutput: "1", isSample: true },
      { input: "4", expectedOutput: "3", isSample: true },
      { input: "10", expectedOutput: "55", isSample: false }
    ],
    codeTemplates: {
      javascript: `function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
console.log(fib(parseInt(input)).toString());`,
      python: `import sys

def fib(n):
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)

def main():
    val = int(sys.stdin.read().strip())
    print(fib(val))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)`
    }
  },
  {
    title: "Longest Common Subsequence",
    difficulty: "MEDIUM",
    topic: "DP",
    description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
    constraints: "- 1 <= text1.length, text2.length <= 1000\n- `text1` and `text2` consist of lowercase English characters.",
    examples: [
      { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3" }
    ],
    testCases: [
      { input: "abcde\nace", expectedOutput: "3", isSample: true },
      { input: "abc\nabc", expectedOutput: "3", isSample: true },
      { input: "abc\ndef", expectedOutput: "0", isSample: false }
    ],
    codeTemplates: {
      javascript: `function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    console.log(longestCommonSubsequence(lines[0].trim(), lines[1].trim()).toString());
}`,
      python: `import sys

def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        print(longestCommonSubsequence(lines[0].strip(), lines[1].strip()))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [0] * (n + 1)
    for c in text1:
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            if c == text2[j - 1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j - 1])
            prev = temp
    return dp[n]`
    }
  },
  {
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    topic: "Arrays",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    constraints: "- n == height.length\n- 2 <= n <= 10^5\n- 0 <= height[i] <= 10^4",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" }
    ],
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isSample: true },
      { input: "2\n1 1", expectedOutput: "1", isSample: true }
    ],
    codeTemplates: {
      javascript: `function maxArea(height) {
    let maxw = 0, l = 0, r = height.length - 1;
    while (l < r) {
        let h = Math.min(height[l], height[r]);
        maxw = Math.max(maxw, h * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return maxw;
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const height = lines[1].trim().split(' ').map(Number);
    console.log(maxArea(height).toString());
}`,
      python: `import sys

def maxArea(height):
    max_w = 0
    l, r = 0, len(height) - 1
    while l < r:
        h = min(height[l], height[r])
        max_w = max(max_w, h * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_w

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        height = list(map(int, lines[1].split()))
        print(maxArea(height))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def maxArea(height):
    L, R, width, res = 0, len(height) - 1, len(height) - 1, 0
    for w in range(width, 0, -1):
        if height[L] < height[R]:
            res = max(res, height[L] * w)
            L += 1
        else:
            res = max(res, height[R] * w)
            R -= 1
    return res`
    }
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    topic: "Strings",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: "- 0 <= s.length <= 5 * 10^4\n- `s` consists of English letters, digits, symbols and spaces.",
    examples: [
      { input: "s = \"abcabcbb\"", output: "3" }
    ],
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", isSample: true },
      { input: "bbbbb", expectedOutput: "1", isSample: true },
      { input: "pwwkew", expectedOutput: "3", isSample: false }
    ],
    codeTemplates: {
      javascript: `function lengthOfLongestSubstring(s) {
    let maxLen = 0, l = 0;
    const charSet = new Set();
    for (let r = 0; r < s.length; r++) {
        while (charSet.has(s[r])) {
            charSet.delete(s[l]);
            l++;
        }
        charSet.add(s[r]);
        maxLen = Math.max(maxLen, r - l + 1);
    }
    return maxLen;
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
console.log(lengthOfLongestSubstring(input).toString());`,
      python: `import sys

def lengthOfLongestSubstring(s):
    char_set = set()
    l = 0
    max_len = 0
    for r in range(len(s)):
        while s[r] in char_set:
            char_set.remove(s[l])
            l += 1
        char_set.add(s[r])
        max_len = max(max_len, r - l + 1)
    return max_len

def main():
    s = sys.stdin.read().strip()
    print(lengthOfLongestSubstring(s))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def lengthOfLongestSubstring(s):
    seen = {}
    l = 0
    res = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        res = max(res, r - l + 1)
    return res`
    }
  },
  {
    title: "Valid Anagram",
    difficulty: "EASY",
    topic: "Hashing",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    constraints: "- 1 <= s.length, t.length <= 5 * 10^4\n- `s` and `t` consist of lowercase English letters.",
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" }
    ],
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true", isSample: true },
      { input: "rat\ncar", expectedOutput: "false", isSample: true }
    ],
    codeTemplates: {
      javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const counts = {};
    for (let char of s) counts[char] = (counts[char] || 0) + 1;
    for (let char of t) {
        if (!counts[char]) return false;
        counts[char]--;
    }
    return true;
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    console.log(isAnagram(lines[0].trim(), lines[1].trim()).toString());
}`,
      python: `import sys

def isAnagram(s, t):
    if len(s) != len(t): return False
    count = {}
    for char in s:
        count[char] = count.get(char, 0) + 1
    for char in t:
        if count.get(char, 0) == 0: return False
        count[char] -= 1
    return True

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        print(str(isAnagram(lines[0].strip(), lines[1].strip())).lower())

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def isAnagram(s, t):
    return sorted(s) == sorted(t)`
    }
  },
  {
    title: "Implement Queue using Stacks",
    difficulty: "EASY",
    topic: "Queue",
    description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (`push`, `peek`, `pop`, and `empty`).\n\nInput represents a list of operations, operations argument values, space separated. Example: `push 1 push 2 peek pop empty`",
    constraints: "- 1 <= x <= 9\n- At most 100 calls will be made to push, pop, peek, and empty.",
    examples: [
      { input: "push 1 push 2 peek pop empty", output: "[1,1,false]" }
    ],
    testCases: [
      { input: "push 1 push 2 peek pop empty", expectedOutput: "[1,1,false]", isSample: true }
    ],
    codeTemplates: {
      javascript: `class MyQueue {
    constructor() {
        this.s1 = [];
        this.s2 = [];
    }
    push(x) {
        this.s1.push(x);
    }
    pop() {
        this.peek();
        return this.s2.pop();
    }
    peek() {
        if (this.s2.length === 0) {
            while (this.s1.length > 0) {
                this.s2.push(this.s1.pop());
            }
        }
        return this.s2[this.s2.length - 1];
    }
    empty() {
        return this.s1.length === 0 && this.s2.length === 0;
    }
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
if (input) {
    const ops = input.split(' ');
    const q = new MyQueue();
    const out = [];
    let i = 0;
    while (i < ops.length) {
        if (ops[i] === 'push') {
            q.push(parseInt(ops[i+1]));
            i += 2;
        } else if (ops[i] === 'pop') {
            out.push(q.pop());
            i++;
        } else if (ops[i] === 'peek') {
            out.push(q.peek());
            i++;
        } else if (ops[i] === 'empty') {
            out.push(q.empty());
            i++;
        }
    }
    console.log(JSON.stringify(out));
}`,
      python: `import sys
import json

class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []

    def push(self, x):
        self.s1.append(x)

    def pop(self):
        self.peek()
        return self.s2.pop()

    def peek(self):
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2[-1]

    def empty(self):
        return not self.s1 and not self.s2

def main():
    line = sys.stdin.read().strip()
    if line:
        ops = line.split()
        q = MyQueue()
        out = []
        i = 0
        while i < len(ops):
            if ops[i] == 'push':
                q.push(int(ops[i+1]))
                i += 2
            elif ops[i] == 'pop':
                out.append(q.pop())
                i += 1
            elif ops[i] == 'peek':
                out.append(q.peek())
                i += 1
            elif ops[i] == 'empty':
                out.append(q.empty())
                i += 1
        print(json.dumps(out))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `class MyQueue:
    def __init__(self):
        self.in_stk = []
        self.out_stk = []
    def push(self, x):
        self.in_stk.append(x)
    def pop(self):
        self.peek()
        return self.out_stk.pop()
    def peek(self):
        if not self.out_stk:
            while self.in_stk:
                self.out_stk.append(self.in_stk.pop())
        return self.out_stk[-1]
    def empty(self):
        return not self.in_stk and not self.out_stk`
    }
  },
  {
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    topic: "Trees",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).\n\nInput representation: Tree represented as a space-separated level-order array where -1 represents NULL/None.",
    constraints: "- The number of nodes in the tree is in the range [0, 2000].\n- -1000 <= Node.val <= 1000",
    examples: [
      { input: "root = [3,9,20,-1,-1,15,7]", output: "[[3],[9,20],[15,7]]" }
    ],
    testCases: [
      { input: "3 9 20 -1 -1 15 7", expectedOutput: "[[3],[9,20],[15,7]]", isSample: true }
    ],
    codeTemplates: {
      javascript: `class TreeNode {
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
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
if (input) {
    const arr = input.split(' ').map(Number);
    const root = buildTree(arr);
    console.log(JSON.stringify(levelOrder(root)));
} else {
    console.log("[]");
}`,
      python: `import sys
import json

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr or arr[0] == -1: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        curr = queue.pop(0)
        if arr[i] != -1:
            curr.left = TreeNode(arr[i])
            queue.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] != -1:
            curr.right = TreeNode(arr[i])
            queue.append(curr.right)
        i += 1
    return root

def levelOrder(root):
    if not root: return []
    res = []
    queue = [root]
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res

def main():
    line = sys.stdin.read().strip()
    if line:
        arr = list(map(int, line.split()))
        root = buildTree(arr)
        print(json.dumps(levelOrder(root)))
    else:
        print("[]")

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def levelOrder(root):
    if not root: return []
    q, res = [root], []
    while q:
        res.append([node.val for node in q])
        q = [child for node in q for child in (node.left, node.right) if child]
    return res`
    }
  },
  {
    title: "Course Schedule",
    difficulty: "MEDIUM",
    topic: "Graphs",
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.\n\nInput representation:\nLine 1: numCourses P (number of prerequisites)\nNext P lines: prerequisite connection (ai bi)",
    constraints: "- 1 <= numCourses <= 2000\n- 0 <= prerequisites.length <= 5000",
    examples: [
      { input: "2 1\n1 0", output: "true" },
      { input: "2 2\n1 0\n0 1", output: "false" }
    ],
    testCases: [
      { input: "2 1\n1 0", expectedOutput: "true", isSample: true },
      { input: "2 2\n1 0\n0 1", expectedOutput: "false", isSample: true }
    ],
    codeTemplates: {
      javascript: `function canFinish(numCourses, prerequisites) {
    const adj = Array.from({ length: numCourses }, () => []);
    const inDegree = Array(numCourses).fill(0);
    for (let [u, v] of prerequisites) {
        adj[v].push(u);
        inDegree[u]++;
    }
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }
    let count = 0;
    while (queue.length > 0) {
        const curr = queue.shift();
        count++;
        for (let neighbor of adj[curr]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) queue.push(neighbor);
        }
    }
    return count === numCourses;
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length > 0) {
    const [numCourses, p] = lines[0].split(' ').map(Number);
    const prerequisites = [];
    for (let i = 1; i <= p; i++) {
        prerequisites.push(lines[i].trim().split(' ').map(Number));
    }
    console.log(canFinish(numCourses, prerequisites).toString());
}`,
      python: `import sys

def canFinish(numCourses, prerequisites):
    adj = {i: [] for i in range(numCourses)}
    in_degree = [0] * numCourses
    for u, v in prerequisites:
        adj[v].append(u)
        in_degree[u] += 1
    queue = [i for i in range(numCourses) if in_degree[i] == 0]
    count = 0
    while queue:
        curr = queue.pop(0)
        count += 1
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return count == numCourses

def main():
    lines = sys.stdin.read().splitlines()
    if lines:
        numCourses, p = map(int, lines[0].split())
        prerequisites = []
        for i in range(1, p + 1):
            prerequisites.append(list(map(int, lines[i].split())))
        print(str(canFinish(numCourses, prerequisites)).lower())

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def canFinish(numCourses, prerequisites):
    from collections import deque
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        indegree[dest] += 1
    queue = deque([i for i in range(numCourses) if indegree[i] == 0])
    visited_count = 0
    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0: queue.append(neighbor)
    return visited_count == numCourses`
    }
  },
  {
    title: "Edit Distance",
    difficulty: "HARD",
    topic: "DP",
    description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character",
    constraints: "- 0 <= word1.length, word2.length <= 500\n- `word1` and `word2` consist of lowercase English letters.",
    examples: [
      { input: "word1 = \"horse\", word2 = \"ros\"", output: "3" }
    ],
    testCases: [
      { input: "horse\nros", expectedOutput: "3", isSample: true },
      { input: "intention\nexecution", expectedOutput: "5", isSample: true }
    ],
    codeTemplates: {
      javascript: `function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,      // Delete
                    dp[i][j - 1] + 1,      // Insert
                    dp[i - 1][j - 1] + 1   // Replace
                );
            }
        }
    }
    return dp[m][n];
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    console.log(minDistance(lines[0].trim(), lines[1].trim()).toString());
} else if (lines.length === 1) {
    console.log(lines[0].trim().length.toString());
} else {
    console.log("0");
}`,
      python: `import sys

def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + 1)
    return dp[m][n]

def main():
    lines = sys.stdin.read().splitlines()
    w1 = lines[0].strip() if len(lines) >= 1 else ""
    w2 = lines[1].strip() if len(lines) >= 2 else ""
    print(minDistance(w1, w2))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        pre = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if word1[i - 1] == word2[j - 1]: dp[j] = pre
            else: dp[j] = min(pre, dp[j], dp[j - 1]) + 1
            pre = temp
    return dp[n]`
    }
  },
  {
    title: "Climbing Stairs",
    difficulty: "EASY",
    topic: "DP",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: "1 <= n <= 45",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    testCases: [
      { input: "2", expectedOutput: "2", isSample: true },
      { input: "3", expectedOutput: "3", isSample: true },
      { input: "5", expectedOutput: "8", isSample: false }
    ],
    codeTemplates: {
      javascript: `function climbStairs(n) {
    if (n <= 2) return n;
    let first = 1, second = 2;
    for (let i = 3; i <= n; i++) {
        let third = first + second;
        first = second;
        second = third;
    }
    return second;
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
console.log(climbStairs(parseInt(input)).toString());`,
      python: `import sys

def climbStairs(n):
    if n <= 2: return n
    first, second = 1, 2
    for i in range(3, n + 1):
        third = first + second
        first = second
        second = third
    return second

def main():
    val = int(sys.stdin.read().strip())
    print(climbStairs(val))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def climbStairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`
    }
  },
  {
    title: "Letter Combinations of a Phone Number",
    difficulty: "MEDIUM",
    topic: "Recursion",
    description: "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in sorted lexicographical order.\n\nA mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.\n- 2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz",
    constraints: "- 0 <= digits.length <= 4\n- `digits[i]` is a digit in the range ['2', '9'].",
    examples: [
      { input: "digits = \"23\"", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" }
    ],
    testCases: [
      { input: "23", expectedOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', isSample: true },
      { input: "", expectedOutput: "[]", isSample: true }
    ],
    codeTemplates: {
      javascript: `function letterCombinations(digits) {
    if (!digits) return [];
    const map = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
    const res = [];
    function backtrack(idx, path) {
        if (idx === digits.length) {
            res.push(path);
            return;
        }
        const letters = map[digits[idx]];
        for (let char of letters) {
            backtrack(idx + 1, path + char);
        }
    }
    backtrack(0, "");
    return res;
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
console.log(JSON.stringify(letterCombinations(input)));`,
      python: `import sys
import json

def letterCombinations(digits):
    if not digits: return []
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    res = []
    def backtrack(idx, path):
        if idx == len(digits):
            res.append(path)
            return
        for char in mapping[digits[idx]]:
            backtrack(idx + 1, path + char)
    backtrack(0, "")
    return res

def main():
    val = sys.stdin.read().strip()
    print(json.dumps(letterCombinations(val)))

if __name__ == '__main__':
    main()`
    },
    referenceSolutions: {
      python: `def letterCombinations(digits):
    if not digits: return []
    mapping = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
    res = [""]
    for d in digits:
        res = [prev + char for prev in res for char in mapping[d]]
    return res`
    }
  },
  {
    title: "SQL: Department Highest Salary",
    difficulty: "MEDIUM",
    topic: "SQL",
    description: "Write a solution to find employees who have the highest salary in each of the departments.\n\nTable: `Employee`\n- `id` (int, primary key)\n- `name` (varchar)\n- `salary` (int)\n- `departmentId` (int)\n\nTable: `Department`\n- `id` (int, primary key)\n- `name` (varchar)",
    constraints: "Highest salary can belong to multiple employees in the same department.",
    examples: [
      {
        input: "Employee table:\n| id | name  | salary | departmentId |\n| 1  | Joe   | 70000  | 1            |\n| 2  | Jim   | 90000  | 1            |\n| 3  | Henry | 80000  | 2            |\n| 4  | Sam   | 60000  | 2            |\n| 5  | Max   | 90000  | 1            |\n\nDepartment table:\n| id | name  |\n| 1  | IT    |\n| 2  | Sales |",
        output: "IT: Max (90000), IT: Jim (90000), Sales: Henry (80000)"
      }
    ],
    testCases: [
      {
        input: `CREATE TABLE Department (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(50), salary INT, departmentId INT);
INSERT INTO Department VALUES (1, 'IT');
INSERT INTO Department VALUES (2, 'Sales');
INSERT INTO Employee VALUES (1, 'Joe', 70000, 1);
INSERT INTO Employee VALUES (2, 'Jim', 90000, 1);
INSERT INTO Employee VALUES (3, 'Henry', 80000, 2);
INSERT INTO Employee VALUES (4, 'Sam', 60000, 2);
INSERT INTO Employee VALUES (5, 'Max', 90000, 1);`,
        expectedOutput: "IT|Jim|90000\nIT|Max|90000\nSales|Henry|80000",
        isSample: true
      }
    ],
    codeTemplates: {
      sql: `-- Write your SQL query here
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);`
    },
    referenceSolutions: {
      sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId);`
    }
  }
];

async function main() {
  console.log('Seeding coding problems...');
  for (const prob of problems) {
    await prisma.problem.upsert({
      where: { title: prob.title },
      update: prob,
      create: prob,
    });
  }
  console.log("Successfully seeded 16 core problems. Let's add the remaining 4 problems to reach the target of 20.");
  
  const remainingProblems = [
    {
      title: "Climb Stairs Min Cost",
      difficulty: "EASY",
      topic: "DP",
      description: "You are given an integer array `cost` where `cost[i]` is the cost of `i`-th step on a staircase. Once you pay the cost, you can either climb one or two steps.\n\nYou can either start from the step with index 0, or the step with index 1.\n\nReturn the minimum cost to reach the top of the floor.",
      constraints: "- 2 <= cost.length <= 1000\n- 0 <= cost[i] <= 999",
      examples: [
        { input: "cost = [10,15,20]", output: "15" }
      ],
      testCases: [
        { input: "3\n10 15 20", expectedOutput: "15", isSample: true },
        { input: "10\n1 100 1 1 1 100 1 1 100 1", expectedOutput: "6", isSample: true }
      ],
      codeTemplates: {
        javascript: `function minCostClimbingStairs(cost) {
    let downOne = 0, downTwo = 0;
    for (let i = 2; i <= cost.length; i++) {
        let temp = Math.min(downOne + cost[i - 1], downTwo + cost[i - 2]);
        downTwo = downOne;
        downOne = temp;
    }
    return downOne;
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const cost = lines[1].trim().split(' ').map(Number);
    console.log(minCostClimbingStairs(cost).toString());
}`,
        python: `import sys

def minCostClimbingStairs(cost):
    down_one = down_two = 0
    for i in range(2, len(cost) + 1):
        temp = min(down_one + cost[i - 1], down_two + cost[i - 2])
        down_two = down_one
        down_one = temp
    return down_one

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        cost = list(map(int, lines[1].split()))
        print(minCostClimbingStairs(cost))

if __name__ == '__main__':
    main()`
      },
      referenceSolutions: {
        python: `def minCostClimbingStairs(cost):
    f1 = f2 = 0
    for x in cost[::-1]: f1, f2 = x + min(f1, f2), f1
    return min(f1, f2)`
      }
    },
    {
      title: "Subsets",
      difficulty: "MEDIUM",
      topic: "Recursion",
      description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in sorted order.",
      constraints: "- 1 <= nums.length <= 10\n- -10 <= nums[i] <= 10",
      examples: [
        { input: "nums = [1,2,3]", output: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]" }
      ],
      testCases: [
        { input: "3\n1 2 3", expectedOutput: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]", isSample: true }
      ],
      codeTemplates: {
        javascript: `function subsets(nums) {
    const res = [];
    function backtrack(start, path) {
        res.push([...path]);
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    nums.sort((a,b)=>a-b);
    backtrack(0, []);
    return res;
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const nums = lines[1].trim().split(' ').map(Number);
    console.log(JSON.stringify(subsets(nums)));
}`,
        python: `import sys
import json

def subsets(nums):
    res = []
    nums.sort()
    def backtrack(start, path):
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        nums = list(map(int, lines[1].split()))
        print(json.dumps(subsets(nums)))

if __name__ == '__main__':
    main()`
      },
      referenceSolutions: {
        python: `def subsets(nums):
    res = [[]]
    for num in sorted(nums):
        res += [curr + [num] for curr in res]
    return res`
      }
    },
    {
      title: "First Unique Character in a String",
      difficulty: "EASY",
      topic: "Hashing",
      description: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
      constraints: "- 1 <= s.length <= 10^5\n- `s` consists of lowercase English letters.",
      examples: [
        { input: "s = \"leetcode\"", output: "0" }
      ],
      testCases: [
        { input: "leetcode", expectedOutput: "0", isSample: true },
        { input: "loveleetcode", expectedOutput: "2", isSample: true },
        { input: "aabb", expectedOutput: "-1", isSample: false }
      ],
      codeTemplates: {
        javascript: `function firstUniqChar(s) {
    const map = {};
    for (let char of s) {
        map[char] = (map[char] || 0) + 1;
    }
    for (let i = 0; i < s.length; i++) {
        if (map[s[i]] === 1) return i;
    }
    return -1;
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
console.log(firstUniqChar(input).toString());`,
        python: `import sys

def firstUniqChar(s):
    count = {}
    for char in s:
        count[char] = count.get(char, 0) + 1
    for i, char in enumerate(s):
        if count[char] == 1:
            return i
    return -1

def main():
    s = sys.stdin.read().strip()
    print(firstUniqChar(s))

if __name__ == '__main__':
    main()`
      },
      referenceSolutions: {
        python: `def firstUniqChar(s):
    count = {}
    for c in s: count[c] = count.get(c, 0) + 1
    for i, c in enumerate(s):
        if count[c] == 1: return i
    return -1`
      }
    },
    {
      title: "Kth Largest Element in an Array",
      difficulty: "MEDIUM",
      topic: "Queue",
      description: "Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array.\n\nNote that it is the `k`-th largest element in the sorted order, not the `k`-th distinct element.",
      constraints: "- 1 <= k <= nums.length <= 10^5\n- -10^4 <= nums[i] <= 10^4",
      examples: [
        { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
      ],
      testCases: [
        { input: "6 2\n3 2 1 5 6 4", expectedOutput: "5", isSample: true }
      ],
      codeTemplates: {
        javascript: `function findKthLargest(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}

const fs = require('fs');
const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
if (lines.length >= 2) {
    const [n, k] = lines[0].split(' ').map(Number);
    const nums = lines[1].trim().split(' ').map(Number);
    console.log(findKthLargest(nums, k).toString());
}`,
        python: `import sys

def findKthLargest(nums, k):
    nums.sort(reverse=True)
    return nums[k - 1]

def main():
    lines = sys.stdin.read().splitlines()
    if len(lines) >= 2:
        n, k = map(int, lines[0].split())
        nums = list(map(int, lines[1].split()))
        print(findKthLargest(nums, k))

if __name__ == '__main__':
    main()`
      },
      referenceSolutions: {
        python: `def findKthLargest(nums, k):
    import heapq
    return heapq.nlargest(k, nums)[-1]`
      }
    }
  ];

  for (const prob of remainingProblems) {
    await prisma.problem.upsert({
      where: { title: prob.title },
      update: prob,
      create: prob,
    });
  }

  console.log('Successfully seeded all 20 problems!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
