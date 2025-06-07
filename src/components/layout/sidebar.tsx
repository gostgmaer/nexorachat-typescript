// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import {
//   ChevronRight,
//   LayoutDashboard,
//   Users,
//   Settings,
//   FileText,
//   Mail,
//   Bell,
//   User,
//   CreditCard,
//   ChevronDown,
// } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";

// interface SidebarItemProps {
//   icon: React.ReactNode;
//   title: string;
//   isActive?: boolean;
//   href?: string;
//   isCollapsed: boolean;
//   children?: {
//     title: string;
//     href: string;
//   }[];
// }

// function SidebarItem({
//   icon,
//   title,
//   href,
//   isCollapsed,
//   children,
// }: SidebarItemProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const isActive = href ? pathname === href : false;

//   if (children) {
//     const isChildActive = children.some((child) => pathname === child.href);

//     return (
//       <div
//         className={cn(
//           "flex flex-col",
//           (isActive || isChildActive) && "bg-muted"
//         )}
//       >
//         <Button
//           variant="ghost"
//           className={cn(
//             "justify-between h-12",
//             (isActive || isChildActive) && "bg-muted",
//             isCollapsed && "justify-center px-2"
//           )}
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <div className="flex items-center gap-3">
//             {icon}
//             {!isCollapsed && <span>{title}</span>}
//           </div>
//           {!isCollapsed && (
//             <ChevronDown
//               className={cn(
//                 "h-4 w-4 transition-transform",
//                 isOpen && "rotate-180"
//               )}
//             />
//           )}
//         </Button>
//         {!isCollapsed && isOpen && (
//           <div className="ml-4 border-l pl-6 flex flex-col gap-1">
//             {children.map((child) => (
//               <Button
//                 key={child.href}
//                 variant="ghost"
//                 className={cn(
//                   "justify-start h-10",
//                   pathname === child.href && "bg-muted"
//                 )}
//                 onClick={() => router.push(child.href)}
//               >
//                 {child.title}
//               </Button>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <Button
//       variant="ghost"
//       className={cn(
//         "justify-start h-12",
//         isActive && "bg-muted",
//         isCollapsed && "justify-center px-2"
//       )}
//       onClick={() => href && router.push(href)}
//     >
//       {icon}
//       {!isCollapsed && <span className="ml-3">{title}</span>}
//     </Button>
//   );
// }

// export function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div
//       className={cn(
//         "flex flex-col border-r bg-card h-screen",
//         isCollapsed ? "w-16" : "w-64"
//       )}
//     >
//       <div className="flex h-14 items-center border-b px-4 justify-between">
//         {!isCollapsed && <span className="font-semibold">Admin Panel</span>}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//         >
//           <ChevronRight
//             className={cn(
//               "h-4 w-4 transition-transform",
//               !isCollapsed && "rotate-180"
//             )}
//           />
//         </Button>
//       </div>

//       <div className="flex-1 overflow-auto py-2">
//         <nav className="grid gap-1 px-2">
//           <SidebarItem
//             icon={<LayoutDashboard className="h-4 w-4" />}
//             title="Dashboard"
//             href="/dashboard"
//             isActive
//             isCollapsed={isCollapsed}
//           />
//           <SidebarItem
//             icon={<Users className="h-4 w-4" />}
//             title="Users"
//             isCollapsed={isCollapsed}
//           />
//           <SidebarItem
//             icon={<FileText className="h-4 w-4" />}
//             title="Documents"
//             href="/documents"
//             isCollapsed={isCollapsed}
//           />
//           <SidebarItem
//             icon={<Mail className="h-4 w-4" />}
//             title="Messages"
//             href="/messages"
//             isCollapsed={isCollapsed}
//           />
//           <SidebarItem
//             icon={<Bell className="h-4 w-4" />}
//             title="Notifications"
//             isCollapsed={isCollapsed}
//           />

//           <div className="my-2 border-t" />

//           <SidebarItem
//             icon={<User className="h-4 w-4" />}
//             title="Profile"
//             href="/profile"
//             isCollapsed={isCollapsed}
//           >
//             {/* <SidebarItem
//               icon={null}
//               title="View Profile"
//               isCollapsed={isCollapsed}
//             />
//             <SidebarItem
//               icon={null}
//               title="Edit Profile"
//               isCollapsed={isCollapsed}
//             />
//             <SidebarItem
//               icon={null}
//               title="Security"
//               isCollapsed={isCollapsed}
//             /> */}
//           </SidebarItem>
//           <SidebarItem
//             icon={<Settings className="h-4 w-4" />}
//             title="Settings"
//             isCollapsed={isCollapsed}
//           >
//             {/* <SidebarItem
//               icon={null}
//               title="General"
//               isCollapsed={isCollapsed}
//             />
//             <SidebarItem
//               icon={null}
//               title="Security"
//               isCollapsed={isCollapsed}
//             />
//             <SidebarItem
//               icon={null}
//               title="Notifications"
//               isCollapsed={isCollapsed}
//             />
//             <SidebarItem
//               icon={null}
//               title="Billing"
//               isCollapsed={isCollapsed}
//             /> */}
//           </SidebarItem>
//           <SidebarItem
//             icon={<CreditCard className="h-4 w-4" />}
//             title="Billing"
//             isCollapsed={isCollapsed}
//           />
//         </nav>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/elements/icons';
import { cn } from '@/lib/utils';
import { ChatList } from '@/components/pages/chat/chat-list';
import { UsersList } from '@/components/pages/chat/users-list';
import { SettingsPanel } from '@/components/pages/settings/settings-panel';
// import { SettingsPanel } from '@/components/settings/settings-panel';

type SidebarTab = 'chats' | 'users' | 'settings';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('chats');

  const tabs = [
    { id: 'chats' as const, label: 'Chats', icon: Icons.message },
    { id: 'users' as const, label: 'Users', icon: Icons.users },
    { id: 'settings' as const, label: 'Settings', icon: Icons.settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatList />;
      case 'users':
        return <UsersList />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ChatList />;
    }
  };

  return (
    <div className={cn('w-80 border-r bg-background flex flex-col', className)}>
      {/* Tab Navigation */}
      <div className="flex border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'outline' : 'ghost'}
              className={cn(
                'flex-1 rounded-none border-0',
                activeTab === tab.id && 'bg-muted'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}