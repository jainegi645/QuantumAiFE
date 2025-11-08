import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, FlaskConical, LineChart, BookOpen, BrainCircuit } from "lucide-react";
// import { coursesData } from "@/data/courses";
import { apiService } from '../api/apiCalling';
import { endpoints } from '../api/endpoints';

const categories = [
  { icon: Database, label: "Data Science" },
  { icon: FlaskConical, label: "Data Science" },
  { icon: LineChart, label: "Data Science" },
  { icon: BookOpen, label: "Data Science" },
  { icon: BrainCircuit, label: "Data Science" }
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
      console.debug('fetchTopNewPaid response:', data);

      // Handle several possible response shapes from backend
      if (Array.isArray(data)) {
        setTopNewCourses(data);
      } else if (data && Array.isArray((data as any).courses)) {
        setTopNewCourses((data as any).courses);
      } else if (data && Array.isArray((data as any).data)) {
        setTopNewCourses((data as any).data);
      } else if (data && Array.isArray((data as any).topNewPaid)) {
        setTopNewCourses((data as any).topNewPaid);
      } else if (data && Array.isArray((data as any).result)) {
        setTopNewCourses((data as any).result);
      } else {
        // Last resort: try to find any array value on the object
        const arrVal = Object.values(data || {}).find((v) => Array.isArray(v));
        if (Array.isArray(arrVal)) setTopNewCourses(arrVal as any[]);
        else setTopNewCourses([]);
      }
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
      const data = await apiService.get<any>(endpoints.mostPopular ?? '/api/courses/top-paid-popular', { limit: 5 });
      console.debug('fetchTopPopular response:', data);
      if (Array.isArray(data)) setTopPopularCourses(data);
      else if (data && Array.isArray((data as any).courses)) setTopPopularCourses((data as any).courses);
      else if (data && Array.isArray((data as any).data)) setTopPopularCourses((data as any).data);
      else if (data && Array.isArray((data as any).mostPopular)) setTopPopularCourses((data as any).mostPopular);
      else if (data && Array.isArray((data as any).result)) setTopPopularCourses((data as any).result);
      else {
        const arrVal = Object.values(data || {}).find((v) => Array.isArray(v));
        if (Array.isArray(arrVal)) setTopPopularCourses(arrVal as any[]);
        else setTopPopularCourses([]);
      }
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
      console.log("In top free .... 1")
      console.debug('fetchTopFree response:', data);
      if (Array.isArray(data)) setTopFreeCourses(data);
      else if (data && Array.isArray((data as any).courses)) setTopFreeCourses((data as any).courses);
      else if (data && Array.isArray((data as any).data)) setTopFreeCourses((data as any).data);
      else if (data && Array.isArray((data as any).result)) setTopFreeCourses((data as any).result);
      else {
        const arrVal = Object.values(data || {}).find((v) => Array.isArray(v));
        if (Array.isArray(arrVal)) setTopFreeCourses(arrVal as any[]);
        else setTopFreeCourses([]);
      }
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
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by over 15,000 companies and millions of learners around the world
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-xl font-semibold">Microsoft</span>
            <span className="text-xl font-semibold">Walmart</span>
            <span className="text-xl font-semibold">accenture</span>
            <span className="text-xl font-semibold">Adobe</span>
            <span className="text-xl font-semibold">PayPal</span>
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
                const rawId = course.id || course._id || course.courseId || null;
                const keyId = `${rawId ?? 'course'}-${idx}`;
                const title = course.title || course.courseTitle || course.name || 'Untitled Course';
                const image = course.image || course.imageUrl || '/placeholder.svg';
                const duration = course.duration || course.totalDuration || '0 Hours';
                const level = course.level || course.difficulty || 'All Levels';              
                const price = course.finalPrice
                  ? (typeof course.finalPrice === 'number' ? `$${course.finalPrice}` : course.finalPrice)
                  : (course.coursePrice ? (typeof course.coursePrice === 'number' ? `$${course.coursePrice}` : String(course.coursePrice)) : undefined);

                const idProp = rawId ?? String(idx);

                return (
                  <CourseCard
                    key={keyId}
                    id={idProp}
                    title={title}
                    image={image}
                    duration={duration}
                    level={level}
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
                const rawId = course.id || course._id || course.courseId || null;
                const keyId = `${rawId ?? 'course'}-${idx}`;
                const title = course.title || course.courseTitle || course.name || 'Untitled Course';
                const image = course.image || course.imageUrl || '/placeholder.svg';
                const duration = course.duration || course.totalDuration || '0 Hours';
                const level = course.level || course.difficulty || 'All Levels';
                // const price = course.price
                //   ? (typeof course.price === 'number' ? `$${course.price}` : course.price)
                //   : (course.coursePrice ? (typeof course.coursePrice === 'number' ? `$${course.coursePrice}` : String(course.coursePrice)) : undefined);
                const price = course.finalPrice
                  ? (typeof course.finalPrice === 'number' ? `$${course.finalPrice}` : course.finalPrice)
                  : (course.coursePrice ? (typeof course.coursePrice === 'number' ? `$${course.coursePrice}` : String(course.coursePrice)) : undefined);

                  const idProp = rawId ?? String(idx);
                return (
                  <CourseCard
                    key={keyId}
                    id={idProp}
                    title={title}
                    image={image}
                    duration={duration}
                    level={level}
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
                const rawId = course.id || course._id || course.courseId || null;
                const keyId = `${rawId ?? 'course'}-${idx}`;
                const title = course.title || course.courseTitle || course.name || 'Untitled Course';
                const image = course.image || course.imageUrl || '/placeholder.svg';
                const duration = course.duration || course.totalDuration || '0 Hours';
                const level = course.level || course.difficulty || 'All Levels';
                // const price = course.price
                //   ? (typeof course.price === 'number' ? `$${course.price}` : course.price)
                //   : (course.coursePrice ? (typeof course.coursePrice === 'number' ? `$${course.coursePrice}` : String(course.coursePrice)) : undefined);
                const price = course.finalPrice
                  ? (typeof course.finalPrice === 'number' ? `$${course.finalPrice}` : course.finalPrice)
                  : (course.coursePrice ? (typeof course.coursePrice === 'number' ? `$${course.coursePrice}` : String(course.coursePrice)) : undefined);

                const idProp = rawId ?? String(idx);
                return (
                  <CourseCard
                    key={keyId}
                    id={idProp}
                    title={title}
                    image={image}
                    duration={duration}
                    level={level}
                    price={price}
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
            Incididunt sed fugiat cupidatat consectetur culpa ullam voluptate nulla exercitation duis ut culpa mollit magna consequat in quis minim.
          </p>
          <Button size="lg" variant="secondary">Join Now</Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
