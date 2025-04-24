import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, FileText, Loader2 } from "lucide-react";

export default function AnswerEvaluation() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState({
    assignments: false,
    submissions: false,
  });
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch assignments created by the current teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading((prev) => ({ ...prev, assignments: true }));
      setError(null);
      try {
        const res = await axios.get("http://localhost:5000/api/getAssignments");
        setAssignments(res.data?.assignments || []);
      } catch (err) {
        setError("Failed to load assignments");
        console.error("Error fetching assignments", err);
        setAssignments([]);
      } finally {
        setLoading((prev) => ({ ...prev, assignments: false }));
      }
    };
    fetchAssignments();
  }, []);

  // Fetch submissions when assignment is selected
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedAssignment) {
        setSubmissions([]);
        return;
      }

      setLoading((prev) => ({ ...prev, submissions: true }));
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/getSubmissions/${selectedAssignment}`
        );
        setSubmissions(res.data);
      } catch (err) {
        setError("Failed to load submissions");
        console.error("Error fetching submissions", err);
      } finally {
        setLoading((prev) => ({ ...prev, submissions: false }));
      }
    };

    fetchSubmissions();
  }, [selectedAssignment]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedAssignment) {
      setError("Please select an assignment and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", selectedAssignment);

    try {
      // Upload file logic here
      const res = await axios.post(
        "http://localhost:5000/api/uploadFile",
        formData
      );
      alert("File uploaded successfully!");
      // Handle response, e.g., refresh submissions or other logic
    } catch (err) {
      setError("Failed to upload file");
      console.error("Error uploading file", err);
    }
  };

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Answer Evaluation</h1>
        <p className="text-gray-600 mt-1">
          Evaluate student submissions for correctness and plagiarism.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Select Assignment and Upload File Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Assignment
          </label>
          <select
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            disabled={loading.assignments}
          >
            <option value="">-- Choose an assignment --</option>
            {Array.isArray(assignments) &&
              assignments.map((assignment) => (
                <option key={assignment._id} value={assignment._id}>
                  {assignment.title} - {assignment.course} ({assignment.subject}
                  )
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File
          </label>
          <input
            type="file"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleFileChange}
            disabled={loading.submissions}
          />
        </div>

        <div>
          <button
            onClick={handleUpload}
            disabled={loading.submissions || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            {loading.submissions ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Uploading...
              </>
            ) : (
              "Upload and Evaluate Submission"
            )}
          </button>
        </div>
      </div>

      {/* Loading state for submissions */}
      {loading.submissions && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      )}

      {/* Submissions list */}
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {submission.studentId?.name || "Unknown Student"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {submission.studentId?.email || "No email"}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <span
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                    submission.status === "flagged"
                      ? "bg-red-100 text-red-800"
                      : submission.status === "evaluated"
                      ? "bg-green-100 text-green-800"
                      : submission.status === "late"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.status}
                </span>
                {submission.grade && (
                  <span className="text-sm font-medium">
                    Grade: {submission.grade}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View Submission File
              </a>
            </div>

            {/* Plagiarism info */}
            {submission.status === "flagged" && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BarChart className="w-4 h-4" />
                  Plagiarism Score: {submission.plagiarismScore}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading.submissions &&
        submissions.length === 0 &&
        selectedAssignment && (
          <div className="text-center py-8 text-gray-500">
            No submissions found for this assignment
          </div>
        )}
    </div>
  );
}
