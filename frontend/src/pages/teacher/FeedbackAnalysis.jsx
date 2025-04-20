import { useState } from 'react';
import { BarChart2, LineChart, PieChart, Users } from 'lucide-react';
import PerformanceTrends from '../../components/feedback/PerformanceTrends';
import WeakPointsAnalysis from '../../components/feedback/WeakPointsAnalysis';
import FeedbackGenerator from '../../components/feedback/FeedbackGenerator';

export default function FeedbackAnalysis() {
  const [activeTab, setActiveTab] = useState('performance');
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Analysis</h1>
        <p className="text-gray-600 mt-1">Track performance trends and generate personalized feedback</p>
      </div>
      
      {/* Tab navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <LineChart size={18} className="mr-2" />
                Performance Trends
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('weakpoints')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'weakpoints'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <PieChart size={18} className="mr-2" />
                Weak Points Analysis
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedback'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                Feedback Generator
              </div>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab content */}
      <div>
        {activeTab === 'performance' && <PerformanceTrends />}
        {activeTab === 'weakpoints' && <WeakPointsAnalysis />}
        {activeTab === 'feedback' && <FeedbackGenerator />}
      </div>
    </div>
  );
}
