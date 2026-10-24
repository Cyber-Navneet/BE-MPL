// Reusable assessment question bank. Every question is tagged with a skill and difficulty.
// MCQs are worth 1 point. Short-answer questions carry their own points and are graded by
// src/utils/answerEvaluator.js using `acceptedAnswers` (exact match after normalising) and/or
// a `rubric` of regex criteria tested against the normalised (lower-cased) answer.
// `partialCredit: true` lets rubric criteria add up; otherwise all criteria are needed.
// `reviewIfUnmatched: true` flags free-form code answers that score 0 for manual review,
// since a correct answer may be written in a form the rubric doesn't recognise.

const slug = (skill) => skill.toLowerCase().replace(/[^a-z0-9]+/g, '-')

function bank(skill, mcqs, shortAnswers = []) {
  return [
    ...mcqs.map(([difficulty, question, options, answerIndex, explanation], index) => ({
      id: `${slug(skill)}-m${index + 1}`,
      type: 'mcq',
      skill,
      difficulty,
      question,
      options,
      correctAnswer: options[answerIndex],
      points: 1,
      explanation,
    })),
    ...shortAnswers.map((question, index) => ({
      id: `${slug(skill)}-s${index + 1}`,
      type: 'short_answer',
      skill,
      partialCredit: false,
      reviewIfUnmatched: false,
      acceptedAnswers: [],
      rubric: [],
      ...question,
    })),
  ]
}

export const QUESTION_BANK = [
  ...bank(
    'JavaScript',
    [
      ['Easy', 'Which keyword declares a block-scoped variable that can be reassigned?', ['var', 'let', 'define', 'static'], 1, '`let` is block-scoped and reassignable; `var` is function-scoped.'],
      ['Easy', 'What does `typeof null` return?', ['"null"', '"undefined"', '"object"', '"number"'], 2, 'A long-standing quirk: `typeof null` is "object".'],
      ['Easy', 'Which method adds an element to the end of an array?', ['push()', 'shift()', 'unshift()', 'pop()'], 0, '`push()` appends; `unshift()` adds to the start.'],
      ['Intermediate', 'What is the result of `0.1 + 0.2 === 0.3`?', ['true', 'false', 'TypeError', 'undefined'], 1, 'Floating-point rounding makes the sum 0.30000000000000004.'],
      ['Intermediate', 'Which statement about `===` is correct?', ['It converts types before comparing', 'It compares value and type without coercion', 'It only works on numbers', 'It compares object contents deeply'], 1, 'Strict equality does not coerce types.'],
      ['Intermediate', 'What does `Promise.all` do if one of the promises rejects?', ['Ignores the rejection', 'Waits for all, then resolves', 'Rejects immediately with that reason', 'Retries the failed promise'], 2, '`Promise.all` rejects as soon as any input promise rejects.'],
      ['Intermediate', 'What will `[1, 2, 3].map(n => n * 2)` return?', ['[1, 2, 3]', '[2, 4, 6]', '6', 'undefined'], 1, '`map` returns a new array with each element transformed.'],
      ['Hard', 'In a regular (non-arrow) function called as `obj.method()`, what is `this`?', ['The global object', '`undefined`', '`obj`', 'The function itself'], 2, 'For a method call, `this` is the object before the dot.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Write a JavaScript function named `sum` that takes two numbers `a` and `b` and returns their sum.',
        expectedAnswer: 'function sum(a, b) { return a + b; }',
        evaluationCriteria: ['Defines a function named sum', 'Accepts two parameters a and b', 'Returns a + b'],
        rubric: [
          { label: 'Defines a function named sum', points: 1, pattern: /(function\s+sum\s*\(|(const|let|var)\s+sum\s*=)/ },
          { label: 'Accepts two parameters a and b', points: 1, pattern: /\(\s*a\s*,\s*b\s*\)/ },
          { label: 'Returns a + b', points: 1, pattern: /(return\s+a\s*\+\s*b|=>\s*\(?\s*a\s*\+\s*b)/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 3,
        explanation: 'Any function declaration or arrow function named sum that returns a + b is correct.',
      },
      {
        difficulty: 'Intermediate',
        question: 'Using `filter`, write an expression that keeps only the even numbers from an array named `nums`.',
        expectedAnswer: 'nums.filter(n => n % 2 === 0)',
        evaluationCriteria: ['Calls nums.filter', 'Checks divisibility by 2 with % 2 compared to 0'],
        rubric: [
          { label: 'Calls nums.filter', points: 1, pattern: /nums\.filter\s*\(/ },
          { label: 'Checks n % 2 === 0', points: 1, pattern: /%\s*2\s*={2,3}\s*0|!\s*\(?\s*\w+\s*%\s*2/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 2,
        explanation: '`filter` keeps elements whose callback returns true; `n % 2 === 0` tests for even numbers.',
      },
    ],
  ),
  ...bank(
    'TypeScript',
    [
      ['Easy', 'What is TypeScript?', ['A CSS preprocessor', 'A typed superset of JavaScript', 'A JavaScript runtime', 'A database query language'], 1, 'TypeScript adds static types and compiles to JavaScript.'],
      ['Easy', 'Which type represents a value that can be any type and disables type checking?', ['unknown', 'never', 'any', 'void'], 2, '`any` opts out of type checking; `unknown` forces narrowing first.'],
      ['Intermediate', 'What does the `?` in `name?: string` mean inside an interface?', ['The property is readonly', 'The property is optional', 'The property is private', 'The property can be null only'], 1, 'A `?` marks an optional property.'],
      ['Intermediate', 'Which keyword creates a union of types?', ['&', '|', 'extends', 'implements'], 1, '`A | B` is a union; `A & B` is an intersection.'],
      ['Intermediate', 'What is the return type of a function that never returns (e.g. always throws)?', ['void', 'undefined', 'never', 'null'], 2, '`never` represents values that never occur.'],
      ['Hard', 'What does `Partial<User>` produce?', ['A type with all User properties required', 'A type with all User properties optional', 'A type with only User methods', 'An array of User'], 1, '`Partial<T>` makes every property of T optional.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Declare a variable `count` with an explicit `number` type annotation, initialised to 0.',
        expectedAnswer: 'let count: number = 0;',
        evaluationCriteria: ['Declares count with let/const', 'Annotates the type as number', 'Initialises it to 0'],
        rubric: [{ label: 'Declares count: number = 0', points: 2, pattern: /\b(let|const|var)\s+count\s*:\s*number\s*=\s*0\b/ }],
        points: 2,
        explanation: 'A type annotation follows the variable name after a colon.',
      },
    ],
  ),
  ...bank(
    'React',
    [
      ['Easy', 'Which hook adds local state to a function component?', ['useEffect', 'useState', 'useRef', 'useMemo'], 1, '`useState` returns a state value and a setter.'],
      ['Easy', 'What must a list of elements rendered with `map` have for efficient updates?', ['A unique `key` prop', 'An `id` attribute', 'A `ref`', 'A `className`'], 0, 'Keys let React match list items between renders.'],
      ['Easy', 'How do you pass data from a parent component to a child?', ['Through state', 'Through props', 'Through refs only', 'Through the DOM'], 1, 'Props are the inputs a parent passes to a child.'],
      ['Intermediate', 'When does an effect with an empty dependency array (`useEffect(fn, [])`) run?', ['On every render', 'Only after the first render (mount)', 'Never', 'Only on unmount'], 1, 'An empty array means the effect has no dependencies that change.'],
      ['Intermediate', 'What is the main purpose of `useMemo`?', ['To store DOM references', 'To memoise an expensive computed value', 'To fetch data', 'To create context'], 1, '`useMemo` recomputes only when its dependencies change.'],
      ['Intermediate', 'Why should state not be mutated directly (e.g. `state.items.push(x)`)?', ['It throws an error', 'React may not detect the change and re-render', 'It deletes the state', 'It is slower to type'], 1, 'React compares references; mutating keeps the same reference.'],
      ['Intermediate', 'What is "lifting state up"?', ['Moving state to the closest common parent of components that need it', 'Storing state in localStorage', 'Using global variables', 'Moving state into a child'], 0, 'Shared state lives in the nearest common ancestor.'],
      ['Hard', 'Which tool avoids passing props through many intermediate components?', ['useReducer', 'Context', 'Fragments', 'Portals'], 1, 'Context provides values to any descendant without prop drilling.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Name the React hook used to run side effects such as fetching data after render.',
        expectedAnswer: 'useEffect',
        acceptedAnswers: ['useeffect', 'useeffect()', 'react.useeffect'],
        evaluationCriteria: ['Names the useEffect hook'],
        points: 2,
        explanation: '`useEffect` runs after render and is used for side effects.',
      },
    ],
  ),
  ...bank(
    'HTML',
    [
      ['Easy', 'Which element represents the most important heading on a page?', ['<head>', '<h1>', '<header>', '<title>'], 1, '`<h1>` is the top-level heading; `<head>` holds metadata.'],
      ['Easy', 'Which attribute provides alternative text for an image?', ['title', 'src', 'alt', 'caption'], 2, '`alt` text is read by screen readers and shown if the image fails.'],
      ['Easy', 'Which element creates a hyperlink?', ['<link>', '<a>', '<href>', '<nav>'], 1, '`<a href="...">` creates a link; `<link>` loads resources.'],
      ['Intermediate', 'Which element should contain the main, unique content of a page?', ['<section>', '<div>', '<main>', '<article>'], 2, 'A page should have one `<main>` landmark.'],
      ['Intermediate', 'How do you associate a `<label>` with an input?', ['Wrap the label in the input', 'Use the label `for` attribute matching the input `id`', 'Use the `name` attribute only', 'Use `aria-hidden`'], 1, '`for`/`id` (or wrapping the input) links label and control.'],
      ['Intermediate', 'Which input type shows a numeric keypad on most mobile devices?', ['type="text"', 'type="number"', 'type="search"', 'type="range"'], 1, '`type="number"` (or `inputmode="numeric"`) triggers a numeric keypad.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Which semantic HTML element should wrap a page’s primary navigation links?',
        expectedAnswer: 'nav',
        acceptedAnswers: ['nav', '<nav>', '<nav></nav>', 'nav element', 'the nav element'],
        evaluationCriteria: ['Names the nav element'],
        points: 2,
        explanation: '`<nav>` marks a navigation landmark for assistive technology.',
      },
    ],
  ),
  ...bank(
    'CSS',
    [
      ['Easy', 'Which property changes the text colour?', ['font-color', 'text-color', 'color', 'foreground'], 2, 'The `color` property sets text colour.'],
      ['Easy', 'In the box model, which property adds space inside the border?', ['margin', 'padding', 'outline', 'gap'], 1, 'Padding is inside the border; margin is outside.'],
      ['Easy', 'Which selector targets an element with `id="header"`?', ['.header', '#header', 'header', '*header'], 1, '`#` selects by id; `.` selects by class.'],
      ['Intermediate', 'What does `box-sizing: border-box` do?', ['Removes borders', 'Includes padding and border in the element’s width and height', 'Adds a shadow', 'Makes the element inline'], 1, 'Width then covers content, padding and border together.'],
      ['Intermediate', 'Which flexbox property aligns items along the main axis?', ['align-items', 'justify-content', 'flex-wrap', 'align-content'], 1, '`justify-content` works on the main axis; `align-items` on the cross axis.'],
      ['Intermediate', 'Which `position` value keeps an element fixed to the viewport while scrolling?', ['relative', 'absolute', 'fixed', 'static'], 2, '`fixed` positions relative to the viewport.'],
      ['Hard', 'Which selector has the highest specificity?', ['div p', '.card .title', '#main', 'p:hover'], 2, 'An id selector outweighs classes, pseudo-classes and elements.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Write the CSS declaration that turns a container into a flexbox container.',
        expectedAnswer: 'display: flex;',
        evaluationCriteria: ['Uses display: flex'],
        rubric: [{ label: 'Uses display: flex', points: 2, pattern: /display\s*:\s*(inline-)?flex\b/ }],
        points: 2,
        explanation: '`display: flex` makes the element a flex container.',
      },
    ],
  ),
  ...bank(
    'REST APIs',
    [
      ['Easy', 'Which HTTP status code means "Not Found"?', ['200', '301', '404', '500'], 2, '404 means the resource does not exist.'],
      ['Easy', 'Which HTTP method is typically used to create a new resource?', ['GET', 'POST', 'DELETE', 'HEAD'], 1, 'POST usually creates a resource in a collection.'],
      ['Easy', 'What does the status code 201 indicate?', ['Created', 'No Content', 'Unauthorized', 'Bad Request'], 0, '201 Created confirms a new resource was created.'],
      ['Intermediate', 'Which method should be idempotent and replace a resource entirely?', ['POST', 'PATCH', 'PUT', 'CONNECT'], 2, 'PUT replaces the resource and repeating it has the same effect.'],
      ['Intermediate', 'What does "stateless" mean in REST?', ['The server stores no data', 'Each request contains all information needed to process it', 'Responses cannot be cached', 'Only GET is allowed'], 1, 'The server keeps no client session between requests.'],
      ['Intermediate', 'Which status code fits a request with missing or invalid authentication?', ['401', '403', '409', '422'], 0, '401 Unauthorized means authentication is required or failed.'],
      ['Intermediate', 'Which is the most RESTful URL for fetching order 42 of user 7?', ['/getOrder?user=7&id=42', '/users/7/orders/42', '/orders/getById/42', '/user-orders-7-42'], 1, 'Resources are nouns arranged hierarchically.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Name the HTTP method generally used to retrieve a resource from a REST API.',
        expectedAnswer: 'GET',
        acceptedAnswers: ['get', 'http get', 'get method', 'the get method'],
        evaluationCriteria: ['Names the GET method'],
        points: 2,
        explanation: 'GET retrieves a representation of a resource without changing it.',
      },
    ],
  ),
  ...bank(
    'Git',
    [
      ['Easy', 'Which command records staged changes in the repository history?', ['git add', 'git commit', 'git push', 'git status'], 1, '`git commit` saves a snapshot of the staged changes.'],
      ['Easy', 'Which command shows changed and staged files?', ['git log', 'git status', 'git diff --stat', 'git show'], 1, '`git status` summarises the working tree and staging area.'],
      ['Easy', 'Which command downloads remote changes and merges them into the current branch?', ['git fetch', 'git clone', 'git pull', 'git push'], 2, '`git pull` = fetch + merge (or rebase).'],
      ['Intermediate', 'What does `git fetch` do?', ['Downloads remote changes without merging', 'Deletes local branches', 'Uploads commits', 'Discards local changes'], 0, '`fetch` updates remote-tracking branches only.'],
      ['Intermediate', 'Which file lists paths Git should not track?', ['.gitconfig', '.gitignore', '.gitkeep', '.gitattributes'], 1, '`.gitignore` contains patterns of untracked files to ignore.'],
      ['Intermediate', 'What is a merge conflict?', ['A failed network push', 'Two branches changed the same lines differently', 'A missing remote', 'A detached HEAD'], 1, 'Git cannot decide which competing change to keep.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Write the Git command that creates a new branch named `feature` and switches to it.',
        expectedAnswer: 'git checkout -b feature',
        acceptedAnswers: ['git checkout -b feature', 'git switch -c feature', 'git switch --create feature'],
        evaluationCriteria: ['Creates the branch', 'Switches to it in one command'],
        points: 2,
        explanation: '`git checkout -b` and `git switch -c` both create and switch.',
      },
    ],
  ),
  ...bank(
    'SQL',
    [
      ['Easy', 'Which clause filters rows before grouping?', ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'], 1, '`WHERE` filters rows; `HAVING` filters groups.'],
      ['Easy', 'Which statement removes rows from a table?', ['DROP', 'DELETE', 'REMOVE', 'TRUNCATE COLUMN'], 1, '`DELETE` removes rows; `DROP` removes the table.'],
      ['Easy', 'Which keyword sorts the result set?', ['SORT BY', 'GROUP BY', 'ORDER BY', 'ARRANGE BY'], 2, '`ORDER BY` sorts ascending by default.'],
      ['Intermediate', 'Which join returns only rows with matching values in both tables?', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'], 2, 'INNER JOIN keeps only matching rows.'],
      ['Intermediate', 'What does a PRIMARY KEY guarantee?', ['Values are unique and not null', 'Values are encrypted', 'Values are sorted', 'Values reference another table'], 0, 'A primary key uniquely identifies each row.'],
      ['Intermediate', 'Which function returns the number of rows in a group?', ['SUM()', 'COUNT()', 'MAX()', 'LEN()'], 1, '`COUNT()` counts rows (or non-null values).'],
      ['Intermediate', 'Which clause filters the results of `GROUP BY`?', ['WHERE', 'HAVING', 'FILTER', 'LIMIT'], 1, '`HAVING` applies conditions to aggregated groups.'],
      ['Hard', 'What is the main purpose of an index?', ['To enforce foreign keys', 'To speed up lookups at the cost of extra storage and slower writes', 'To back up data', 'To sort data on disk permanently'], 1, 'Indexes make reads faster but add write overhead.'],
      ['Hard', 'A LEFT JOIN from customers to orders returns what for customers with no orders?', ['Nothing', 'An error', 'The customer with NULL order columns', 'A duplicate row'], 2, 'LEFT JOIN keeps all left rows, filling missing right columns with NULL.'],
    ],
    [
      {
        difficulty: 'Intermediate',
        question: 'Write an SQL query to retrieve all columns for employees whose salary is greater than 50000 from the `employees` table.',
        expectedAnswer: 'SELECT * FROM employees WHERE salary > 50000;',
        evaluationCriteria: ['Uses SELECT … FROM employees', 'Filters with a WHERE clause', 'Applies the condition salary > 50000'],
        rubric: [
          { label: 'Uses SELECT … FROM employees', points: 1, pattern: /\bselect\b[\s\S]+\bfrom\s+employees\b/ },
          { label: 'Filters with a WHERE clause', points: 1, pattern: /\bwhere\b/ },
          { label: 'Applies the condition salary > 50000', points: 1, pattern: /\bwhere\b[\s\S]*\bsalary\s*>\s*50,?000\b/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 3,
        explanation: 'SELECT the columns FROM the table and filter rows WHERE salary > 50000.',
      },
      {
        difficulty: 'Intermediate',
        question: 'Write an SQL query that returns each `customer_id` with the number of orders they placed, from the `orders` table.',
        expectedAnswer: 'SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id;',
        evaluationCriteria: ['Selects customer_id with COUNT(...)', 'Reads from the orders table', 'Groups by customer_id'],
        rubric: [
          { label: 'Selects customer_id with COUNT(...)', points: 1, pattern: /\bselect\b[\s\S]*customer_id[\s\S]*\bcount\s*\(|\bselect\b[\s\S]*\bcount\s*\([\s\S]*customer_id/ },
          { label: 'Reads from the orders table', points: 1, pattern: /\bfrom\s+orders\b/ },
          { label: 'Groups by customer_id', points: 1, pattern: /\bgroup\s+by\s+customer_id\b/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 3,
        explanation: 'Aggregate with COUNT and GROUP BY the customer.',
      },
    ],
  ),
  ...bank(
    'Java',
    [
      ['Easy', 'Which method is the entry point of a standalone Java application?', ['start()', 'main()', 'run()', 'init()'], 1, '`public static void main(String[] args)` is the entry point.'],
      ['Easy', 'Which of these is a primitive type in Java?', ['String', 'Integer', 'int', 'ArrayList'], 2, '`int` is primitive; `Integer` is its wrapper class.'],
      ['Easy', 'Which keyword creates a new object?', ['create', 'new', 'make', 'this'], 1, '`new` allocates and constructs an object.'],
      ['Intermediate', 'Which collection does NOT allow duplicate elements?', ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], 2, 'A `Set` stores unique elements.'],
      ['Intermediate', 'What is the difference between `==` and `.equals()` for Strings?', ['No difference', '`==` compares references; `.equals()` compares content', '`.equals()` compares references', '`==` is not allowed on Strings'], 1, 'Use `.equals()` to compare string contents.'],
      ['Intermediate', 'Which exception type must be declared or handled (checked)?', ['NullPointerException', 'ArithmeticException', 'IOException', 'IndexOutOfBoundsException'], 2, '`IOException` is checked; the others are unchecked runtime exceptions.'],
      ['Intermediate', 'Which block always executes after try/catch, whether or not an exception occurred?', ['final', 'finally', 'finalize', 'catch-all'], 1, '`finally` runs after try/catch (except on JVM exit).'],
      ['Hard', 'Which map keeps keys in sorted order?', ['HashMap', 'LinkedHashMap', 'TreeMap', 'Hashtable'], 2, '`TreeMap` orders keys by natural order or a comparator.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Write a short Java method `isEven(int n)` that returns true when `n` is even.',
        expectedAnswer: 'boolean isEven(int n) { return n % 2 == 0; }',
        evaluationCriteria: ['Declares a boolean method taking an int', 'Checks divisibility by 2', 'Returns the result'],
        rubric: [
          { label: 'Declares a boolean method taking an int', points: 1, pattern: /\bboolean\s+\w+\s*\(\s*int\s+\w+\s*\)/ },
          { label: 'Checks divisibility by 2', points: 1, pattern: /%\s*2\s*==\s*0|&\s*1\s*\)?\s*==\s*0/ },
          { label: 'Returns the result', points: 1, pattern: /\breturn\b/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 3,
        explanation: 'A number is even when n % 2 == 0.',
      },
      {
        difficulty: 'Easy',
        question: 'Which Java keyword does a class use to inherit from another class?',
        expectedAnswer: 'extends',
        acceptedAnswers: ['extends', 'the extends keyword'],
        evaluationCriteria: ['Names the extends keyword'],
        points: 2,
        explanation: '`class Dog extends Animal` inherits from Animal; `implements` is for interfaces.',
      },
    ],
  ),
  ...bank(
    'Spring Boot',
    [
      ['Easy', 'Which annotation marks the main class of a Spring Boot application?', ['@SpringBootApplication', '@EnableBoot', '@MainApplication', '@Configuration only'], 0, '`@SpringBootApplication` combines configuration, auto-configuration and component scanning.'],
      ['Easy', 'Which annotation maps HTTP GET requests to a handler method?', ['@PostMapping', '@GetMapping', '@RequestBody', '@PathVariable'], 1, '`@GetMapping` is a shortcut for GET request mappings.'],
      ['Intermediate', 'Which annotation injects a dependency managed by Spring?', ['@Inject only', '@Autowired', '@Bean', '@Value'], 1, '`@Autowired` (or constructor injection) wires a bean.'],
      ['Intermediate', 'Which file commonly holds Spring Boot configuration properties?', ['web.xml', 'application.properties', 'pom.properties', 'spring.config'], 1, '`application.properties` or `application.yml`.'],
      ['Intermediate', 'Which annotation binds a URL segment like `/users/{id}` to a method parameter?', ['@RequestParam', '@PathVariable', '@RequestHeader', '@ModelAttribute'], 1, '`@PathVariable` extracts values from the URI path.'],
      ['Hard', 'What does Spring Data JPA’s `JpaRepository` provide?', ['HTML templates', 'Ready-made CRUD and paging methods for an entity', 'Security filters', 'Message queues'], 1, 'Extending `JpaRepository` gives CRUD, paging and sorting.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Which annotation marks a class as a REST controller whose methods return response bodies?',
        expectedAnswer: '@RestController',
        acceptedAnswers: ['@restcontroller', 'restcontroller'],
        evaluationCriteria: ['Names @RestController'],
        points: 2,
        explanation: '`@RestController` = `@Controller` + `@ResponseBody`.',
      },
    ],
  ),
  ...bank(
    'Node.js',
    [
      ['Easy', 'Node.js runs JavaScript using which engine?', ['SpiderMonkey', 'V8', 'Chakra', 'JavaScriptCore'], 1, 'Node.js is built on Chrome’s V8 engine.'],
      ['Easy', 'Which file lists a Node project’s dependencies and scripts?', ['node.config', 'package.json', 'index.js', '.npmrc'], 1, '`package.json` describes the project and its dependencies.'],
      ['Intermediate', 'What makes Node.js well suited to I/O-heavy workloads?', ['Multi-threaded request handling', 'A non-blocking, event-driven I/O model', 'Built-in SQL support', 'Compiled machine code'], 1, 'The event loop handles many concurrent I/O operations.'],
      ['Intermediate', 'In Express, what is middleware?', ['A database driver', 'A function with access to req, res and next', 'A template engine', 'A CSS framework'], 1, 'Middleware can modify the request/response or call `next()`.'],
      ['Intermediate', 'How do you read an environment variable `PORT` in Node.js?', ['env.PORT', 'process.env.PORT', 'os.PORT', 'global.PORT'], 1, 'Environment variables live on `process.env`.'],
      ['Hard', 'Which runs first in the Node.js event loop?', ['setTimeout(fn, 0)', 'process.nextTick(fn)', 'setImmediate(fn)', 'An I/O callback'], 1, '`process.nextTick` callbacks run before the loop continues.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Name the built-in Node.js module used to read and write files.',
        expectedAnswer: 'fs',
        acceptedAnswers: ['fs', 'node:fs', 'fs/promises', 'node:fs/promises', 'fs module', 'the fs module'],
        evaluationCriteria: ['Names the fs module'],
        points: 2,
        explanation: 'The `fs` module provides file-system APIs.',
      },
    ],
  ),
  ...bank(
    'Python',
    [
      ['Easy', 'Which keyword defines a function in Python?', ['func', 'def', 'function', 'lambda only'], 1, '`def name():` defines a function.'],
      ['Easy', 'Which data type is immutable?', ['list', 'dict', 'tuple', 'set'], 2, 'Tuples cannot be changed after creation.'],
      ['Easy', 'What does `len([1, 2, 3])` return?', ['2', '3', '4', 'An error'], 1, '`len` returns the number of items.'],
      ['Intermediate', 'What is the output of `"Hello"[1]`?', ['H', 'e', 'l', 'An error'], 1, 'Strings are zero-indexed.'],
      ['Intermediate', 'Which statement handles exceptions?', ['try/except', 'try/catch', 'do/rescue', 'begin/end'], 0, 'Python uses `try` / `except`.'],
      ['Intermediate', 'What does a dictionary’s `.get("key", 0)` return if "key" is missing?', ['None', 'KeyError', '0', '"key"'], 2, 'The second argument is the default value.'],
      ['Hard', 'What is a Python generator?', ['A class factory', 'A function that yields values lazily', 'A random number tool', 'A compiled module'], 1, 'Generators use `yield` and produce values on demand.'],
    ],
    [
      {
        difficulty: 'Intermediate',
        question: 'Write a Python list comprehension that produces the squares of the numbers 1 to 5.',
        expectedAnswer: '[x ** 2 for x in range(1, 6)]',
        evaluationCriteria: ['Uses list comprehension syntax', 'Iterates over range(1, 6)', 'Squares each value'],
        rubric: [
          { label: 'Uses list comprehension syntax', points: 1, pattern: /\[[^\]]*\bfor\s+\w+\s+in\b[^\]]*\]/ },
          { label: 'Iterates over range(1, 6)', points: 1, pattern: /range\s*\(\s*1\s*,\s*6\s*\)|\[\s*1\s*,\s*2\s*,\s*3\s*,\s*4\s*,\s*5\s*\]/ },
          { label: 'Squares each value', points: 1, pattern: /(\w+)\s*\*\*\s*2|(\w+)\s*\*\s*\2\b|pow\s*\(\s*\w+\s*,\s*2\s*\)/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 3,
        explanation: 'A comprehension like `[x ** 2 for x in range(1, 6)]` returns [1, 4, 9, 16, 25].',
      },
    ],
  ),
  ...bank(
    'MongoDB',
    [
      ['Easy', 'What kind of database is MongoDB?', ['Relational', 'Document-oriented NoSQL', 'Graph', 'Key-value only'], 1, 'MongoDB stores JSON-like documents.'],
      ['Easy', 'What is a group of documents called in MongoDB?', ['Table', 'Collection', 'Schema', 'Row set'], 1, 'Documents are stored in collections.'],
      ['Intermediate', 'Which field does every MongoDB document have as its primary key?', ['id', '_id', 'key', 'uuid'], 1, 'MongoDB adds a unique `_id` by default.'],
      ['Intermediate', 'Which operator matches values greater than a given value?', ['$gte only', '$gt', '$more', '$above'], 1, '`$gt` = greater than; `$gte` = greater than or equal.'],
      ['Intermediate', 'Which method inserts multiple documents at once?', ['insertOne()', 'insertMany()', 'addAll()', 'bulkAdd()'], 1, '`insertMany()` takes an array of documents.'],
      ['Hard', 'What is the aggregation pipeline used for?', ['Backups', 'Transforming and summarising documents in stages', 'User authentication', 'Sharding keys'], 1, 'Stages like `$match` and `$group` process documents in sequence.'],
    ],
    [
      {
        difficulty: 'Intermediate',
        question: 'Write a MongoDB shell query that finds all documents in the `users` collection where `age` is greater than 25.',
        expectedAnswer: 'db.users.find({ age: { $gt: 25 } })',
        evaluationCriteria: ['Calls db.users.find', 'Filters age with $gt: 25'],
        rubric: [
          { label: 'Calls db.users.find', points: 1, pattern: /db\.users\.find\s*\(/ },
          { label: 'Filters age with $gt: 25', points: 2, pattern: /["']?age["']?\s*:\s*\{\s*["']?\$gt["']?\s*:\s*25\s*\}/ },
        ],
        partialCredit: true,
        reviewIfUnmatched: true,
        points: 3,
        explanation: 'Use a filter document with the `$gt` operator.',
      },
    ],
  ),
  ...bank(
    'Docker',
    [
      ['Easy', 'What is a Docker image?', ['A running container', 'A read-only template used to create containers', 'A virtual machine', 'A log file'], 1, 'Containers are running instances of images.'],
      ['Easy', 'Which file defines how to build a Docker image?', ['docker.yml', 'Dockerfile', 'compose.json', 'image.cfg'], 1, 'A `Dockerfile` lists build instructions.'],
      ['Intermediate', 'Which Dockerfile instruction sets the base image?', ['RUN', 'FROM', 'CMD', 'COPY'], 1, '`FROM` must come first and names the base image.'],
      ['Intermediate', 'Which flag maps host port 8080 to container port 80?', ['-v 8080:80', '-p 8080:80', '-e 8080:80', '--link 8080:80'], 1, '`-p host:container` publishes ports.'],
      ['Intermediate', 'What does Docker Compose help with?', ['Writing Dockerfiles', 'Running multi-container applications from one config file', 'Pushing to Git', 'Monitoring CPU'], 1, 'Compose defines and runs multi-container apps.'],
      ['Hard', 'Why use multi-stage builds?', ['To run containers in parallel', 'To produce smaller final images without build tools', 'To share volumes', 'To enable networking'], 1, 'Build in one stage, copy only artifacts into a slim final stage.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Write the Docker command that lists the running containers.',
        expectedAnswer: 'docker ps',
        acceptedAnswers: ['docker ps', 'docker container ls', 'docker container list'],
        evaluationCriteria: ['Uses docker ps (or docker container ls)'],
        points: 2,
        explanation: '`docker ps` lists running containers; add `-a` for all.',
      },
    ],
  ),
  ...bank(
    'OOP',
    [
      ['Easy', 'What is a class?', ['An instance of an object', 'A blueprint for creating objects', 'A function', 'A variable type only'], 1, 'Objects are created from classes.'],
      ['Easy', 'Which principle lets a subclass reuse code from a parent class?', ['Encapsulation', 'Inheritance', 'Abstraction', 'Composition'], 1, 'Inheritance shares behaviour from a parent class.'],
      ['Intermediate', 'What is polymorphism?', ['Hiding data', 'One interface, many implementations', 'Copying objects', 'Using many classes in one file'], 1, 'The same call can behave differently depending on the object.'],
      ['Intermediate', 'Method overloading means…', ['Same method name, different parameter lists', 'Redefining a parent method in a subclass', 'Calling a method too often', 'A private method'], 0, 'Overriding is redefining in a subclass.'],
      ['Intermediate', 'What is an abstract class?', ['A class that cannot be instantiated directly', 'A class with no methods', 'A final class', 'A class with only static methods'], 0, 'Abstract classes are meant to be extended.'],
      ['Hard', 'Which principle suggests "favour composition over inheritance"?', ['It reduces tight coupling between classes', 'It makes code run faster', 'It removes the need for interfaces', 'It is required by Java'], 0, 'Composition keeps classes loosely coupled and flexible.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Name the OOP principle that hides an object’s internal state and exposes it only through methods.',
        expectedAnswer: 'Encapsulation',
        acceptedAnswers: ['encapsulation', 'data encapsulation'],
        evaluationCriteria: ['Names encapsulation'],
        points: 2,
        explanation: 'Encapsulation bundles data with the methods that control access to it.',
      },
    ],
  ),
  ...bank(
    'Data Structures & Algorithms',
    [
      ['Easy', 'Which data structure follows Last-In, First-Out (LIFO)?', ['Queue', 'Stack', 'Linked list', 'Tree'], 1, 'A stack removes the most recently added item first.'],
      ['Easy', 'Which data structure follows First-In, First-Out (FIFO)?', ['Stack', 'Queue', 'Heap', 'Graph'], 1, 'A queue removes the oldest item first.'],
      ['Intermediate', 'What is the average time complexity of looking up a key in a hash table?', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 0, 'Hashing gives constant time on average.'],
      ['Intermediate', 'What is the worst-case time complexity of bubble sort?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 2, 'Nested passes compare pairs repeatedly.'],
      ['Intermediate', 'Which traversal visits a binary search tree’s nodes in sorted order?', ['Pre-order', 'In-order', 'Post-order', 'Level-order'], 1, 'In-order visits left, node, right.'],
      ['Intermediate', 'Which algorithm finds the shortest path in an unweighted graph?', ['Depth-first search', 'Breadth-first search', 'Binary search', 'Quick sort'], 1, 'BFS explores level by level.'],
      ['Hard', 'What is the time complexity of merge sort in all cases?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 1, 'Merge sort always splits and merges in O(n log n).'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'What is the time complexity of binary search on a sorted array? (Use Big-O notation.)',
        expectedAnswer: 'O(log n)',
        acceptedAnswers: ['o(log n)', 'o(logn)', 'o(log(n))', 'o(log2 n)', 'o(log_2 n)', 'log n', 'logarithmic'],
        evaluationCriteria: ['States O(log n)'],
        points: 2,
        explanation: 'Each step halves the search space.',
      },
    ],
  ),
  ...bank(
    'AWS',
    [
      ['Easy', 'Which AWS service provides virtual servers?', ['S3', 'EC2', 'RDS', 'IAM'], 1, 'EC2 provides resizable compute instances.'],
      ['Easy', 'Which service manages users and permissions?', ['IAM', 'CloudFront', 'Route 53', 'Lambda'], 0, 'IAM controls identities and access.'],
      ['Intermediate', 'What is AWS Lambda?', ['A managed database', 'A serverless compute service that runs code on demand', 'A DNS service', 'A container registry'], 1, 'Lambda runs functions without managing servers.'],
      ['Intermediate', 'Which service is a managed relational database?', ['DynamoDB', 'RDS', 'S3', 'ElastiCache'], 1, 'RDS runs MySQL, PostgreSQL and others.'],
      ['Intermediate', 'What is a region in AWS?', ['A single data centre', 'A geographic area with multiple isolated availability zones', 'A pricing plan', 'A VPC subnet'], 1, 'Regions contain multiple availability zones.'],
      ['Hard', 'Which service is a content delivery network (CDN)?', ['CloudWatch', 'CloudFront', 'CloudFormation', 'CloudTrail'], 1, 'CloudFront caches content at edge locations.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Name the AWS service used for object storage of files such as images and backups.',
        expectedAnswer: 'Amazon S3',
        acceptedAnswers: ['s3', 'amazon s3', 'aws s3', 'simple storage service', 'amazon simple storage service'],
        evaluationCriteria: ['Names Amazon S3'],
        points: 2,
        explanation: 'S3 (Simple Storage Service) stores objects in buckets.',
      },
    ],
  ),
  ...bank(
    'Linux',
    [
      ['Easy', 'Which command prints the current working directory?', ['cd', 'pwd', 'ls', 'whoami'], 1, '`pwd` = print working directory.'],
      ['Easy', 'Which command changes file permissions?', ['chown', 'chmod', 'chgrp', 'perm'], 1, '`chmod` changes the mode (permissions).'],
      ['Intermediate', 'Which command searches for text inside files?', ['find', 'grep', 'locate', 'cat'], 1, '`grep` searches file contents by pattern.'],
      ['Intermediate', 'What does `chmod 755 script.sh` give the owner?', ['Read only', 'Read and write', 'Read, write and execute', 'Execute only'], 2, '7 = rwx for the owner; 5 = r-x for group and others.'],
      ['Intermediate', 'Which command shows running processes?', ['ps', 'df', 'du', 'top -k'], 0, '`ps` lists processes (`top` is interactive).'],
      ['Hard', 'What does the `|` operator do in a shell?', ['Runs commands in parallel', 'Sends one command’s output as input to the next', 'Redirects output to a file', 'Comments out the line'], 1, 'Pipes connect stdout of one command to stdin of another.'],
    ],
    [
      {
        difficulty: 'Easy',
        question: 'Write the Linux command that lists all files, including hidden ones, in long format.',
        expectedAnswer: 'ls -la',
        acceptedAnswers: ['ls -la', 'ls -al', 'ls -l -a', 'ls -a -l', 'ls -lA', 'ls -la .'],
        evaluationCriteria: ['Uses ls with -l and -a'],
        points: 2,
        explanation: '`-l` gives long format; `-a` includes hidden files.',
      },
    ],
  ),
]

export const QUESTIONS_BY_ID = new Map(QUESTION_BANK.map((question) => [question.id, question]))

export const BANK_SKILLS = [...new Set(QUESTION_BANK.map((question) => question.skill))]

// Related skills that are assessed with the closest bank topic.
export const BANK_SKILL_ALIASES = {
  MySQL: 'SQL',
  PostgreSQL: 'SQL',
  Express: 'Node.js',
  Redux: 'React',
  'State Management': 'React',
  'Next.js': 'React',
  'React Native': 'React',
  'Tailwind CSS': 'CSS',
  Hibernate: 'Spring Boot',
  Microservices: 'REST APIs',
  Django: 'Python',
  Pandas: 'Python',
  'scikit-learn': 'Python',
  Kubernetes: 'Docker',
  GitHub: 'Git',
  'GitHub Actions': 'Git',
  Jest: 'JavaScript',
  TestNG: 'Java',
}

// Used when neither the job nor the candidate's skills are covered by the bank.
export const GENERAL_SKILLS = ['Data Structures & Algorithms', 'OOP', 'Git']
