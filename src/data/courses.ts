export const coursesData = [
  {
    id: "1",
    title: "Discovering Artificial Intelligence and Machine Learning",
    image: "/placeholder.svg",
    duration: "51 Hours",
    level: "Intermediate",
    price: "$10.99",
    originalPrice: "$19.99",
    discount: "50% off",
    instructor: "Richard James",
    students: 25,
    earnings: "$150",
    description: "This is the most comprehensive and in-depth JavaScript course with 30 JavaScript projects. JavaScript is currently, the most popular programming language in the world. If you are an aspiring web developer or full stack developer, JavaScript is a must to learn. It also helps you to get high-paying jobs all over the world.",
    sections: [
      {
        title: "Project introduction",
        lectures: 3,
        duration: "45 m",
        lessons: [
          { title: "App Overview - Build Text-to-Image SaaS", completed: true },
          { title: "Tech Stack - React, Node js, MongoDB, Express js and Stripe Payment", completed: true },
          { title: "Core Features - Authentication, payment, deployment", completed: true }
        ]
      },
      {
        title: "Project Setup and configuration",
        lectures: 4,
        duration: "45 m",
        lessons: [
          { title: "Environment Setup - Install Node js, VS Code", completed: false },
          { title: "Repository Setup - Clone project repository", completed: false },
          { title: "Install Dependencies - Set up npm packages", completed: false },
          { title: "Initial Configuration - Set up basic files and folders", completed: false }
        ]
      },
      {
        title: "Tailwind Setup",
        lectures: 4,
        duration: "45 m",
        lessons: []
      },
      {
        title: "Frontend Project",
        lectures: 4,
        duration: "45 m",
        lessons: []
      },
      {
        title: "Backend Project",
        lectures: 4,
        duration: "45 m",
        lessons: []
      },
      {
        title: "Payment Integration",
        lectures: 4,
        duration: "45 m",
        lessons: []
      },
      {
        title: "Project Deployment",
        lectures: 4,
        duration: "45 m",
        lessons: []
      }
    ],
    whatsIncluded: [
      "Lifetime access with free updates.",
      "Step-by-step, hands-on project guidance.",
      "Downloadable resources and source code.",
      "Quizzes to test your knowledge.",
      "Certificate of completion."
    ],
    whoIsItFor: [
      "Students & Working Professionals",
      "Lifetime access with free updates.",
      "Step-by-step, hands-on project guidance.",
      "Downloadable resources and source code.",
      "Quizzes to test your knowledge.",
      "Certificate of completion."
    ]
  }
];

export const enrolledStudents = [
  { id: 1, name: "Richard Sanford", course: "Build Text to Image SaaS App in React JS", date: "22 Aug, 2024", avatar: "" },
  { id: 2, name: "Enrique Murphy", course: "Build AI BG Removal SaaS App in React JS", date: "22 Aug, 2024", avatar: "" },
  { id: 3, name: "Alison Powell", course: "React Router: Complete Course in One Video", date: "25 Sep, 2024", avatar: "" },
  { id: 4, name: "Richard Sanford", course: "Build Full Stack E-Commerce App in React JS", date: "15 Oct, 2024", avatar: "" },
  { id: 5, name: "Enrique Murphy", course: "Build AI BG Removal SaaS App in React JS", date: "22 Aug, 2024", avatar: "" },
  { id: 6, name: "Alison Powell", course: "React Router: Complete Course in One Video", date: "25 Sep, 2024", avatar: "" },
  { id: 7, name: "Richard Sanford", course: "Build Full Stack E-Commerce App in React JS", date: "15 Oct, 2024", avatar: "" }
];

export const myCourses = [
  { id: 1, title: "Build Text to Image SaaS App in React JS", image: "/placeholder.svg", earnings: "$150", students: 25, status: "live" },
  { id: 2, title: "Build Text to Image SaaS App in React JS", image: "/placeholder.svg", earnings: "$100", students: 28, status: "private" },
  { id: 3, title: "Build Text to Image SaaS App in React JS", image: "/placeholder.svg", earnings: "$50", students: 22, status: "live" },
  { id: 4, title: "Build Text to Image SaaS App in React JS", image: "/placeholder.svg", earnings: "$200", students: 8, status: "live" },
  { id: 5, title: "Build Text to Image SaaS App in React JS", image: "/placeholder.svg", earnings: "$250", students: 15, status: "live" }
];
