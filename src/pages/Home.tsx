import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Currency, LineChart, BookOpen, BrainCircuit } from "lucide-react";
// import { coursesData } from "@/data/courses";
import { apiService } from '../api/apiCalling';
import { endpoints } from '../api/endpoints';

// Import company logos
import microsoftLogo from '@/assets/microsoft_logo.svg';
import accentureLogo from '@/assets/accenture_logo.svg';
import adobeLogo from '@/assets/adobe_logo.svg';
import paypalLogo from '@/assets/paypal_logo.svg';
import walmartLogo from '@/assets/walmart_logo.svg';

const categories = [
  { icon: Database, label: "Data Science" },
  { icon: Currency, label: "Finance" },
  { icon: LineChart, label: "Data Analytics" },
  { icon: BookOpen, label: "Business" },
  { icon: BrainCircuit, label: "AI & ML" }
];

// const courses = Array(5).fill(coursesData[0]);

interface QuantumData {
  // Define your data interface here
  id: string;
  name: string;
  // ... other properties
}

const Home: React.FC = () => {
  const [quantumData, setQuantumData] = useState<QuantumData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topNewCourses, setTopNewCourses] = useState<any[]>([]);
  const [topCoursesLoading, setTopCoursesLoading] = useState<boolean>(false);
  const [topPopularCourses, setTopPopularCourses] = useState<any[]>([]);
  const [topPopularLoading, setTopPopularLoading] = useState<boolean>(false);
  const [topFreeCourses, setTopFreeCourses] = useState<any[]>([]);
  const [topFreeLoading, setTopFreeLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchQuantumData();
    fetchTopNewPaid();
    fetchTopPopular();
    fetchTopFree();
  }, []);

  const fetchQuantumData = async () => {
    try {
      setLoading(true);
      // Use endpoints when available
      const data = await apiService.get<any>(endpoints.getQuantumData ?? '/api/quantum/data');
      setQuantumData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch quantum data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnalysis = async (analysisData: any) => {
    try {
      setLoading(true);
      const response = await apiService.post<any>(endpoints.postQuantumAnalysis ?? '/api/quantum/analysis', analysisData);
      // Handle response
      setError(null);
    } catch (err) {
      setError('Failed to submit analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopNewPaid = async () => {
    setTopCoursesLoading(true);
    try {
      // Backend GET /top-new-paid returns a list of Course objects (limit default 5)
      const data = await apiService.get<any>(endpoints.topNewPaid ?? '/api/courses/top-new-paid', { limit: 5 });
      console.debug('fetchTopNewPaid raw response:', data);

      let processedData;
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data?.courses) {
        processedData = data.courses;
      } else if (data?.data) {
        processedData = data.data;
      } else if (data?.topNewPaid) {
        processedData = data.topNewPaid;
      } else if (data?.result) {
        processedData = data.result;
      } else {
        const arrVal = Object.values(data || {}).find((v) => Array.isArray(v));
        processedData = Array.isArray(arrVal) ? arrVal : [];
      }

      // Normalize the course data
      const normalizedCourses = processedData.map((course: any) => ({
        id: course.id || course._id || course.courseId,
        title: course.title || course.courseTitle || course.name || 'Untitled Course',
        imageUrl: course.imageUrl || course.image || '/placeholder.svg',
        duration: course.duration || course.totalDuration || '0',
        level: course.level || course.difficulty || 'All Levels',
        finalPrice: course.finalPrice || course.price || course.coursePrice || 0
      }));

      console.debug('Normalized new courses:', normalizedCourses);
      setTopNewCourses(normalizedCourses);
    } catch (err) {
      console.error('Failed to fetch top new paid courses', err);
      setTopNewCourses([]);
    } finally {
      setTopCoursesLoading(false);
    }
  };

  const fetchTopPopular = async () => {
    setTopPopularLoading(true);
    try {
      console.log('Fetching popular courses...');
      const data = await apiService.get<any>(endpoints.mostPopular ?? '/api/courses/top-paid-popular', { limit: 5 });
      console.log('Popular courses raw response:', data);

      let processedData;
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data?.courses) {
        processedData = data.courses;
      } else if (data?.data) {
        processedData = data.data;
      } else if (data?.mostPopular) {
        processedData = data.mostPopular;
      } else if (data?.result) {
        processedData = data.result;
      } else {
        const arrVal = Object.values(data || {}).find((v) => Array.isArray(v));
        processedData = Array.isArray(arrVal) ? arrVal : [];
      }

      console.log('ProcessedData before normalization:', processedData);
      
      // Normalize the course data with detailed logging
      const normalizedCourses = processedData.map((course: any) => {
        console.log('Processing course:', course);
        const normalized = {
          id: course.id || course._id || course.courseId,
          title: course.title || course.courseTitle || course.name || 'Untitled Course',
          imageUrl: course.imageUrl || course.image || '/placeholder.svg',
          duration: course.duration || course.totalDuration || '0',
          level: course.level || course.difficulty || 'All Levels',
          finalPrice: course.paid === false ? 0 : (course.finalPrice || course.price || 0)
        };
        console.log('Normalized course:', normalized);
        return normalized;
      });

      console.log('Final normalized popular courses:', normalizedCourses);
      setTopPopularCourses(normalizedCourses);
    } catch (err) {
      console.error('Failed to fetch top popular courses', err);
      setTopPopularCourses([]);
    } finally {
      setTopPopularLoading(false);
    }
  };

  const fetchTopFree = async () => {
    setTopFreeLoading(true);
    try {
      const data = await apiService.get<any>(endpoints.topNewFree ?? '/api/courses/top-free', { limit: 5 });
      console.debug('fetchTopFree raw response:', data);

      let processedData;
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data?.courses) {
        processedData = data.courses;
      } else if (data?.data) {
        processedData = data.data;
      } else if (data?.result) {
        processedData = data.result;
      } else {
        const arrVal = Object.values(data || {}).find((v) => Array.isArray(v));
        processedData = Array.isArray(arrVal) ? arrVal : [];
      }

      console.log('Free courses - ProcessedData before normalization:', processedData);
      
      // Normalize the course data with detailed logging
      const normalizedCourses = processedData.map((course: any) => {
        console.log('Processing free course:', course);
        const normalized = {
          id: course.id || course._id || course.courseId,
          title: course.title || course.courseTitle || course.name || 'Untitled Course',
          imageUrl: course.imageUrl || course.image || '/placeholder.svg',
          duration: course.duration || course.totalDuration || '0',
          level: course.level || course.difficulty || 'All Levels',
          finalPrice: course.paid === false ? 0 : (course.finalPrice || course.price || 0)
        };
        console.log('Normalized free course:', normalized);
        return normalized;
      });

      console.log('Final normalized free courses:', normalizedCourses);
      setTopFreeCourses(normalizedCourses);
    } catch (err) {
      console.error('Failed to fetch top free courses', err);
      setTopFreeCourses([]);
    } finally {
      setTopFreeLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-light to-secondary py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get the skills you need.<br />
            Achieve the career you want.
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master skills with our expert-curated courses, advance your career, and achieve your professional goals with flexible, accessible learning.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg"><Link to="/courses">Get Started</Link></Button>
            {/* <Button size="lg" variant="outline">I'm Here</Button> */}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 border-b">
        <div className="container">
          <h2 className="text-center text-xl text-muted-foreground mb-6">
            Trusted by over 15,000 companies and millions of learners around the world
          </h2>
          {/* </p> */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex flex-col items-center gap-3">
              <img src={microsoftLogo} alt="Microsoft Logo" className="h-auto w-auto" />
              {/* <span className="text-l font-semibold">Microsoft</span> */}
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src={walmartLogo} alt="Walmart Logo" className="h-auto w-auto" />
              {/* <span className="text-l font-semibold">Walmart</span> */}
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src={accentureLogo} alt="Accenture Logo" className="h-auto w-auto" />
              {/* <span className="text-l font-semibold">accenture</span> */}
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src={adobeLogo} alt="Adobe Logo" className="h-auto w-auto" />
              {/* <span className="text-l font-semibold">Adobe</span> */}
            </div>
            <div className="flex flex-col items-center gap-3">
              <img src={paypalLogo} alt="PayPal Logo" className="h-auto w-auto" />
              {/* <span className="text-l font-semibold">PayPal</span> */}
            </div>
          </div>
        </div>
      </section>

      {/* Discover Your Path */}
      <section className="py-16 bg-blue-light">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Discover Your Path</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-blue-light rounded-full p-4">
                    <category.icon className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="font-semibold">{category.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newly Released Courses */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Newly Released Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(topCoursesLoading || loading) && topNewCourses.length === 0 ? (
              // Simple loading skeletons (5 columns)
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="rounded-lg bg-white border p-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : topNewCourses && topNewCourses.length > 0 ? (
              topNewCourses.map((course: any, idx: number) => {
                const price = typeof course.finalPrice === 'number' ? `$${course.finalPrice}` : 
                             course.finalPrice ? String(course.finalPrice) : 'Free';
                return (
                  <CourseCard
                    key={`new-${course.id || idx}`}
                    id={course.id || String(idx)}
                    title={course.title}
                    image={course.imageUrl}
                    duration={course.duration}
                    level={course.level}
                    price={price}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">No newly released courses found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Most Popular Courses */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Most Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(topPopularLoading || loading) && topPopularCourses.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="rounded-lg bg-white border p-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : topPopularCourses && topPopularCourses.length > 0 ? (
              topPopularCourses.map((course: any, idx: number) => {
                const price = typeof course.finalPrice === 'number' ? `$${course.finalPrice}` : 
                             course.finalPrice ? String(course.finalPrice) : 'Free';
                return (
                  <CourseCard
                    key={`popular-${course.id || idx}`}
                    id={course.id || String(idx)}
                    title={course.title}
                    image={course.imageUrl}
                    duration={course.duration}
                    level={course.level}
                    price={price}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">No popular courses found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Top Free Courses */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Top Free Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(topFreeLoading || loading) && topFreeCourses.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`free-skel-${i}`} className="rounded-lg bg-white border p-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : topFreeCourses && topFreeCourses.length > 0 ? (
              topFreeCourses.map((course: any, idx: number) => {
                return (
                  <CourseCard
                    key={`free-${course.id || idx}`}
                    id={course.id || String(idx)}
                    title={course.title}
                    image={course.imageUrl}
                    duration={course.duration}
                    level={course.level}
                    price="Free"
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground">No free courses found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Discover Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-accent mb-2">95%</p>
              <p className="text-sm text-muted-foreground">
                Students Successful For completers of courses
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">50,000+</p>
              <p className="text-sm text-muted-foreground">
                Certificates Issued out for 6 months
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">78%</p>
              <p className="text-sm text-muted-foreground">
                Learners got a promotion, or completed a course
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">1,20,000</p>
              <p className="text-sm text-muted-foreground">
                Students enrolled From the 90+ countries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-accent-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Learn anything, anytime, anywhere
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Empowering minds to learn, grow, and succeed. Access world-class knowledge on your schedule - anytime, anywhere.
          </p>
          <Button size="lg" variant="secondary"><Link to="/courses">Start Now</Link></Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
