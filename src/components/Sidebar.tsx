import { Home, BookOpen, Plus, Users, LayoutDashboard, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["educator"] },
//   { name: "Add Course", href: "/add-course", icon: Plus, roles: ["educator"] },
//   { name: "My Courses", href: "/my-courses", icon: BookOpen, roles: ["educator"] },
//   { name: "Student Enrolled", href: "/students", icon: Users, roles: ["educator"] },
// ];
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Add Course", href: "/add-course", icon: Plus },
  { name: "My Courses", href: "/my-courses", icon: BookOpen },
  { name: "Student Enrolled", href: "/students", icon: Users },
];

type SidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

export const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const context = useContext(AppContext);

  return (
    <aside
      className={cn(
        mobile
          ? "fixed inset-0 z-50 bg-sidebar p-4 md:hidden"
          : "hidden md:block md:fixed md:left-0 md:top-0 md:z-40 md:h-screen md:w-64 md:bg-sidebar md:border-r md:border-sidebar-border",
      )}
    >
      <div className={cn("flex h-full flex-col", mobile ? "max-w-sm w-full mx-auto" : "")}>
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <span className="text-lg font-bold text-accent-foreground">Q·AI</span>
            </div>
            <span className="text-sm font-semibold text-sidebar-foreground">QUANTUM AI</span>
          </Link>
          {mobile && (
            <button onClick={onClose} className="ml-auto p-2 rounded-md hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation
            .filter((item) => {
              if (!item.roles) return true;
              return context?.hasRole?.(item.roles as string[]);
            })
            .map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-accent"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-medium">
              {context?.user?.avatarUrl ? (
                <img src={context.user.avatarUrl} alt={context.user?.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                (context?.user?.name ?? 'G').toString().slice(0,1)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Hi! {context?.user?.name ?? 'Guest'}</p>
              {/* <p className="text-xs text-sidebar-foreground/60">{context?.user?.role ?? 'Visitor'}</p> */}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// import React, { useContext } from 'react';
// import { NavLink } from 'react-router-dom';
// import { assets } from '../assets/assets';
// import { AppContext } from '../context/AppContext';

// // Type for menu items
// interface MenuItem {
//   name: string;
//   path: string;
//   icon: string;
// }

// const SideBar: React.FC = () => {
//   // AppContext is typed in TS version
//   const context = useContext(AppContext);
//   const isEducator = context?.isEducator;

//   const menuItems: MenuItem[] = [
//     { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
//     { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
//     { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
//     { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
//   ];

//   return isEducator ? (
//     <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
//       {menuItems.map((item) => (
//         <NavLink
//           to={item.path}
//           key={item.name}
//           end={item.path === '/educator'}
//           className={({ isActive }: { isActive: boolean }) =>
//             `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive
//               ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90'
//               : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'
//             }`
//           }
//         >
//           <img src={item.icon} alt="" className="w-6 h-6" />
//           <p className="md:block hidden text-center">{item.name}</p>
//         </NavLink>
//       ))}
//     </div>
//   ) : null;
// };

// export default SideBar;

// import React, { useContext } from 'react';
// import { NavLink } from 'react-router-dom';
// import { assets } from '../assets/assets';
// import { AppContext } from '../context/AppContext';

// // Type for menu items
// interface MenuItem {
//   name: string;
//   path: string;
//   icon: string;
// }

// const SideBar: React.FC = () => {
//   // AppContext is typed in TS version
//   const context = useContext(AppContext);
//   const isEducator = context?.isEducator;

//   const menuItems: MenuItem[] = [
//     { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
//     { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
//     { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
//     { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
//   ];

//   return isEducator ? (
//     <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
//       {menuItems.map((item) => (
//         <NavLink
//           to={item.path}
//           key={item.name}
//           end={item.path === '/educator'}
//           className={({ isActive }: { isActive: boolean }) =>
//             `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive
//               ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90'
//               : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'
//             }`
//           }
//         >
//           <img src={item.icon} alt="" className="w-6 h-6" />
//           <p className="md:block hidden text-center">{item.name}</p>
//         </NavLink>
//       ))}
//     </div>
//   ) : null;
// };

// export default SideBar;
