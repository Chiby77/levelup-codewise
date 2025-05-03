
export const csTopics = {
  fetchDecodeExecute: {
    topic: "Fetch-Decode-Execute Cycle",
    keywords: ["fetch", "decode", "execute", "cycle", "cpu"],
    explanation: `The Fetch-Decode-Execute cycle is the fundamental operation cycle of a CPU:

1. Fetch: The CPU retrieves the next instruction from memory using the Program Counter (PC)
2. Decode: The Control Unit interprets the instruction to determine the required operation
3. Execute: The Arithmetic Logic Unit (ALU) performs the actual computation or data manipulation
4. Update: The Program Counter is incremented to point to the next instruction

This cycle repeats continuously as the computer runs programs, with each cycle handling one machine instruction.`
  },
  logicGates: {
    topic: "Logic Gates",
    keywords: ["gate", "logic", "circuit", "boolean"],
    explanation: `Logic gates are fundamental building blocks of digital circuits that implement Boolean functions:

• AND gate: Output is 1 only when all inputs are 1
• OR gate: Output is 1 if at least one input is 1
• NOT gate: Inverts the input (1 becomes 0, 0 becomes 1)
• NAND gate: Combination of AND followed by NOT
• NOR gate: Combination of OR followed by NOT
• XOR gate: Output is 1 when inputs are different

These gates are combined to create complex digital circuits for arithmetic operations, memory storage, and control logic in computers.`
  },
  interrupts: {
    topic: "Interrupts",
    keywords: ["interrupt", "signal", "handler", "isr", "execution"],
    explanation: `Interrupts are signals that temporarily halt the normal execution of a program to handle higher-priority events:

1. Interrupt Generation: External device or internal condition triggers an interrupt
2. CPU Completion: CPU finishes current instruction
3. State Saving: CPU saves its current state (registers, PC) to the stack
4. Interrupt Handling: CPU executes the Interrupt Service Routine (ISR) for that interrupt
5. State Restoration: After completion, the CPU restores its previous state
6. Resume Execution: Normal program execution continues

Interrupts improve system efficiency by allowing the CPU to respond to events without constant polling.`
  },
  numericalErrors: {
    topic: "Numerical Errors",
    keywords: ["overflow", "underflow", "error", "numerical", "precision"],
    explanation: `Two common numerical errors in computer systems:

• Overflow Error: Occurs when a computation produces a result too large for the allocated memory space. For example, trying to store 300 in an 8-bit unsigned integer (max 255) causes overflow.

• Underflow Error: Occurs when a floating-point number becomes too small to be represented, typically resulting in the value being rounded to zero. This happens with very small decimal numbers beyond the precision limit.

These errors can cause critical system failures if not properly handled through exception handling or boundary checks.`
  },
  databaseTheory: {
    topic: "Database Theory",
    keywords: ["database", "sql", "relational", "table", "normalization", "join"],
    explanation: `Relational database theory is built on these key concepts:

• Tables (Relations): Collections of rows and columns that store related data
• Primary Keys: Unique identifiers for each row in a table
• Foreign Keys: Fields that link to primary keys in other tables
• Normalization: The process of organizing data to minimize redundancy (1NF, 2NF, 3NF)
• SQL (Structured Query Language): The standard language for database operations:
  - SELECT: Retrieve data
  - INSERT: Add new records
  - UPDATE: Modify existing records
  - DELETE: Remove records
  - JOIN: Combine data from multiple tables

Proper database design ensures data integrity, reduces redundancy, and improves query performance.`
  },
  osiModel: {
    topic: "OSI Model",
    keywords: ["osi", "layer", "network", "protocol", "tcp/ip"],
    explanation: `The OSI (Open Systems Interconnection) model has seven layers:

1. Physical Layer: Transmits raw bit stream over physical medium (cables, electrical signals)
2. Data Link Layer: Provides node-to-node data transfer (MAC addresses, error detection)
3. Network Layer: Handles routing and forwarding of data packets (IP addresses)
4. Transport Layer: Provides end-to-end communication services (TCP, UDP)
5. Session Layer: Manages communication sessions between applications
6. Presentation Layer: Translates data format between applications (encryption, compression)
7. Application Layer: Interfaces directly with end-user applications (HTTP, FTP, SMTP)

The TCP/IP model is a simplified version with four layers: Network Interface, Internet, Transport, and Application.`
  },
  dataStructures: {
    topic: "Data Structures",
    keywords: ["data structure", "algorithm", "array", "linked list", "tree", "graph", "queue", "stack", "heap", "hash"],
    explanation: `Key data structures in computer science:

• Arrays: Fixed-size sequential collection of elements accessed by index
• Linked Lists: Dynamic collection of elements with pointers to the next element
• Stacks: LIFO (Last-In-First-Out) structure with push and pop operations
• Queues: FIFO (First-In-First-Out) structure with enqueue and dequeue operations
• Trees: Hierarchical structure with nodes and branches (Binary, AVL, B-trees)
• Graphs: Collections of nodes (vertices) connected by edges

Algorithm complexity is measured using Big O notation:
• O(1): Constant time (direct access)
• O(log n): Logarithmic time (binary search)
• O(n): Linear time (simple iteration)
• O(n log n): Log-linear time (efficient sorting algorithms)
• O(n²): Quadratic time (nested loops)
• O(2ⁿ): Exponential time (recursive algorithms)`
  },
  computerSecurity: {
    topic: "Computer Security and Ethics",
    keywords: ["security", "ethics", "confidentiality", "integrity", "availability", "privacy", "hack"],
    explanation: `Computer security is built on three key principles:

• Confidentiality: Protecting information from unauthorized access
• Integrity: Ensuring data remains accurate and unaltered
• Availability: Maintaining reliable access to information

Ethical considerations in computing include:
• Privacy: Respecting individuals' personal information
• Intellectual Property: Honoring copyright and licensing
• Professional Conduct: Following codes of ethics
• Social Impact: Considering the broader effects of technology
• Cybersecurity Responsibility: Protecting systems and data

Security breaches can lead to data theft, financial loss, identity theft, and damage to reputation.`
  },
  visualBasic: {
    topic: "Visual Basic Programming",
    keywords: ["visual basic", "vb", "vba", "basic"],
    explanation: `Visual Basic programming fundamentals:

• Syntax: Based on BASIC with modern structured programming features
• Data Types: Integer, String, Double, Boolean, Date, Object
• Variables: Dim variableName As DataType
• Control Structures:
  - If/Then/Else for conditional execution
  - For/Next for counted loops
  - Do/Loop for conditional loops
  - Select Case for multiple conditions
• Event-Driven Programming: Code responds to user actions (clicks, inputs)
• Forms and Controls: Visual elements like buttons, textboxes that users interact with
• Procedures:
  - Sub procedures (no return value)
  - Function procedures (returns a value)

VB is particularly useful for building Windows applications with GUIs and database connectivity.`
  },
  dataStructuresDynamic: {
    topic: "Dynamic vs Static Data Structures",
    keywords: ["dynamic", "static", "structure", "memory", "allocation"],
    explanation: `Data structures can be classified as either dynamic or static based on their memory allocation and size flexibility:

**Dynamic Data Structures**
• Size can increase or decrease during program execution
• Examples: Linked Lists, Binary Trees, Graphs, Stacks and Queues (when implemented with linked lists)
• Memory is allocated at runtime (heap memory)
• Advantages:
  - Efficient memory utilization
  - No size limitations (except total available memory)
  - No overflow until memory is exhausted
• Disadvantages:
  - More complex implementation
  - Slower access times (compared to static)
  - Require pointers or references

**Static Data Structures**
• Fixed size determined at compile time
• Examples: Arrays, Structures
• Memory is allocated at compile time (stack memory)
• Advantages:
  - Simpler to implement
  - Faster access with direct indexing
  - Better cache performance
• Disadvantages:
  - May waste memory if not fully utilized
  - Size must be predetermined
  - Possibility of overflow errors

The choice between dynamic and static structures depends on your application's needs regarding memory efficiency, access speed, and flexibility.`
  },
  binaryTrees: {
    topic: "Binary Trees",
    keywords: ["binary", "tree", "traversal", "node", "bst"],
    explanation: `A binary tree is a hierarchical data structure where each node has at most two children (left child and right child):

**Key Properties**:
• Each node contains a value and pointers to left and right children
• The left subtree contains nodes with values less than the parent node
• The right subtree contains nodes with values greater than the parent node

**Tree Traversal Methods**:
1. **In-order**: Left → Root → Right (gives sorted output for BST)
2. **Pre-order**: Root → Left → Right (useful for copying trees)
3. **Post-order**: Left → Right → Root (useful for deletion)
4. **Level-order**: Level by level from top to bottom

**Operations**:
• **Insertion**: Compare with root, traverse left/right based on comparison, insert at first null position
• **Deletion**: 
  - Leaf node: Remove directly
  - One child: Replace with child
  - Two children: Replace with in-order successor (smallest in right subtree) or predecessor
• **Search**: Start at root, traverse left/right based on comparison

**Applications**:
• Expression evaluation and syntax parsing
• File system directories
• Database indexing
• Decision trees in machine learning
• Priority queues`
  },
  // Additional topics continued in the same pattern...
};
