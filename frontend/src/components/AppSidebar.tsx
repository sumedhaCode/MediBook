import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Search, Calendar, ClipboardList, Clock, Users, UserCog, LayoutDashboard,
  LogOut, Stethoscope, Heart,
} from "lucide-react";

const patientLinks = [
  { title: "Search Doctors", url: "/patient/search", icon: Search },
  { title: "My Appointments", url: "/patient/appointments", icon: Calendar },
];

const doctorLinks = [
  { title: "Dashboard", url: "/doctor", icon: LayoutDashboard },
  { title: "Availability", url: "/doctor/availability", icon: Clock },
  { title: "Appointments", url: "/doctor/appointments", icon: ClipboardList },
];

const adminLinks = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Manage Doctors", url: "/admin/doctors", icon: Stethoscope },
  { title: "Manage Users", url: "/admin/users", icon: Users },
  { title: "All Appointments", url: "/admin/appointments", icon: Calendar },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const links = user?.role === "patient" ? patientLinks : user?.role === "doctor" ? doctorLinks : adminLinks;
  const roleLabel = user?.role === "patient" ? "Patient" : user?.role === "doctor" ? "Doctor" : "Admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed && (
              <div className="flex items-center gap-2 px-1 py-2">
                <Heart className="h-5 w-5" />
                <span className="font-bold text-base">MediBook</span>
              </div>
            )}
            {collapsed && <Heart className="h-5 w-5 mx-auto" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="mb-2 px-2">
            <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className="w-full text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
