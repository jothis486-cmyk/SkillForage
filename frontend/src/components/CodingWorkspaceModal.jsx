import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    subtitle: 'Find pair with target sum',
    difficulty: 'Easy',
    topic: 'Array',
    subtopic: 'Hash Map',
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
    acceptance: '53.2%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    codeSnippets: {
      python: `def twoSum(nums, target):
    # Hash map: value -> index
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution:
nums = [2, 7, 11, 15]
target = 9
print(twoSum(nums, target))  # Output: [0, 1]`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

// Test execution:
console.log(twoSum([2, 7, 11, 15], 9)); // Output: [0, 1]`,
      cpp: `#include <vector>
#include <unordered_map>
#include <iostream>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
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
}`
    },
    hint: 'Use a hash map to store each number and its index. For each number x, check if (target - x) already exists in the map in O(1) time.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)'
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    subtitle: 'Classic pointer manipulation',
    difficulty: 'Easy',
    topic: 'Linked List',
    subtopic: 'Two Pointers',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Meta'],
    acceptance: '75.8%',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'All pointer directions reversed sequentially.'
      },
      {
        input: 'head = [1, 2]',
        output: '[2, 1]',
        explanation: '2 points to 1, and 1 points to null.'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    codeSnippets: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      javascript: `function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        const nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
    },
    hint: 'Iterate through the list while maintaining a `prev` pointer (initialized to null). At each step, save `curr.next`, set `curr.next = prev`, then shift both pointers forward.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(1)'
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    subtitle: 'Stack-based bracket matching',
    difficulty: 'Easy',
    topic: 'Stack',
    subtopic: 'String',
    companies: ['Amazon', 'Google', 'Bloomberg', 'Goldman Sachs'],
    acceptance: '40.6%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple matched parentheses pair.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Multiple valid pairs in order.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Mismatched closing bracket type.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    codeSnippets: {
      python: `def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0

print(isValid("()[]{}")) # True`,
      javascript: `function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (map[char]) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            if (c == ')' && st.top() != '(') return false;
            if (c == '}' && st.top() != '{') return false;
            if (c == ']' && st.top() != '[') return false;
            st.pop();
        }
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}`
    },
    hint: 'Push opening brackets to a LIFO stack. When a closing bracket is encountered, pop from the stack and verify that it matches.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)'
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    subtitle: 'Sliding window with character map',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    subtopic: 'Hash Table',
    companies: ['Amazon', 'Google', 'Meta', 'Uber'],
    acceptance: '34.5%',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    codeSnippets: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len

print(lengthOfLongestSubstring("abcabcbb")) # 3`,
      javascript: `function lengthOfLongestSubstring(s) {
    const seen = new Map();
    let left = 0;
    let maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (seen.has(char) && seen.get(char) >= left) {
            left = seen.get(char) + 1;
        }
        seen.set(char, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    vector<int> dict(256, -1);
    int maxLen = 0, start = -1;
    for (int i = 0; i < s.length(); i++) {
        if (dict[s[i]] > start) start = dict[s[i]];
        dict[s[i]] = i;
        maxLen = max(maxLen, i - start);
    }
    return maxLen;
}`,
      java: `public int lengthOfLongestSubstring(String s) {
    int n = s.length(), ans = 0;
    Map<Character, Integer> map = new HashMap<>();
    for (int j = 0, i = 0; j < n; j++) {
        if (map.containsKey(s.charAt(j))) {
            i = Math.max(map.get(s.charAt(j)), i);
        }
        ans = Math.max(ans, j - i + 1);
        map.put(s.charAt(j), j + 1);
    }
    return ans;
}`
    },
    hint: 'Use a sliding window defined by [left, right] pointers. As right expands, update left to be right after the last duplicate character occurrence.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(min(N, M))'
  },
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    subtitle: 'Breadth-First Search (BFS)',
    difficulty: 'Medium',
    topic: 'Trees',
    subtopic: 'BFS',
    companies: ['Amazon', 'Microsoft', 'Meta', 'LinkedIn'],
    acceptance: '66.1%',
    description: `Given the \`root\` of a binary tree, return *the level order traversal of its nodes' values*. (i.e., from left to right, level by level).`,
    examples: [
      {
        input: 'root = [3, 9, 20, null, null, 15, 7]',
        output: '[[3], [9, 20], [15, 7]]',
        explanation: 'Level 0: [3], Level 1: [9, 20], Level 2: [15, 7]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000'
    ],
    codeSnippets: {
      python: `from collections import deque

def levelOrder(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(current_level)
    return result`,
      javascript: `function levelOrder(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(currentLevel);
    }
    return result;
}`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> ans;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        ans.push_back(level);
    }
    return ans;
}`,
      java: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.add(node.left);
            if (node.right != null) q.add(node.right);
        }
        res.add(level);
    }
    return res;
}`
    },
    hint: 'Use a standard FIFO queue. For each level, record `len(queue)` to process only the nodes on that level before moving to their children.',
    optimalTime: 'O(N)',
    optimalSpace: 'O(N)'
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge K Sorted Lists',
    subtitle: 'Min-Heap Priority Queue',
    difficulty: 'Hard',
    topic: 'Heap',
    subtopic: 'Divide and Conquer',
    companies: ['Amazon', 'Google', 'Meta', 'Apple', 'Uber'],
    acceptance: '51.4%',
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it.*`,
    examples: [
      {
        input: 'lists = [[1, 4, 5], [1, 3, 4], [2, 6]]',
        output: '[1, 1, 2, 3, 4, 4, 5, 6]',
        explanation: 'All lists merged in ascending order.'
      }
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      '-10^4 <= lists[i][j] <= 10^4',
      'lists[i] is sorted in ascending order.'
    ],
    codeSnippets: {
      python: `import heapq

def mergeKLists(lists):
    heap = []
    # Add (val, index, node) to heap
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
      javascript: `// Min-Heap approach for K sorted lists
function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;
    const mergeTwo = (l1, l2) => {
        const dummy = { val: 0, next: null };
        let curr = dummy;
        while (l1 && l2) {
            if (l1.val < l2.val) { curr.next = l1; l1 = l1.next; }
            else { curr.next = l2; l2 = l2.next; }
            curr = curr.next;
        }
        curr.next = l1 || l2;
        return dummy.next;
    };
    let step = 1;
    while (step < lists.length) {
        for (let i = 0; i + step < lists.length; i += step * 2) {
            lists[i] = mergeTwo(lists[i], lists[i + step]);
        }
        step *= 2;
    }
    return lists[0] || null;
}`,
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto comp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(comp)> pq(comp);
    for (auto list : lists) if (list) pq.push(list);
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        tail->next = node;
        tail = tail->next;
        if (node->next) pq.push(node->next);
    }
    return dummy.next;
}`,
      java: `public ListNode mergeKLists(ListNode[] lists) {
    if (lists == null || lists.length == 0) return null;
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode node : lists) {
        if (node != null) pq.add(node);
    }
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        tail.next = node;
        tail = tail.next;
        if (node.next != null) pq.add(node.next);
    }
    return dummy.next;
}`
    },
    hint: 'Use a Min-Heap of size K. Insert the head of each list into the heap. Extract minimum and push that node’s next element.',
    optimalTime: 'O(N log K)',
    optimalSpace: 'O(K)'
  }
];

export default function CodingWorkspaceModal({ isOpen, onClose, initialProblemId = 'two-sum' }) {
  const [selectedProbId, setSelectedProbId] = useState(initialProblemId || 'two-sum');
  const [selectedLang, setSelectedLang] = useState('python');
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'editorial' | 'submissions'
  const [testCaseIdx, setTestCaseIdx] = useState(0);
  const [outputConsole, setOutputConsole] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const problem = PROBLEMS.find(p => p.id === selectedProbId) || PROBLEMS[0];
  const [userCode, setUserCode] = useState(() => problem.codeSnippets[selectedLang]);

  // When problem or language changes, update code
  const handleProblemChange = (probId) => {
    setSelectedProbId(probId);
    const p = PROBLEMS.find(item => item.id === probId) || PROBLEMS[0];
    setUserCode(p.codeSnippets[selectedLang]);
    setOutputConsole(null);
    setShowHint(false);
    setSubmissionSuccess(false);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setUserCode(problem.codeSnippets[lang]);
    setOutputConsole(null);
  };

  const handleResetCode = () => {
    setUserCode(problem.codeSnippets[selectedLang]);
    setOutputConsole(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutputConsole(null);
    setTimeout(() => {
      setIsRunning(false);
      const ex = problem.examples[testCaseIdx] || problem.examples[0];
      setOutputConsole({
        status: 'Success',
        passed: true,
        runtime: `${Math.floor(Math.random() * 25 + 35)} ms`,
        memory: '16.8 MB',
        input: ex.input,
        output: ex.output,
        expected: ex.output,
        stdout: `Code compiled successfully.\nResult matches expected output: ${ex.output}`
      });
    }, 700);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);
    setOutputConsole(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      const runtimeMs = Math.floor(Math.random() * 30 + 38);
      const beats = (92.4 + Math.random() * 6).toFixed(1);
      setOutputConsole({
        status: 'Accepted',
        passed: true,
        runtime: `${runtimeMs} ms`,
        beats: `${beats}%`,
        memory: '17.2 MB',
        testCasesPassed: `${problem.examples.length + 12} / ${problem.examples.length + 12}`,
        stdout: `All hidden test cases passed! +50 XP Awarded.`
      });
    }, 1100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.9)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          style={{
            background: '#0d111d',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 18,
            width: '100%',
            maxWidth: 1250,
            height: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 50px rgba(99, 102, 241, 0.18)',
          }}
        >
          {/* Top Bar */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: '#111625',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            {/* Problem Title & Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}>
                💻
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    value={selectedProbId}
                    onChange={(e) => handleProblemChange(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {PROBLEMS.map(p => (
                      <option key={p.id} value={p.id} style={{ background: '#111625', color: '#fff' }}>
                        {p.title} ({p.difficulty})
                      </option>
                    ))}
                  </select>

                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: problem.difficulty === 'Easy' ? 'rgba(16,185,129,0.15)' : problem.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: problem.difficulty === 'Easy' ? '#6ee7b7' : problem.difficulty === 'Medium' ? '#fcd34d' : '#fca5a5'
                  }}>
                    {problem.difficulty}
                  </span>

                  <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 20 }}>
                    {problem.topic}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Run, Submit, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  padding: '7px 12px',
                  background: showHint ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${showHint ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                  color: showHint ? '#fcd34d' : '#cbd5e1',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>💡</span>
                <span>AI Hint</span>
              </button>

              <button
                onClick={handleResetCode}
                style={{
                  padding: '7px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔄 Reset
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                style={{
                  padding: '7px 16px',
                  background: 'rgba(99,102,241,0.18)',
                  border: '1px solid #6366f1',
                  color: '#a5b4fc',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s'
                }}
              >
                <span>{isRunning ? '⏳' : '▶'}</span>
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                style={{
                  padding: '7px 18px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <span>{isSubmitting ? '⚙️' : '🚀'}</span>
                <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 6
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main IDE Workspace: Split Screen */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '460px 1fr', overflow: 'hidden' }}>
            
            {/* Left Pane: Problem Description & Editorial */}
            <div style={{
              borderRight: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              background: '#0a0d17',
              overflow: 'hidden'
            }}>
              {/* Left Sub-tabs */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.2)'
              }}>
                {[
                  { id: 'description', label: '📖 Problem' },
                  { id: 'editorial', label: '🧠 Solution Approach' },
                  { id: 'submissions', label: '📊 Test Results' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: activeTab === tab.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${activeTab === tab.id ? '#6366f1' : 'transparent'}`,
                      color: activeTab === tab.id ? '#fff' : '#64748b',
                      fontSize: 12,
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Problem Content Container */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', fontSize: 13, lineHeight: 1.6 }}>
                {activeTab === 'description' && (
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                      {problem.title}
                    </h2>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
                      {problem.subtitle}
                    </div>

                    {/* Companies */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                      <span style={{ fontSize: 11, color: '#64748b' }}>Asked at:</span>
                      {problem.companies.map((c, i) => (
                        <span key={i} style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', padding: '2px 8px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Description Text */}
                    <div style={{ color: '#cbd5e1', whiteSpace: 'pre-line', marginBottom: 20 }}>
                      {problem.description}
                    </div>

                    {/* AI Hint Card */}
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: 'rgba(245,158,11,0.08)',
                          border: '1px solid rgba(245,158,11,0.25)',
                          borderRadius: 12,
                          padding: 14,
                          marginBottom: 20
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fcd34d', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
                          <span>💡</span>
                          <span>AI Mentor Hint</span>
                        </div>
                        <div style={{ color: '#fed7aa', fontSize: 12 }}>
                          {problem.hint}
                        </div>
                        <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 8, display: 'flex', gap: 12 }}>
                          <span>Optimal Time: <strong>{problem.optimalTime}</strong></span>
                          <span>Optimal Space: <strong>{problem.optimalSpace}</strong></span>
                        </div>
                      </motion.div>
                    )}

                    {/* Examples */}
                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Examples:</h4>
                      {problem.examples.map((ex, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 10,
                          padding: '12px 14px',
                          marginBottom: 10,
                          fontSize: 12
                        }}>
                          <div style={{ color: '#94a3b8', marginBottom: 3 }}>
                            <strong style={{ color: '#fff' }}>Example {idx + 1}:</strong>
                          </div>
                          <div style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>
                            <span style={{ color: '#a5b4fc' }}>Input:</span> {ex.input}
                          </div>
                          <div style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '3px 0' }}>
                            <span style={{ color: '#6ee7b7' }}>Output:</span> {ex.output}
                          </div>
                          {ex.explanation && (
                            <div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
                              <em>Explanation:</em> {ex.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Constraints:</h4>
                      <ul style={{ margin: 0, paddingLeft: 18, color: '#94a3b8', fontSize: 12 }}>
                        {problem.constraints.map((c, i) => (
                          <li key={i} style={{ marginBottom: 4, fontFamily: 'monospace' }}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'editorial' && (
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                      Optimal Solution Breakdown
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: 12 }}>
                      Industry-standard optimal patterns expected in top technical interviews.
                    </p>

                    <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: 14, margin: '14px 0' }}>
                      <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
                        Time & Space Complexity
                      </div>
                      <div style={{ display: 'flex', gap: 20, color: '#cbd5e1', fontSize: 12 }}>
                        <div>⏱️ Time: <strong>{problem.optimalTime}</strong></div>
                        <div>💾 Space: <strong>{problem.optimalSpace}</strong></div>
                      </div>
                    </div>

                    <div style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.6 }}>
                      <p><strong>Approach Strategy:</strong></p>
                      <p>{problem.hint}</p>
                      <p>Rather than using a brute-force nested loop (which would be O(N²)), we can reduce lookup time to O(1) using an associative container / hash table.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'submissions' && (
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                      Recent Test Runs
                    </h3>
                    {submissionSuccess ? (
                      <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#6ee7b7', marginBottom: 4 }}>
                          🎉 Accepted
                        </div>
                        <div style={{ fontSize: 12, color: '#cbd5e1' }}>
                          All test cases passed. Ready for technical interviews!
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#64748b', fontSize: 12, textAlign: 'center', padding: '30px 0' }}>
                        Click <strong>Run Code</strong> or <strong>Submit</strong> to record results.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Code Editor + Console */}
            <div style={{ display: 'flex', flexDirection: 'column', background: '#070913', overflow: 'hidden' }}>
              
              {/* Code Editor Top Bar */}
              <div style={{
                padding: '8px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: '#0c0f1c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Language:</span>
                  {['python', 'javascript', 'cpp', 'java'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: selectedLang === lang ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${selectedLang === lang ? '#6366f1' : 'transparent'}`,
                        color: selectedLang === lang ? '#fff' : '#64748b',
                        fontSize: 11,
                        fontWeight: selectedLang === lang ? 700 : 500,
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: '#475569' }}>
                  Auto-Indented • Ready to compile
                </div>
              </div>

              {/* Code Textarea Area */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  spellCheck="false"
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    background: '#070913',
                    color: '#e2e8f0',
                    border: 'none',
                    outline: 'none',
                    padding: '16px 20px',
                    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, Monaco, monospace",
                    fontSize: 13,
                    lineHeight: 1.6,
                    resize: 'none',
                    tabSize: 4
                  }}
                />
              </div>

              {/* Bottom Test Case & Console Runner */}
              <div style={{
                height: 240,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                background: '#0a0d19',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Console Bar */}
                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>Testcase:</span>
                    {problem.examples.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestCaseIdx(i)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: testCaseIdx === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${testCaseIdx === i ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                          color: testCaseIdx === i ? '#fff' : '#94a3b8',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Case {i + 1}
                      </button>
                    ))}
                  </div>

                  {outputConsole && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                      <span style={{
                        color: outputConsole.passed ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        background: outputConsole.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        padding: '2px 8px',
                        borderRadius: 12
                      }}>
                        {outputConsole.status}
                      </span>
                      <span style={{ color: '#64748b' }}>Runtime: {outputConsole.runtime}</span>
                      {outputConsole.beats && (
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>Beats {outputConsole.beats}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Console Content */}
                <div style={{ flex: 1, padding: '12px 18px', overflowY: 'auto', fontSize: 12, fontFamily: 'monospace' }}>
                  {outputConsole ? (
                    <div>
                      <div style={{ color: '#a5b4fc', marginBottom: 4 }}>
                        Input: <span style={{ color: '#fff' }}>{outputConsole.input || problem.examples[testCaseIdx].input}</span>
                      </div>
                      <div style={{ color: '#6ee7b7', marginBottom: 4 }}>
                        Output: <span style={{ color: '#fff' }}>{outputConsole.output || problem.examples[testCaseIdx].output}</span>
                      </div>
                      <div style={{ color: '#94a3b8', marginBottom: 8 }}>
                        Expected: <span style={{ color: '#fff' }}>{outputConsole.expected || problem.examples[testCaseIdx].output}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: 11, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
                        {outputConsole.stdout}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#475569' }}>
                      Click <strong>"Run Code"</strong> to test against Case {testCaseIdx + 1}, or <strong>"Submit"</strong> to evaluate against all test cases.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
