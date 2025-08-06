// src/components/dashboard/widgets/StatsCard.tsx

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          {/* Icon placeholder */}
          <span className="text-xs">Icon</span>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold text-gray-800">
          {value.toLocaleString()}
        </p>
        <div className="flex items-center mt-2">
          <span
            className={`text-sm font-medium ${
              changeType === "increase"
                ? "text-green-600"
                : changeType === "decrease"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {change}%
          </span>
          <span className="text-gray-500 text-sm ml-2">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
