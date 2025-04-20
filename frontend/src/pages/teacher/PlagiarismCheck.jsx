import { useState } from 'react';
import { Upload, X, AlertTriangle, FileText, BarChart } from 'lucide-react';
import FileUploader from '../../components/plagiarism/FileUploader';
import SimilarityReport from '../../components/plagiarism/SimilarityReport';

export default function PlagiarismCheck() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    setIsProcessing(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const isPlagiarized = file.name.toLowerCase().includes('plagiarized');

      setIsProcessing(false);
      setResult({
        score: isPlagiarized ? 72 : 15,
        matches: [
          {
            text: "The mitochondria is the powerhouse of the cell, responsible for cellular respiration and energy production through ATP synthesis.",
            similarity: isPlagiarized ? 95 : 40,
            source: "Biology textbook (Smith et al., 2023)",
          },
          {
            text: "These organelles convert nutrients into energy through a process called oxidative phosphorylation, which occurs along the inner mitochondrial membrane.",
            similarity: isPlagiarized ? 82 : 25,
            source: "ScienceDirect.com article #24601",
          },
          {
            text: "Different cell types have different numbers of mitochondria based on their energy needs, with muscle cells containing many more than other cell types.",
            similarity: isPlagiarized ? 67 : 10,
            source: "Educational resource: CellBiology.edu",
          },
        ],
      });
    }, 3000);
  };

  const resetCheck = () => {
    setUploadedFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Plagiarism Check</h1>
        <p className="text-gray-600 mt-1">Analyze submissions for plagiarism and similar content</p>
      </div>

      {!uploadedFile ? (
        <FileUploader onFileUpload={handleFileUpload} />
      ) : (
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FileText className="text-gray-500 mr-2" size={20} />
              <div>
                <h3 className="font-medium">{uploadedFile.name}</h3>
                <p className="text-sm text-gray-500">
                  {Math.round(uploadedFile.size / 1024)} KB
                </p>
              </div>
            </div>
            <button onClick={resetCheck} className="p-1.5 rounded-full hover:bg-gray-100">
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {isProcessing ? (
            <div className="py-10 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-500">Analyzing document for plagiarism...</p>
              <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
            </div>
          ) : (
            result && <SimilarityReport result={result} />
          )}
        </div>
      )}

      {/* Best practices section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Plagiarism Detection Best Practices</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-primary-500 mb-3">
              <BarChart size={24} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">How It Works</h3>
            <p className="text-sm text-gray-600">
              Our AI compares submissions against a vast database of academic sources, previous assignments, and online content using advanced NLP algorithms.
            </p>
          </div>

          <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-amber-500 mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">What To Look For</h3>
            <p className="text-sm text-gray-600">
              Similarity scores above 30% may indicate potential plagiarism. Review matched sources and highlighted sections to make an informed assessment.
            </p>
          </div>

          <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-green-500 mb-3">
              <Upload size={24} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Supported Formats</h3>
            <p className="text-sm text-gray-600">
              Upload documents in DOC, DOCX, PDF, or TXT formats. For code, we support Python, Java, C++, JavaScript and other major programming languages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
