import React, { useEffect, useState } from 'react';
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, FlaskConical, LineChart, BookOpen, BrainCircuit } from "lucide-react";
import { coursesData } from "@/data/courses";
import { apiService } from '../api/apiCalling';
import { endpoints } from '../api/endpoints';

const categories = [
  { icon: Database, label: "Data Science" },
  { icon: FlaskConical, label: "Data Science" },
  { icon: LineChart, label: "Data Science" },
  { icon: BookOpen, label: "Data Science" },
  { icon: BrainCircuit, label: "Data Science" }
];

const courses = Array(5).fill(coursesData[0]);

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

  useEffect(() => {
    fetchQuantumData();
  }, []);

  const fetchQuantumData = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(endpoints.getQuantumData);
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
      const response = await apiService.post(endpoints.postQuantumAnalysis, analysisData);
      // Handle response
      setError(null);
    } catch (err) {
      setError('Failed to submit analysis');
      console.error(err);
    } finally {
      setLoading(false);
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
            <Button size="lg">Get Started</Button>
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
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Newly Released Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {courses.map((course, idx) => (
              <CourseCard key={idx} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular Courses */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Most Popular Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {courses.map((course, idx) => (
              <CourseCard key={idx} {...course} />
            ))}
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
