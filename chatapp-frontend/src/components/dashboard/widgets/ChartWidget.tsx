// src/components/dashboard/widgets/ChartWidget.tsx
// Note: You would typically use a charting library like recharts or chart.js

interface ChartWidgetProps {
  title: string;
  description: string;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, description }) => {
  // Sample data for the chart
  const data = [
    { date: "2023-01-01", value: 50 },
    { date: "2023-01-02", value: 30 },
    { date: "2023-01-03", value: 45 },
    { date: "2023-01-04", value: 80 },
    { date: "2023-01-05", value: 65 },
    { date: "2023-01-06", value: 90 },
    { date: "2023-01-07", value: 75 }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <div className="h-64 flex items-center justify-center">
        {/* This is a placeholder for the actual chart component */}
        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">
            Chart visualization will be rendered here
          </p>
          {/* In a real implementation, you would use a charting library */}
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
