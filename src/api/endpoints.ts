export const endpoints = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  verify: '/api/auth/verify',

  // Users
  users: '/api/users',
  user: (id: string) => `/api/users/${id}`,

  // Courses
  courses: '/api/courses',
  course: (id: string) => `/api/courses/${id}`,

  // Course progress
  courseProgress: '/api/course-progress',
  courseProgressByUser: (userId: string) => `/api/course-progress/user/${userId}`,

  // Course reviews
  courseReviews: '/api/course-reviews',
  courseReview: (id: string) => `/api/course-reviews/${id}`,
  courseReviewsByCourse: (courseId: string) => `/api/course-reviews/course/${courseId}`,
  courseReviewsByUser: (userId: string) => `/api/course-reviews/user/${userId}`,

  // Quizzes
  quizzes: '/api/quizzes',
  quiz: (id: string) => `/api/quizzes/${id}`,
  quizzesByCourse: (courseId: string) => `/api/quizzes/course/${courseId}`,

  // Quiz attempts
  quizAttempts: '/api/quiz-attempts',
  quizAttemptsByQuiz: (quizId: string) => `/api/quiz-attempts/quiz/${quizId}`,
  quizAttemptsByUser: (userId: string) => `/api/quiz-attempts/user/${userId}`,

  // Certificates
  certificates: '/api/certificates',
  certificate: (id: string) => `/api/certificates/${id}`,
  certificatesByUser: (userId: string) => `/api/certificates/user/${userId}`,

  // Notifications
  notifications: '/api/notifications',
  notificationsByUser: (userId: string) => `/api/notifications/user/${userId}`,
  notificationsEmail: '/api/notifications/email',

  // Forums
  forums: '/api/forums',
  forumPostsByCourse: (courseId: string) => `/api/forums/course/${courseId}`,
  forumReplies: (postId: string) => `/api/forums/${postId}/replies`,
  forumReply: (postId: string, replyId: string) => `/api/forums/${postId}/replies/${replyId}`,

  // Leaderboards
  leaderboardsTopScores: '/api/leaderboards/top-scores',

  // Badges
  badges: '/api/badges',
  badge: (id: string) => `/api/badges/${id}`,

  // Analytics
  analyticsDashboard: '/api/analytics/dashboard',
  analyticsCourseProgress: '/api/analytics/course-progress',
  analyticsQuizPerformance: '/api/analytics/quiz-performance',
  analyticsRevenue: '/api/analytics/revenue',

  // Recommendations
  recommendationsByUser: (userId: string) => `/api/recommendations/user/${userId}`,

  // Payments & Purchases
  createPaymentIntent: '/api/payments/create-payment-intent',
  paymentsHistoryByUser: (userId: string) => `/api/payments/history/${userId}`,
  purchases: '/api/purchases',
  purchase: (id: string) => `/api/purchases/${id}`,
  paymentsReceipt: (purchaseId: string) => `/api/payments/receipt/${purchaseId}`,
  stripeWebhook: '/api/stripe/webhook',

  // Subscriptions
  subscriptions: '/api/subscriptions',
  subscription: (id: string) => `/api/subscriptions/${id}`,

  // Videos
  uploadVideo: '/api/videos/upload',
  streamVideo: (courseId: string, userId: string, videoName: string) => `/api/videos/stream/${courseId}/${userId}/${videoName}`,

  // Refunds
  refunds: '/api/refunds',
  refund: (id: string) => `/api/refunds/${id}`,

  // Admin
  adminReportDownload: '/api/admin/report/download',
  adminPaymentsAnalytics: '/api/admin/payments/analytics',

  // Convenience / legacy
  enrollCourse: (userId: string, courseId: string) => `/api/users/${userId}/courses/${courseId}`,
  userCourses: (userId: string) => `/api/users/${userId}/courses`,
} as const;

export type Endpoints = typeof endpoints;