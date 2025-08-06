// src/components/dashboard/Sidebar.tsx
import { useAuth } from "../../hooks/useAuth";
import { useAuth } from "../../hooks/useAuth";
// For this example, let's assume we have them

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: "HomeIcon" },
    { name: "Users", path: "/users", icon: "UsersIcon" },
    { name: "Roles", path: "/roles", icon: "ShieldIcon" },
    { name: "Chat", path: "/chat", icon: "ChatIcon" },
    { name: "Settings", path: "/settings", icon: "SettingsIcon" }
  ];

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {!collapsed && (
          <span className="text-xl font-semibold">Admin Panel</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {/* Toggle icon */}
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <span>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              <span className="mr-3">{/* render icon here */}</span>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
