import { Sidebar } from "@/components/Sidebar";
import { StatsCard } from "@/components/StatsCard";
import { Users, BookOpen, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { enrolledStudents } from "@/data/courses";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 bg-secondary">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard icon={Users} label="Total Enrolments" value="14" />
          <StatsCard icon={BookOpen} label="Total Courses" value="8" />
          <StatsCard icon={DollarSign} label="Total Earnings" value="$245" />
        </div>

        {/* Latest Enrollments */}
        <div className="bg-background rounded-lg border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Latest Enrolments</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Student name</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium">{student.name[0]}</span>
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell className="text-muted-foreground">{student.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
