const axios = require('axios');

// Predefined smart hints for seeded problems
const HINT_DATABASE = {
  "two sum": {
    hint: "Try using a hash map to store the elements you have already seen and their indices. As you iterate, check if the complement (target - current) exists in the map.",
    complexity: "Time: O(N) since we only traverse the list once. Space: O(N) to store elements in the hash map.",
    concept: "Hashing, Hash Maps, Key-Value Lookups"
  },
  "reverse string": {
    hint: "Use a two-pointer approach. Place one pointer at the start and one at the end of the array, then swap the characters and move the pointers towards the center.",
    complexity: "Time: O(N) to traverse half the string. Space: O(1) auxiliary space as we do it in-place.",
    concept: "Two-Pointer Technique, Swapping"
  },
  "valid parentheses": {
    hint: "Use a Stack. Push opening brackets onto the stack. When you see a closing bracket, check if it matches the top element of the stack. If it does, pop it; otherwise, the string is invalid.",
    complexity: "Time: O(N) to scan the string once. Space: O(N) for the stack in the worst case.",
    concept: "Stack (LIFO), Matching Brackets"
  },
  "sql: employees earning more than managers": {
    hint: "Perform a self-join on the Employee table. Join where the managerId of the first instance matches the id of the second instance, and filter where the first salary is greater than the second salary.",
    complexity: "Time: O(N^2) or O(N log N) depending on indexes. Space: O(1) temp space.",
    concept: "Self-Join, Conditional Filtering"
  },
  "sql: second highest salary": {
    hint: "Use subqueries or LIMIT/OFFSET. One way is to find the maximum salary that is strictly less than the overall maximum salary.",
    complexity: "Time: O(N) index scan. Space: O(1).",
    concept: "Subqueries, Aggregate Functions (MAX), Distinct values"
  },
  "merge sorted arrays": {
    hint: "Start filling the array from the end rather than the beginning. Since nums1 has extra space, compare the largest elements of nums1 and nums2, and place the larger one at the back of nums1.",
    complexity: "Time: O(m + n). Space: O(1) since we modify nums1 in-place.",
    concept: "Three Pointers, Backward Traversal"
  },
  "binary tree inorder traversal": {
    hint: "Recursively traverse the left subtree, visit the root node, and then recursively traverse the right subtree. You can also do this iteratively using a stack.",
    complexity: "Time: O(N) to visit every node once. Space: O(H) where H is the height of the tree for the recursion stack.",
    concept: "DFS, Inorder DFS (Left, Node, Right)"
  },
  "graph bfs: find path": {
    hint: "Build an adjacency list first. Start a BFS or DFS search from the source node, using a queue (for BFS) and a visited set to avoid infinite loops, and check if you can reach the destination.",
    complexity: "Time: O(V + E) to traverse vertices and edges. Space: O(V + E) for adjacency list and visited set.",
    concept: "BFS, Queue, Adjacency List"
  },
  "fibonacci number": {
    hint: "You can solve this recursively, but recursion will repeat calculations. Try using memoization or simple iterative variables (a, b) to store previous two Fibonacci numbers.",
    complexity: "Time: O(N) for iterative approach. Space: O(1) if you only track the last two numbers.",
    concept: "Dynamic Programming, Recursion, Memoization"
  },
  "longest common subsequence": {
    hint: "Use a 2D DP array where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1]. If characters match, add 1 to dp[i-1][j-1]; otherwise, take the max of dp[i-1][j] and dp[i][j-1].",
    complexity: "Time: O(M * N). Space: O(M * N) which can be optimized to O(min(M, N)).",
    concept: "Dynamic Programming, Grid DP"
  },
  "container with most water": {
    hint: "Use two pointers, one at the beginning and one at the end of the array. Compute the water area, then move the pointer pointing to the shorter line inward.",
    complexity: "Time: O(N) pointer scan. Space: O(1) auxiliary space.",
    concept: "Two-Pointer Technique, Greedy choice"
  },
  "longest substring without repeating characters": {
    hint: "Use a sliding window with two pointers (left and right). Keep track of unique characters in the window using a Set or HashMap. Shrink the window from the left when a duplicate is encountered.",
    complexity: "Time: O(N) as each character is visited at most twice. Space: O(min(M, N)) where M is alphabet size.",
    concept: "Sliding Window, Set / Hash Table lookup"
  },
  "valid anagram": {
    hint: "Count character frequencies using a hash map or an array of size 26. Increment counts for the first string, and decrement counts for the second string. Check if all counts return to zero.",
    complexity: "Time: O(N) frequency count. Space: O(1) since size of alphabet is fixed.",
    concept: "Hashing, Character Frequencies"
  },
  "implement queue using stacks": {
    hint: "Use two stacks: inStack and outStack. For push, push to inStack. For pop/peek, if outStack is empty, pop all elements from inStack and push them into outStack, then pop/peek from outStack.",
    complexity: "Time: Amortized O(1) per operation. Space: O(N) to store elements.",
    concept: "Stack-Queue Simulation, Amortized Complexity"
  },
  "binary tree level order traversal": {
    hint: "Use a BFS traversal with a Queue. For each level, record its size, and loop through exactly that many nodes to push them into a level array and queue their children.",
    complexity: "Time: O(N) to visit each node once. Space: O(N) to store nodes in the queue.",
    concept: "BFS, Level-Order DFS, Queue"
  },
  "course schedule": {
    hint: "This is a cycle detection problem in a directed graph. You can use Kahn's algorithm (BFS topological sort) by tracking in-degrees, or DFS tracking visited states (active recursion stack).",
    complexity: "Time: O(V + E). Space: O(V + E) for adjacency list and in-degrees list.",
    concept: "Topological Sort, Graph Cycle Detection, DFS/BFS"
  },
  "edit distance": {
    hint: "Use a 2D DP array. dp[i][j] is the min distance for word1[0..i-1] and word2[0..j-1]. If character match, dp[i][j] = dp[i-1][j-1]. Else, it is 1 + min(delete: dp[i-1][j], insert: dp[i][j-1], replace: dp[i-1][j-1]).",
    complexity: "Time: O(M * N). Space: O(M * N) grid space.",
    concept: "Dynamic Programming, String Alignments"
  },
  "climbing stairs": {
    hint: "This problem can be broken down into: ways(n) = ways(n-1) + ways(n-2), which is equivalent to the Fibonacci sequence. Solve it iteratively or using memoization.",
    complexity: "Time: O(N). Space: O(1) if using simple loop variables.",
    concept: "Dynamic Programming, Fibonacci Sequence"
  },
  "letter combinations of a phone number": {
    hint: "Use backtracking recursion. Keep a mapping of digits to characters. At each step, iterate through the mapped letters of the current digit, append to the path, and recurse for the next digit.",
    complexity: "Time: O(4^N) where N is digits length. Space: O(N) recursion call stack.",
    concept: "Backtracking, DFS recursion, Decision Trees"
  },
  "sql: department highest salary": {
    hint: "Find the maximum salary grouped by departmentId in a subquery, then join the Employee and Department tables matching both departmentId and salary with the subquery results.",
    complexity: "Time: O(N log N). Space: O(N).",
    concept: "SQL Group By, SQL Join, Subquery Filtering"
  }
};

const DEFAULT_HINT = {
  hint: "Read the description carefully, break down the problem into smaller sub-problems, and start by implementing a brute-force approach first.",
  complexity: "Time complexity depends on your implementation, try to aim for O(N) or O(N log N).",
  concept: "Problem-solving, Divide & Conquer"
};

exports.getAIHint = async (problemTitle, problemDescription, userCode) => {
  const apiKey = process.env.AI_KEY;

  if (!apiKey) {
    console.log('No AI_KEY found. Fetching pre-crafted hint for:', problemTitle);
    const key = problemTitle.toLowerCase().trim();
    const mockHint = HINT_DATABASE[key] || DEFAULT_HINT;
    return mockHint;
  }

  try {
    // OpenAI API call
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI Coding Interview coach. Help the student solve the coding problem. 
            Rules:
            1. Guide the student by pointing out patterns or logic issues.
            2. Do NOT reveal code, solutions, or write functions for them.
            3. Maximum response length is 100 words.
            4. Provide your response in JSON format containing:
               - "hint": A short guiding prompt/clue.
               - "complexity": A hint about the optimal time/space complexity.
               - "concept": The core data structures/algorithms involved.`
          },
          {
            role: 'user',
            content: `Problem: ${problemTitle}
            Description: ${problemDescription}
            Student's Current Code:
            \`\`\`
            ${userCode}
            \`\`\``
          }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = JSON.parse(response.data.choices[0].message.content);
    return {
      hint: content.hint || 'Examine your loop conditions.',
      complexity: content.complexity || 'Check if you can do better than O(N^2).',
      concept: content.concept || 'Arrays & Hashing'
    };
  } catch (error) {
    console.error('AI API Error, falling back to local database hints:', error.message);
    const key = problemTitle.toLowerCase().trim();
    return HINT_DATABASE[key] || DEFAULT_HINT;
  }
};
