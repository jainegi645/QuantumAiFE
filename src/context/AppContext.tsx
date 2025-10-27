import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";

// Small domain typings — keep these minimal and extend as your app grows
type Lecture = {
  lectureDuration: number; // in minutes
  [key: string]: any;
};

type Chapter = {
  chapterContent: Lecture[];
  [key: string]: any;
};

type Course = {
  courseContent: Chapter[];
  courseRatings: { rating: number }[];
  [key: string]: any;
};

interface AppContextType {
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  backendUrl: string;
  currency: string;
  navigate: ReturnType<typeof useNavigate>;
  userData: any;
  setUserData: (d: any) => void;
  getToken: (() => Promise<string>) | null;
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
  const { getToken } = useAuth();
  const { user } = useUser();

  const [showLogin, setShowLogin] = useState<boolean>(false);
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

  // Fetch UserData
  const fetchUserData = async () => {
    try {
      if (user && (user as any).publicMetadata?.role === "educator") {
        setIsEducator(true);
      }

      const token = getToken ? await getToken() : null;

      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
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

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter: Chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to Calculate Course Duration
  const calculateCourseDuration = (course: Course) => {
    let time = 0;
    course.courseContent.forEach((chapter) =>
      chapter.chapterContent.forEach((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
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
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  useEffect(() => {
    fetchAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value: AppContextType = {
    showLogin,
    setShowLogin,
    backendUrl,
    currency,
    navigate,
    userData,
    setUserData,
    getToken: getToken ?? null,
    allCourses,
    fetchAllCourses,
    enrolledCourses,
    fetchUserEnrolledCourses,
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
