import { Sidebar } from "@/components/Sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { myCourses } from "@/data/courses";

export default function MyCourses() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 bg-secondary">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My Courses</h1>
        </div>

        <div className="bg-background rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>All Courses</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Course Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-12 w-16 object-cover rounded"
                      />
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{course.earnings}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={course.status === "live"} />
                      <span className="text-sm capitalize">{course.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
