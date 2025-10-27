import { useState, useCallback } from 'react';
import { apiService } from '../api/apiCalling';
import { endpoints } from '../api/endpoints';
import { useToast } from '@/components/ui/use-toast';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.get(endpoints.courses);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error fetching courses",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add a new course
  const addCourse = useCallback(async (courseData) => {
    try {
      setLoading(true);
      const data = await apiService.post(endpoints.addCourse, courseData);
      setCourses(prev => [...prev, data]);
      toast({
        title: "Course added successfully",
        description: "Your new course has been created.",
      });
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error adding course",
        description: err.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update a course
  const updateCourse = useCallback(async (courseId, courseData) => {
    try {
      setLoading(true);
      const data = await apiService.put(endpoints.course(courseId), courseData);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? data : course
      ));
      toast({
        title: "Course updated successfully",
        description: "Your course has been updated.",
      });
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error updating course",
        description: err.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete a course
  const deleteCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      await apiService.delete(endpoints.course(courseId));
      setCourses(prev => prev.filter(course => course.id !== courseId));
      toast({
        title: "Course deleted successfully",
        description: "Your course has been removed.",
      });
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error deleting course",
        description: err.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get a single course
  const getCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      const data = await apiService.get(endpoints.course(courseId));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error fetching course",
        description: err.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
  };
};