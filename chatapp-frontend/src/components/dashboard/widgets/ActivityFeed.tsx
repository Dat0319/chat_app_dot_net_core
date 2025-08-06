// src/components/dashboard/widgets/ActivityFeed.tsx

interface ActivityFeedProps {
  title: string;
  description: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ title, description }) => {
  // Sample data
  const activities: Activity[] = [
    {
      id: "1",
      user: "John Doe",
      action: "created",
      target: "a new user account",
      time: "5 minutes ago"
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "updated",
      target: "the Admin role permissions",
      time: "1 hour ago"
    },
    {
      id: "3",
      user: "Bob Johnson",
      action: "deleted",
      target: "the Sales group",
      time: "3 hours ago"
    },
    {
      id: "4",
      user: "Alice Williams",
      action: "modified",
      target: "system settings",
      time: "5 hours ago"
    },
    {
      id: "5",
      user: "Charlie Brown",
      action: "created",
      target: "a new chat group",
      time: "yesterday"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <div>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {activity.user.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
