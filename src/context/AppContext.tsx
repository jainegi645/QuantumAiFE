import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";
import { authService } from "@/services/auth.service";

import { Course, Chapter, Lecture, Notes, ContentItem } from '@/types/course';
type Lecture = {
  type: 'lecture';
  lectureId: string;
  lectureTitle: string;
  lectureDuration: string | number;
  lectureUrl?: string;
  isPreviewFree?: boolean;
  lectureOrder?: number;
};

type ContentItem = Lecture | { type: 'notes' };

type Chapter = {
  chapterId: string;
  chapterTitle: string;
  chapterOrder?: number;
  collapsed?: boolean;
  chapterContent: ContentItem[];
};

type Course = {
  courseContent: Chapter[];
  courseRatings: { rating: number }[];
  [key: string]: any;
};

interface AppContextType {
  isAuthenticated: boolean;
  user: any;
  hasRole?: (roles: string | string[]) => boolean;
  login: (provider: string) => Promise<void>;
  logout: () => void;
  backendUrl: string;
  getToken?: () => Promise<string | null>;
  currency: string;
  navigate: ReturnType<typeof useNavigate>;
  userData: any;
  setUserData: (d: any) => void;
  fetchUserData: () => Promise<void>;
  allCourses: Course[];
  fetchAllCourses: () => Promise<void>;
  enrolledCourses: any[];
  fetchUserEnrolledCourses: () => Promise<void>;
  calculateChapterTime: (chapter: Chapter) => string;
  calculateCourseDuration: (course: Course) => string;
  calculateRating: (course: Course) => number;
  calculateNoOfLectures: (course: Course) => number;
  isEducator: boolean;
  setIsEducator: (v: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // environment values — assert string availability
  const backendUrl = (import.meta as any).env.VITE_BACKEND_URL as string;
  const currency = (import.meta as any).env.VITE_CURRENCY as string;
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(authService.getUser());
  const [isEducator, setIsEducator] = useState<boolean>(false);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  // Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Initialize auth interceptor
  useEffect(() => {
    authService.setupAxiosInterceptor();
  }, []);

  // Keep local state in sync when auth changes elsewhere (login/logout)
  useEffect(() => {
    const onAuthChanged = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setUser(authService.getUser());
    };
    window.addEventListener('auth:changed', onAuthChanged);
    return () => window.removeEventListener('auth:changed', onAuthChanged);
  }, []);

  // Auth methods
  const login = async (provider: string) => {
    await authService.login(provider);
  };

  const getToken = async () => {
    // authService stores token synchronously; wrap as promise for callers that await it
    return Promise.resolve(authService.getToken());
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setUserData(null);
    setEnrolledCourses([]);
    setIsEducator(false);
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return !!user?.role && arr.includes(user.role);
  };

  // Fetch UserData
  const fetchUserData = async () => {
    try {
      if (!isAuthenticated) return;
      
      // Get the current user's ID from authService
      const currentUser = authService.getUser();
      if (!currentUser?.id) {
        console.error('No user ID available');
        return;
      }

      const { data } = await axios.get(backendUrl + `/api/users/${currentUser.id}`);
      if (data.success) {
        setUserData(data.user);
        setIsEducator(data.user.role === "educator");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = getToken ? await getToken() : null;

      const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setEnrolledCourses(Array.isArray(data.enrolledCourses) ? data.enrolledCourses.reverse() : []);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Parse duration string into minutes
  const parseDuration = (duration: string | number | undefined): number => {
    if (!duration) return 0;
    
    // Handle number input
    if (typeof duration === 'number') return duration;
    
    // Convert to string and clean up
    const durationStr = String(duration).trim().toLowerCase();
    
    // Log duration parsing
    console.debug('Parsing duration:', durationStr);
    
    // Try to parse direct minutes first
    const minutes = parseInt(durationStr);
    if (!isNaN(minutes)) {
      console.debug('Parsed direct minutes:', minutes);
      return minutes;
    }
    
    // If not direct minutes, assume it's a formatted string
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minutesMatch = durationStr.match(/(\d+)\s*m/);
    
    let totalMinutes = 0;
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      totalMinutes += hours * 60;
      console.debug('Added hours:', hours, 'to total:', totalMinutes);
    }
    if (minutesMatch) {
      const mins = parseInt(minutesMatch[1]);
      totalMinutes += mins;
      console.debug('Added minutes:', mins, 'to total:', totalMinutes);
    }
    
    return totalMinutes;
  };

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter: Chapter) => {
    if (!chapter?.chapterContent) {
      console.debug('No chapter content found');
      return '0m';
    }
    
    let totalMinutes = 0;
    const lectures = chapter.chapterContent.filter((item): item is Lecture => item.type === 'lecture');
    
    console.debug('Processing chapter:', chapter.chapterTitle);
    console.debug('Found lectures:', lectures.length);
    
    lectures.forEach((lecture) => {
      const duration = parseDuration(lecture.lectureDuration);
      totalMinutes += duration;
      console.debug('Added lecture duration:', duration, 'for lecture:', lecture.lectureTitle);
    });
    
    console.debug('Chapter total minutes:', totalMinutes);
    
    if (totalMinutes === 0) return '0m';
    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"], round: true });
  };

  // Function to Calculate Course Duration
  const calculateCourseDuration = (course: Course) => {
    if (!course?.courseContent) {
      console.debug('No course content found');
      return '0m';
    }
    
    let totalMinutes = 0;
    console.debug('Processing course:', course.title);
    
    course.courseContent.forEach((chapter, idx) => {
      if (Array.isArray(chapter?.chapterContent)) {
        console.debug(`Processing chapter ${idx}:`, chapter.chapterTitle);
        const lectures = chapter.chapterContent.filter((item): item is Lecture => item.type === 'lecture');
        console.debug('Found lectures:', lectures.length);
        
        lectures.forEach((lecture) => {
          const duration = parseDuration(lecture.lectureDuration);
          totalMinutes += duration;
          console.debug('Added lecture duration:', duration, 'for lecture:', lecture.lectureTitle);
        });
      }
    });
    
    console.debug('Course total minutes:', totalMinutes);
    
    if (totalMinutes === 0) return '0m';
    return humanizeDuration(totalMinutes * 60 * 1000, { units: ["h", "m"], round: true });
  };

  const calculateRating = (course: Course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  const calculateNoOfLectures = (course: Course) => {
    if (!course?.courseContent) return 0;
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter?.chapterContent)) {
        totalLectures += chapter.chapterContent.filter(item => item.type === 'lecture').length;
      }
    });
    return totalLectures;
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [isAuthenticated]);

  const value: AppContextType = {
    isAuthenticated,
    user,
    hasRole,
    login,
    logout,
    getToken,
    backendUrl,
    currency,
    navigate,
    userData,
    setUserData,
    allCourses,
    fetchAllCourses,
    enrolledCourses,
    fetchUserEnrolledCourses,
    fetchUserData,
    calculateChapterTime,
    calculateCourseDuration,
    calculateRating,
    calculateNoOfLectures,
    isEducator,
    setIsEducator,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
