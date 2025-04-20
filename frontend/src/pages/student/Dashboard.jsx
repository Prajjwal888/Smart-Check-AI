import {
  BookOpen, Clock, CheckCircle2,
  AlertTriangle, BarChart2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import StatCard from '../../components/dashboard/StatCard';
import UpcomingAssignments from '../../components/dashboard/UpcomingAssignments';

export default function StudentDashboard() {
  const { assignments } = useAppContext();

  // Mock student stats
  const stats = [
    {
      id: 1,
      title: 'Completed Assignments',
      value: '12',
      icon: <CheckCircle2 className="text-green-500" />,
      color: 'green'
    },
    {
      id: 2,
      title: 'Pending Assignments',
      value: '3',
      icon: <Clock className="text-amber-500" />,
      color: 'amber'
    },
    {
      id: 3,
      title: 'Average Score',
      value: '85%',
      icon: <BarChart2 className="text-blue-500" />,
      color: 'blue'
    },
    {
      id: 4,
      title: 'Practice Questions',
      value: '45',
      icon: <BookOpen className="text-purple-500" />,
      color: 'purple'
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your academic progress</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Performance and assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
            <div className="space-y-4">
              {['Mathematics', 'Science', 'History', 'English'].map((subject) => {
                const percent = Math.floor(Math.random() * 20) + 80;
                return (
                  <div key={subject}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{subject}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {percent}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Assignments</h2>
          <UpcomingAssignments assignments={assignments} />
        </div>
      </div>

      {/* Recent feedback */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              assignment: 'Mathematics Quiz',
              score: 92,
              feedback: 'Excellent work on derivatives! Review integration techniques.',
              date: '2025-04-15'
            },
            {
              assignment: 'History Essay',
              score: 88,
              feedback: 'Good analysis. Include more primary sources next time.',
              date: '2025-04-14'
            }
          ].map((item, index) => (
            <div key={index} className="card p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{item.assignment}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {item.score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
