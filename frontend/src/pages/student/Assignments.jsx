import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Assignments() {
  const { assignments } = useAppContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const studentAssignments = [
    {
      id: '1',
      title: 'Advanced Algebra Quiz',
      subject: 'Mathematics',
      dueDate: '2025-04-20T23:59:59',
      status: 'pending',
      score: null
    },
    {
      id: '2',
      title: 'History Essay - World War II',
      subject: 'History',
      dueDate: '2025-04-22T23:59:59',
      status: 'submitted',
      score: 85
    },
    {
      id: '3',
      title: 'Chemistry Lab Report',
      subject: 'Chemistry',
      dueDate: '2025-04-18T23:59:59',
      status: 'late',
      score: null
    }
  ];

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
        }, 1000);
      }
    }, 500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-1">View and submit your assignments</p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Submit Assignment</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
                Choose File
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {selectedFile && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                  </div>
                )}
                <button
                  onClick={handleUpload}
                  className="btn btn-primary mt-4"
                  disabled={uploadProgress > 0}
                >
                  Upload Assignment
                </button>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT (Max. 10MB)
            </p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Your Assignments</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {studentAssignments.map((assignment) => (
            <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {assignment.title}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">{assignment.subject}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                  {assignment.score !== null && (
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      Score: {assignment.score}%
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                  View Details
                </button>
                {assignment.status === 'pending' && (
                  <button className="btn btn-primary">
                    Submit Assignment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}