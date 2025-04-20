import { useState } from 'react';
import { FileText, PenTool, CheckCircle2, HelpCircle } from 'lucide-react';
import HandwritingRecognizer from '../../components/evaluation/HandwritingRecognizer';
import DigitalAnswerEvaluator from '../../components/evaluation/DigitalAnswerEvaluator';

export default function AnswerEvaluation() {
  const [activeTab, setActiveTab] = useState('digital');
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Answer Evaluation</h1>
        <p className="text-gray-600 mt-1">Evaluate digital or handwritten answers using AI</p>
      </div>
      
      {/* Tab navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('digital')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'digital'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText size={18} className="mr-2" />
                Digital Answer Evaluation
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('handwriting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'handwriting'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <PenTool size={18} className="mr-2" />
                Handwriting Recognition
              </div>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab content */}
      <div>
        {activeTab === 'digital' ? (
          <DigitalAnswerEvaluator />
        ) : (
          <HandwritingRecognizer />
        )}
      </div>
      
      {/* Information cards */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">How Answer Evaluation Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-primary-500 mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">
              Our system uses natural language processing to understand context, evaluate arguments, and check mathematical correctness based on expert knowledge.
            </p>
          </div>
          
          <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-secondary-500 mb-3">
              <PenTool size={24} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Handwriting Recognition</h3>
            <p className="text-sm text-gray-600">
              Advanced OCR technology accurately converts handwritten answers into digital text, recognizing various writing styles and mathematical notations.
            </p>
          </div>
          
          <div className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-accent-500 mb-3">
              <HelpCircle size={24} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Fairness & Consistency</h3>
            <p className="text-sm text-gray-600">
              Every answer is evaluated using the same criteria, eliminating bias and ensuring consistent grading across all student submissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
