import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react";
import { coursesData } from "@/data/courses";
import { useState } from "react";

export default function CourseDetail() {
  const course = coursesData[0];
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <Badge className="mb-4">Level: Beginners</Badge>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <p className="text-sm text-muted-foreground">Course by <span className="text-accent">{course.instructor}</span></p>
              </div>

              {/* Course Structure */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
                <p className="text-muted-foreground mb-6">
                  22 sections • 54 lectures • 27h 25m total duration
                </p>

                <div className="space-y-2">
                  {course.sections.map((section, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-0">
                        <button
                          onClick={() => toggleSection(idx)}
                          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedSections.includes(idx) ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                            <span className="font-semibold text-left">{section.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {section.lectures} lectures • {section.duration}
                          </span>
                        </button>

                        {expandedSections.includes(idx) && section.lessons && section.lessons.length > 0 && (
                          <div className="border-t">
                            {section.lessons.map((lesson, lessonIdx) => (
                              <div
                                key={lessonIdx}
                                className="flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors"
                              >
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="text-sm">{lesson.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Course Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="aspect-video bg-secondary rounded-lg mb-4 overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">{course.price}</span>
                      <span className="text-lg text-muted-foreground line-through">{course.originalPrice}</span>
                      <Badge variant="destructive">{course.discount}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>30 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>54 lessons</span>
                    </div>
                  </div>

                  <Button className="w-full mb-4" size="lg">Enroll Now</Button>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">What's in the course?</h3>
                      <ul className="space-y-2 text-sm">
                        {course.whatsIncluded.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Who is it for?</h3>
                      <ul className="space-y-2 text-sm">
                        {course.whoIsItFor.map((item, idx) => (
                          <li key={idx} className="flex gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
