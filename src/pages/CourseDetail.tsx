import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Circle } from "lucide-react";
// import { coursesData } from "@/data/courses";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../api/apiCalling";
import { endpoints } from "@/api/endpoints";
import { AppContext } from "@/context/AppContext";
import { Course, Chapter, Lecture, ContentItem } from "@/types/course";

export default function CourseDetail() {
  const { id } = useParams();
  const { backendUrl, getToken, calculateChapterTime, calculateCourseDuration, userData } = useContext(AppContext)!;

  const [course, setCourse] = useState<Course | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressSet, setProgressSet] = useState<Set<string>>(new Set());

  const fetchCourseDetails = async (courseId: string) => {
    try {
      setLoading(true);
      const data = await apiService.get<Course>(endpoints.course, null, [courseId]);
      console.debug('Raw API response:', data);
      
      let courseData;
      if ('course' in data) {
        courseData = data.course;
      } else {
        courseData = data as Course;
      }

      // Log course structure for debugging
      if (courseData) {
        console.debug('Course Content Structure:', 
          courseData.courseContent?.map(chapter => ({
            id: chapter.chapterId,
            title: chapter.chapterTitle,
            lectureCount: chapter.chapterContent?.filter(item => item.type === 'lecture').length,
            firstLecture: chapter.chapterContent?.find(item => item.type === 'lecture')
          }))
        );
      }

      setCourse(courseData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch course details:', err);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const parseDurationToMinutes = (str?: string) => {
    if (!str) return 0;
    // Examples: "27h 25m", "45 m", "51 Hours", "2h 30m"
    const lower = String(str).toLowerCase();
    let hours = 0, minutes = 0;
    const hMatch = lower.match(/(\d+)\s*h/);
    const mMatch = lower.match(/(\d+)\s*m/);
    const hoursWord = lower.match(/(\d+)\s*hours?/);
    if (hMatch) hours = parseInt(hMatch[1], 10);
    if (mMatch) minutes = parseInt(mMatch[1], 10);
    if (hoursWord) hours = parseInt(hoursWord[1], 10);
    // Also handle plain numbers (treat as minutes)
    if (!hMatch && !mMatch && !hoursWord) {
      const num = parseFloat(lower);
      if (!isNaN(num)) minutes = Math.round(num);
    }
    return hours * 60 + minutes;
  };

  const normalizeCourse = (raw: any) => {
    // If backend already provides courseContent with numeric lectureDuration, use it directly
    if (!raw) return null;

      return raw;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error('No course ID provided');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Use endpoints.course with apiService
        const courseResponse = await apiService.get<any>(endpoints.course, null, [id]);
        console.debug('Course details response:', JSON.stringify(courseResponse, null, 2));

        let courseData;
        if (courseResponse?.course) {
          courseData = courseResponse.course;
        } else if (courseResponse?.data) {
          courseData = courseResponse.data;
        } else {
          courseData = courseResponse;
        }

        // Log the course content structure
        console.debug('Course Content:', courseData?.courseContent?.map(chapter => ({
          chapterTitle: chapter.chapterTitle,
          contentCount: chapter.chapterContent?.length,
          lectures: chapter.chapterContent?.filter(item => item.type === 'lecture').length
        })));

        setCourse(courseData);
        // }
        // fetch user progress (if user is logged in)
        const userId = userData?.id ?? userData?._id;
        if (userId) {
          try {
            const progressRes = await apiService.get<any>(endpoints.courseProgressByUser as any, null, [userId]);
            const progressArr = Array.isArray(progressRes) ? progressRes : (progressRes?.progress ?? progressRes?.data ?? []);
            const set = new Set<string>();
            // progress items may have lectureId, lessonId or lectureTitle
            (progressArr || []).forEach((p: any) => {
              if (!p) return;
              if (p.courseId && String(p.courseId) !== String(id)) return; // only this course
              if (p.lectureId) set.add(String(p.lectureId));
              if (p.lessonId) set.add(String(p.lessonId));
              if (p.lectureTitle) set.add(String(p.lectureTitle));
            });
            setProgressSet(set);
          } catch (err) {
            // ignore progress errors — keep UI functional
            console.warn('Failed to load course progress', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userData]);

  // Compute totals using normalized course shape
  const totalChapters = course ? (Array.isArray(course.courseContent) ? course.courseContent.length : 0) : 0;
  const totalLectures = course ? (Array.isArray(course.courseContent) ? course.courseContent.reduce((acc: number, ch: any) => acc + (Array.isArray(ch.chapterContent) ? ch.chapterContent.length : 0), 0) : 0) : 0;
  const totalDurationStr = course ? (calculateCourseDuration ? calculateCourseDuration(course) : '') : '';

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <div className="container py-12">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-secondary/50 w-1/2 rounded"></div>
              <div className="h-4 bg-secondary/50 w-1/4 rounded"></div>
              <div className="h-32 bg-secondary/50 rounded"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Course</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold mb-4">{course?.title ?? 'No Title'}</h1>
                <Badge className="mb-4">Level: {course?.level ?? 'All'}</Badge>
                <p className="text-muted-foreground mb-4">{course?.description ?? 'No Description'}</p>
                <p className="text-sm text-muted-foreground">Course by <span className="text-accent">{course?.educator?.name ?? 'Unknown'}</span></p>
              </div>

              {/* Course Structure */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
                <p className="text-muted-foreground mb-6">
                  {totalChapters} sections • {totalLectures} lectures • {totalDurationStr} total duration
                </p>

                <div className="space-y-2">
                  {course?.courseContent?.map((section: Chapter, idx: number) => {
                    console.debug('Processing section:', section);
                    const lectures = section.chapterContent?.filter(
                      (item: ContentItem): item is Lecture => item.type === 'lecture'
                    ) || [];
                    console.debug('Filtered lectures:', lectures);
                    const lecturesCount = lectures.length;
                    const chapterTime = calculateChapterTime ? calculateChapterTime(section) : '';
                    return (
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
                              <span className="font-semibold text-left">{section.chapterTitle ?? section.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {lecturesCount} lectures • {chapterTime}
                            </span>
                          </button>

                          {expandedSections.includes(idx) && (
                            <div className="border-t">
                              {lectures.map((lecture: Lecture, lessonIdx: number) => (
                                  <div
                                    key={lecture.lectureId || lessonIdx}
                                    className="flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors"
                                  >
                                    <div className="flex-shrink-0">
                                      {progressSet.has(String(lecture.lectureId)) ? (
                                        <CheckCircle2 className="h-5 w-5 text-success" />
                                      ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="flex-grow">
                                      <span className="text-sm font-medium">{lecture.lectureTitle}</span>
                                      {lecture.isPreviewFree && (
                                        <Badge variant="secondary" className="ml-2">Preview</Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">{lecture.lectureDuration}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Course Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                <p className="text-muted-foreground">{course?.description}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="aspect-video bg-secondary rounded-lg mb-4 overflow-hidden">
                    <img src={course?.imageUrl ?? '/placeholder.svg'} alt={course?.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">${course?.finalPrice ?? course?.price ?? 0}</span>
                      {course?.discount && course.discount > 0 && (
                        <span className="text-lg text-muted-foreground line-through">${course?.price ?? 0}</span>
                      )}
                      {course?.discount && course.discount > 0 && (
                        <Badge variant="destructive">{course?.discount}% OFF</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{totalDurationStr || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{totalLectures} lessons</span>
                    </div>
                  </div>

                  <Button className="w-full mb-4" size="lg">Enroll Now</Button>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">What's in the course?</h3>
                      <ul className="space-y-2 text-sm">
                        {(course?.whatsIncluded || []).map((item: any, idx: number) => (
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
                        {(course?.whoIsItFor || []).map((item: any, idx: number) => (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
