import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, FilePlus, Calendar, Clock } from 'lucide-react';

export default function AssignmentCreator() {
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: '',
    subject: '',
    dueDate: '',
    totalPoints: 100,
    instructions: '',
  });
  
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'Section 1',
      expanded: true,
      questions: []
    }
  ]);
  
  // Sample question bank
  const questionBank = [
    {
      id: 'q1',
      type: 'multiple-choice',
      text: 'What is the capital of France?',
      options: [
        { id: 'a', text: 'London' },
        { id: 'b', text: 'Berlin' },
        { id: 'c', text: 'Paris' },
        { id: 'd', text: 'Madrid' }
      ],
      correctAnswer: 'c',
      difficulty: 'easy',
      subject: 'Geography'
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      text: 'What is the value of π (pi) to two decimal places?',
      options: [
        { id: 'a', text: '3.14' },
        { id: 'b', text: '3.15' },
        { id: 'c', text: '3.16' },
        { id: 'd', text: '3.17' }
      ],
      correctAnswer: 'a',
      difficulty: 'medium',
      subject: 'Mathematics'
    },
    {
      id: 'q3',
      type: 'true-false',
      text: 'The Great Wall of China is visible from space with the naked eye.',
      options: [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' }
      ],
      correctAnswer: 'false',
      difficulty: 'medium',
      subject: 'Geography'
    },
    {
      id: 'q4',
      type: 'short-answer',
      text: 'What is the chemical symbol for gold?',
      correctAnswer: 'Au',
      difficulty: 'easy',
      subject: 'Chemistry'
    },
    {
      id: 'q5',
      type: 'short-answer',
      text: 'Who wrote "Romeo and Juliet"?',
      correctAnswer: 'William Shakespeare',
      difficulty: 'easy',
      subject: 'Literature'
    },
    {
      id: 'q6',
      type: 'essay',
      text: 'Discuss the causes and effects of climate change.',
      difficulty: 'hard',
      subject: 'Environmental Science'
    },
    {
      id: 'q7',
      type: 'coding',
      text: 'Write a function that returns the factorial of a given number.',
      difficulty: 'medium',
      subject: 'Computer Science'
    }
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails({
      ...assignmentDetails,
      [name]: value
    });
  };
  
  // Handle section toggle
  const toggleSection = (sectionId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };
  
  // Add new section
  const addSection = () => {
    const newSectionId = sections.length > 0 
      ? Math.max(...sections.map(s => s.id)) + 1
      : 1;
      
    setSections([
      ...sections,
      {
        id: newSectionId,
        title: `Section ${newSectionId}`,
        expanded: true,
        questions: []
      }
    ]);
  };
  
  // Remove section
  const removeSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };
  
  // Add question to section
  const addQuestionToSection = (sectionId, questionId) => {
    const question = questionBank.find(q => q.id === questionId);
    if (!question) return;
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            questions: [...section.questions, question]
          }
        : section
    ));
  };
  
  // Remove question from section
  const removeQuestionFromSection = (sectionId, questionIndex) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            questions: section.questions.filter((_, index) => index !== questionIndex)
          }
        : section
    ));
  };
  
  // Get question type display name
  const getQuestionTypeDisplay = (type) => {
    const types = {
      'multiple-choice': 'Multiple Choice',
      'true-false': 'True/False',
      'short-answer': 'Short Answer',
      'essay': 'Essay',
      'coding': 'Coding Problem'
    };
    return types[type] || type;
  };
  
  // Calculate total questions and points
  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Assignment details */}
      <div className="md:col-span-2">
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4">Assignment Details</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={assignmentDetails.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter assignment title"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={assignmentDetails.subject}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select a subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Points
                </label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  value={assignmentDetails.totalPoints}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={assignmentDetails.dueDate}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              
              <div>
                <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="dueTime"
                    name="dueTime"
                    className="form-input pl-10"
                  />
                  <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={assignmentDetails.instructions}
                onChange={handleInputChange}
                rows={4}
                className="form-input"
                placeholder="Enter instructions for students..."
              />
            </div>
          </div>
        </div>
        
        {/* Sections and questions */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Assignment Content</h3>
            <button
              onClick={addSection}
              className="btn bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm py-1.5"
            >
              <Plus size={16} className="mr-1" />
              Add Section
            </button>
          </div>
          
          {sections.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-gray-500">No sections added yet. Click "Add Section" to start building your assignment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="card p-0 overflow-hidden">
                  <div 
                    className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center">
                      {section.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <h4 className="font-medium ml-1">{section.title}</h4>
                      <span className="ml-2 text-sm text-gray-500">
                        ({section.questions.length} questions)
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(section.id);
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {section.expanded && (
                    <div className="p-4">
                      {section.questions.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No questions added to this section yet.</p>
                          <p className="text-sm text-gray-500">Drag questions from the question bank or click "Add from Bank".</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {section.questions.map((question, index) => (
                            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 flex justify-between">
                              <div>
                                <div className="flex items-center mb-1">
                                  <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                    {getQuestionTypeDisplay(question.type)}
                                  </span>
                                  <span className="text-xs ml-2 capitalize text-gray-500">
                                    {question.difficulty}
                                  </span>
                                </div>
                                <p className="text-sm">{question.text}</p>
                              </div>
                              <button 
                                onClick={() => removeQuestionFromSection(section.id, index)}
                                className="text-gray-400 hover:text-red-500 self-start"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <select
                          className="form-input text-sm w-auto"
                          onChange={(e) => {
                            if (e.target.value) {
                              addQuestionToSection(section.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          value=""
                        >
                          <option value="">Add question from bank...</option>
                          {questionBank.map((q) => (
                            <option key={q.id} value={q.id}>
                              {q.text.length > 50 ? q.text.substring(0, 50) + '...' : q.text}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Sidebar */}
      <div>
        <div className="card p-5 sticky top-6">
          <h3 className="text-lg font-medium mb-4">Assignment Summary</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Sections: {sections.length}</p>
              <p className="text-sm text-gray-500">Total Questions: {totalQuestions}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p>{assignmentDetails.title || 'Untitled'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Subject</label>
              <p>{assignmentDetails.subject || 'N/A'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Total Points</label>
              <p>{assignmentDetails.totalPoints}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Due Date</label>
              <p>{assignmentDetails.dueDate || 'Not Set'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Instructions</label>
              <p>{assignmentDetails.instructions || 'No instructions provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
