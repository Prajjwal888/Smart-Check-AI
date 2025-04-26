import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';
import axios from 'axios';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // assignmentId -> file
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/getAssignments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAssignments(response.data.assignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    fetchAssignments();
  }, []);

  const handleFileSelect = (assignmentId, e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: e.target.files[0] }));
      setUploadProgress(0);
    }
  };

  const handleUpload = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);
  
    try {
      setUploadProgress(10); // Start progress
      const res = await axios.post(
        "http://localhost:5000/api/student/submitAssignment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );
      // Success: show message, reset state, etc.
      setUploadProgress(100);
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: null }));
      alert("Assignment submitted successfully!");
      // Optionally refetch assignments/submissions here
      // fetchAssignments();
    } catch (err) {
      setUploadProgress(0);
      alert("Upload failed!");
    }
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

      <div className="card overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Your Assignments</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="p-6 hover:bg-gray-50 transition-colors">
              
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status ?? 'pending')}`}>
                    {assignment.status
                      ? assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)
                      : 'Pending'}
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
                {['pending', 'flagged', 'late'].includes(assignment.status) && (
                  <>
                    <label htmlFor={`file-upload-${assignment._id}`} className="btn btn-secondary cursor-pointer">
                      Choose File
                      <input
                        id={`file-upload-${assignment._id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelect(assignment._id, e)}
                      />
                    </label>
                    {selectedFiles[assignment._id] && (
                      <span className="ml-2 text-xs text-gray-500">{selectedFiles[assignment._id].name}</span>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpload(assignment._id)}
                      disabled={!selectedFiles[assignment._id] || uploadProgress > 0}
                    >
                      Submit Assignment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}