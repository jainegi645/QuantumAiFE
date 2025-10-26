import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { coursesData } from "@/data/courses";

const courses = Array(20).fill(coursesData[0]);

export default function Courses() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Header */}
        <div className="border-b bg-secondary">
          <div className="container py-8">
            <nav className="text-sm text-muted-foreground mb-4">
              <span className="text-accent">Home</span> / Course List
            </nav>
            <h1 className="text-3xl font-bold">Course List</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b">
          <div className="container py-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  Category <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                  Level <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                  Duration <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                  Price <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                  Tags <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" className="gap-2">
                Sort By Relevance <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {courses.map((course, idx) => (
              <CourseCard key={idx} {...course} id={String(idx + 1)} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
