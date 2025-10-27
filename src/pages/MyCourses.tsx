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

// import React, { useContext, useEffect, useState } from 'react';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Loading from '../components/student/Loading';

// // Type for a course
// interface Course {
//   _id: string;
//   courseThumbnail: string;
//   courseTitle: string;
//   enrolledStudents: any[];
//   coursePrice: number;
//   discount: number;
//   createdAt: string;
// }

// // Type for AppContext value
// interface AppContextType {
//   backendUrl: string;
//   isEducator: boolean;
//   currency: string;
//   getToken: () => Promise<string>;
// }

// const MyCourses: React.FC = () => {
//   const context = useContext(AppContext) as AppContextType;
//   const backendUrl = context?.backendUrl ?? '';
//   const isEducator = context?.isEducator ?? false;
//   const currency = context?.currency ?? '';
//   const getToken = context?.getToken ?? (async () => '');

//   const [courses, setCourses] = useState<Course[] | null>(null);

//   const fetchEducatorCourses = async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get(backendUrl + '/api/educator/courses', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) setCourses(data.courses);
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (isEducator) {
//       fetchEducatorCourses();
//     }
//   }, [isEducator]);

//   return courses ? (
//     <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
//       <div className='w-full'>
//         <h2 className="pb-4 text-lg font-medium">My Courses</h2>
//         <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
//           <table className="md:table-auto table-fixed w-full overflow-hidden">
//             <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
//               <tr>
//                 <th className="px-4 py-3 font-semibold truncate">All Courses</th>
//                 <th className="px-4 py-3 font-semibold truncate">Earnings</th>
//                 <th className="px-4 py-3 font-semibold truncate">Students</th>
//                 <th className="px-4 py-3 font-semibold truncate">Published On</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm text-gray-500">
//               {courses.map((course) => (
//                 <tr key={course._id} className="border-b border-gray-500/20">
//                   <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
//                     <img src={course.courseThumbnail} alt="Course Image" className="w-16" />
//                     <span className="truncate hidden md:block">{course.courseTitle}</span>
//                   </td>
//                   <td className="px-4 py-3">{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}</td>
//                   <td className="px-4 py-3">{course.enrolledStudents.length}</td>
//                   <td className="px-4 py-3">
//                     {new Date(course.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   ) : <Loading />;
// };

// export default MyCourses;
