import { useState } from 'react';
import { User, Mail, Phone, Book, Calendar, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function StudentProfile() {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock student data
  const studentData = {
    name: 'Alex Chen',
    email: 'alex.chen@student.edu',
    phone: '+1 (555) 123-4567',
    grade: '11th Grade',
    dateOfBirth: '2007-05-15',
    address: '123 Student Lane, Academic City, AC 12345',
    subjects: ['Mathematics', 'Physics', 'Computer Science', 'English'],
    achievements: [
      'Science Fair Winner 2024',
      'Math Olympiad Finalist',
      'Perfect Attendance 2024'
    ]
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your profile information</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={studentData.name}
                  />
                ) : (
                  <div className="flex items-center">
                    <User size={18} className="text-gray-400 mr-2" />
                    <span>{studentData.name}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="form-input"
                    defaultValue={studentData.email}
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-2" />
                    <span>{studentData.email}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-input"
                    defaultValue={studentData.phone}
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-2" />
                    <span>{studentData.phone}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={studentData.grade}
                  />
                ) : (
                  <div className="flex items-center">
                    <Book size={18} className="text-gray-400 mr-2" />
                    <span>{studentData.grade}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="form-input"
                    defaultValue={studentData.dateOfBirth}
                  />
                ) : (
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-400 mr-2" />
                    <span>{new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={studentData.address}
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-400 mr-2" />
                    <span>{studentData.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Academic Information */}
          <div className="card p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Enrolled Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {studentData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Achievements</h3>
              <ul className="space-y-2">
                {studentData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Profile Summary Card */}
          <div className="card p-6 text-center">
            <div className="mb-4">
              <img
                src={user?.avatar || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
            </div>
            <h3 className="font-medium text-lg">{studentData.name}</h3>
            <p className="text-gray-500 text-sm">{studentData.grade}</p>
            
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary-600">92%</div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">15</div>
                  <div className="text-sm text-gray-500">Assignments</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card p-6 mt-6">
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">View Assignments</button>
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full">
                Check Feedback
              </button>
              <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 w-full">
                Practice Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}