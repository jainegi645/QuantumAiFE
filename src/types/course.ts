export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'EDUCATOR';
  bio?: string;
}

export interface Lecture {
  type: 'lecture';
  lectureId: string;
  lectureTitle: string;
  lectureDuration: string;
  lectureUrl: string;
  isPreviewFree: boolean;
  lectureOrder: number;
}

export interface Notes {
  type: 'notes';
  notesId: string;
  notesTitle: string;
  fileName: string;
  fileUrl: string;
  notesOrder: number;
}

export type ContentItem = Lecture | Notes;

export interface Chapter {
  chapterId: string;
  chapterTitle: string;
  collapsed: boolean;
  chapterOrder: number;
  chapterContent: ContentItem[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  paid: boolean;
  imageUrl: string;
  category: string;
  createdAt: string;
  duration: string;
  level: string;
  tags: string[];
  educator: User;
  enrolledUsers: User[];
  courseContent: Chapter[];
}