// Skill dictionary used to detect skills in resume text and to normalise job skills.
// `aliases` match case-insensitively; `exact` aliases match only with the given casing
// (for words that are also common English, e.g. "Go", "Express", "Excel").

export const SKILLS = [
  // Frontend
  { name: 'HTML', category: 'Frontend', aliases: ['html', 'html5'] },
  { name: 'CSS', category: 'Frontend', aliases: ['css', 'css3'] },
  { name: 'JavaScript', category: 'Frontend', aliases: ['javascript', 'es6', 'ecmascript'], exact: ['JS'] },
  { name: 'TypeScript', category: 'Frontend', aliases: ['typescript'], exact: ['TS'] },
  { name: 'React', category: 'Frontend', aliases: ['react', 'react.js', 'reactjs', 'react 18'] },
  { name: 'React Native', category: 'Frontend', aliases: ['react native'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angular', 'angularjs'] },
  { name: 'Vue', category: 'Frontend', aliases: ['vue', 'vue.js', 'vuejs'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['next.js', 'nextjs'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwind css', 'tailwindcss'] },
  { name: 'Redux', category: 'Frontend', aliases: ['redux', 'redux toolkit'] },
  { name: 'State Management', category: 'Frontend', aliases: ['state management', 'zustand', 'mobx', 'context api'] },
  { name: 'UI/UX', category: 'Design', aliases: ['ui/ux', 'ux/ui', 'user experience', 'ui design', 'ux design'] },
  { name: 'Figma', category: 'Design', aliases: ['figma'] },

  // Backend
  { name: 'Java', category: 'Backend', aliases: ['java'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring boot', 'springboot'] },
  { name: 'Hibernate', category: 'Backend', aliases: ['hibernate'] },
  { name: 'Node.js', category: 'Backend', aliases: ['node.js', 'nodejs', 'node'] },
  { name: 'Express', category: 'Backend', aliases: ['express.js', 'expressjs'], exact: ['Express'] },
  { name: 'Python', category: 'Backend', aliases: ['python'] },
  { name: 'Django', category: 'Backend', aliases: ['django'] },
  { name: 'Go', category: 'Backend', aliases: ['golang'], exact: ['Go'] },
  { name: 'C++', category: 'Backend', aliases: ['c++', 'cpp'] },
  { name: 'REST APIs', category: 'Backend', aliases: ['rest api', 'rest apis', 'restful', 'restful apis'] },
  { name: 'GraphQL', category: 'Backend', aliases: ['graphql'] },
  { name: 'Microservices', category: 'Backend', aliases: ['microservices', 'microservice'] },

  // Databases
  { name: 'SQL', category: 'Databases', aliases: ['sql'] },
  { name: 'MySQL', category: 'Databases', aliases: ['mysql'] },
  { name: 'PostgreSQL', category: 'Databases', aliases: ['postgresql', 'postgres'] },
  { name: 'MongoDB', category: 'Databases', aliases: ['mongodb', 'mongo'] },
  { name: 'Redis', category: 'Databases', aliases: ['redis'] },
  { name: 'Firebase', category: 'Databases', aliases: ['firebase'] },

  // Tools & cloud
  { name: 'Git', category: 'Tools', aliases: ['git'] },
  { name: 'GitHub', category: 'Tools', aliases: ['github'] },
  { name: 'GitHub Actions', category: 'Tools', aliases: ['github actions'] },
  { name: 'Docker', category: 'Tools', aliases: ['docker'] },
  { name: 'Kubernetes', category: 'Tools', aliases: ['kubernetes', 'k8s'] },
  { name: 'Jenkins', category: 'Tools', aliases: ['jenkins'] },
  { name: 'CI/CD', category: 'Tools', aliases: ['ci/cd', 'continuous integration'] },
  { name: 'Terraform', category: 'Tools', aliases: ['terraform'] },
  { name: 'Linux', category: 'Tools', aliases: ['linux', 'ubuntu'] },
  { name: 'AWS', category: 'Cloud', aliases: ['aws', 'amazon web services'] },
  { name: 'Azure', category: 'Cloud', aliases: ['azure', 'microsoft azure'] },
  { name: 'Jest', category: 'Testing', aliases: ['jest'] },
  { name: 'Selenium', category: 'Testing', aliases: ['selenium'] },
  { name: 'TestNG', category: 'Testing', aliases: ['testng'] },

  // Data
  { name: 'Spark', category: 'Data', aliases: ['apache spark', 'pyspark'], exact: ['Spark'] },
  { name: 'Pandas', category: 'Data', aliases: ['pandas'] },
  { name: 'scikit-learn', category: 'Data', aliases: ['scikit-learn', 'sklearn'] },
  { name: 'Power BI', category: 'Data', aliases: ['power bi', 'powerbi'] },
  { name: 'Excel', category: 'Data', aliases: ['ms excel', 'microsoft excel'], exact: ['Excel'] },

  // Fundamentals & other
  { name: 'Data Structures & Algorithms', category: 'Fundamentals', aliases: ['data structures', 'algorithms', 'dsa'] },
  { name: 'OOP', category: 'Fundamentals', aliases: ['object-oriented programming', 'object oriented programming', 'oop', 'oops'] },
  { name: 'Networking', category: 'Fundamentals', aliases: ['computer networks', 'networking', 'tcp/ip'] },
  { name: 'Performance Tuning', category: 'Fundamentals', aliases: ['performance tuning', 'query optimization'] },
  { name: 'Technical Writing', category: 'Other', aliases: ['technical writing', 'documentation writing'] },
  { name: 'Markdown', category: 'Other', aliases: ['markdown'] },
]
