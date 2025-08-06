import DashboardLayout from "../components/dashboard/DashboardLayout";
import ActivityFeed from "../components/dashboard/widgets/ActivityFeed";
import ChartWidget from "../components/dashboard/widgets/ChartWidget";
import StatsCard from "../components/dashboard/widgets/StatsCard";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Users"
          value={154}
          change={12}
          changeType="increase"
          icon="UsersIcon"
        />
        <StatsCard
          title="Active Roles"
          value={8}
          change={2}
          changeType="increase"
          icon="ShieldIcon"
        />
        <StatsCard
          title="Chat Groups"
          value={24}
          change={5}
          changeType="increase"
          icon="ChatIcon"
        />
        <StatsCard
          title="Messages Today"
          value={287}
          change={32}
          changeType="increase"
          icon="MessageIcon"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartWidget
            title="User Activity"
            description="User activity over the past 30 days"
          />
        </div>
        <div>
          <ActivityFeed
            title="Recent Activity"
            description="Latest system activities"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
