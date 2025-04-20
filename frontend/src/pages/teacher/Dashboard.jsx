import {
  BarChart2,
  Clock,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import UpcomingAssignments from '../../components/dashboard/UpcomingAssignments';

export default function TeacherDashboard() {
  const { recentSubmissions, assignments } = useAppContext();

  const totalSubmissions = recentSubmissions.length;
  const pendingSubmissions = recentSubmissions.filter(s => s.status === 'pending').length;
  const flaggedSubmissions = recentSubmissions.filter(s => s.status === 'flagged').length;
  const avgScore =
    recentSubmissions.filter(s => s.score !== undefined).reduce((acc, curr) => acc + (curr.score || 0), 0) /
    recentSubmissions.filter(s => s.score !== undefined).length;

  const stats = [
    {
      id: 1,
      title: 'Total Submissions',
      value: totalSubmissions,
      icon: <FileText className="text-blue-500" />,
      color: 'blue',
    },
    {
      id: 2,
      title: 'Pending Reviews',
      value: pendingSubmissions,
      icon: <Clock className="text-amber-500" />,
      color: 'amber',
    },
    {
      id: 3,
      title: 'Flagged for Review',
      value: flaggedSubmissions,
      icon: <AlertTriangle className="text-red-500" />,
      color: 'red',
    },
    {
      id: 4,
      title: 'Average Score',
      value: `${avgScore.toFixed(1)}%`,
      icon: <BarChart2 className="text-green-500" />,
      color: 'green',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your classroom activities</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Activity and assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <RecentActivity submissions={recentSubmissions} />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Assignments</h2>
          <UpcomingAssignments assignments={assignments} />
        </div>
      </div>
    </div>
  );
}
