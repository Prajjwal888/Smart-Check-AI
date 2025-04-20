import { useState } from 'react';
import { MessageSquare, BarChart2, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function StudentFeedback() {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const feedbackData = [
    {
      id: '1',
      subject: 'Mathematics',
      assignment: 'Calculus Quiz 3',
      date: '2025-04-15',
      score: 92,
      strengths: [
        'Excellent understanding of derivatives',
        'Clear step-by-step problem solving',
        'Good application of chain rule'
      ],
      improvements: [
        'Review integration techniques',
        'Practice more complex problems'
      ],
      teacherComments: 'Great work on derivatives! To improve further, focus on integration problems, especially those involving trigonometric functions.'
    },
    {
      id: '2',
      subject: 'Physics',
      assignment: 'Forces Lab Report',
      date: '2025-04-12',
      score: 88,
      strengths: [
        'Well-structured experiment methodology',
        'Accurate data collection',
        'Good analysis of results'
      ],
      improvements: [
        'Include more error analysis',
        'Expand on theoretical background'
      ],
      teacherComments: 'Your lab report shows good experimental technique. Consider adding more discussion about potential sources of error and their impact on results.'
    },
    {
      id: '3',
      subject: 'English',
      assignment: 'Literary Analysis Essay',
      date: '2025-04-10',
      score: 85,
      strengths: [
        'Strong thesis statement',
        'Good use of textual evidence',
        'Clear writing style'
      ],
      improvements: [
        'Develop analysis further',
        'Include more critical perspectives'
      ],
      teacherComments: 'Your essay demonstrates good analytical skills. To improve, try incorporating more diverse critical perspectives and deeper analysis of literary devices.'
    }
  ];

  const filteredFeedback = selectedSubject === 'all'
    ? feedbackData
    : feedbackData.filter(f => f.subject.toLowerCase() === selectedSubject.toLowerCase());

  const averageScore = feedbackData.reduce((acc, curr) => acc + curr.score, 0) / feedbackData.length;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feedback & Progress</h1>
        <p className="text-gray-600 mt-1">Track your academic progress and view teacher feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-primary-600">{averageScore.toFixed(1)}%</p>
            </div>
            <BarChart2 className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-primary-600">{feedbackData.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Latest Feedback</p>
              <p className="text-2xl font-bold text-primary-600">
                {new Date(feedbackData[0].date).toLocaleDateString()}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary-500" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="form-input w-full md:w-auto"
        >
          <option value="all">All Subjects</option>
          <option value="mathematics">Mathematics</option>
          <option value="physics">Physics</option>
          <option value="english">English</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredFeedback.map((feedback) => (
          <div key={feedback.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{feedback.assignment}</h3>
                <p className="text-sm text-gray-500">{feedback.subject} • {feedback.date}</p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {feedback.score}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-green-800 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="rounded-full bg-green-200 p-1 mr-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-sm text-gray-600">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-amber-800 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="rounded-full bg-amber-200 p-1 mr-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      </div>
                      <span className="text-sm text-gray-600">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Teacher Comments</h4>
              <p className="text-sm text-gray-600">{feedback.teacherComments}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}