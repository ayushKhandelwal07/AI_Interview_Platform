"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Award, Home, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export default function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [openQuestions, setOpenQuestions] = useState({});
  const router = useRouter();
  
  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select().from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewid))
      .orderBy(UserAnswer.id);
    
    // Transform the data to include an id field
    const transformedData = result.map((item, index) => ({
      ...item,
      id: index + 1
    }));
    
    setFeedbackList(transformedData);
  };

  const calculateAverageRating = () => {
    if (feedbackList.length === 0) {
      return 0;
    }
    
    // Only count questions that have been answered
    const answeredQuestions = feedbackList.filter(item => item.rating > 0);
    if (answeredQuestions.length === 0) {
      return 0;
    }
    
    const totalRating = answeredQuestions.reduce((sum, item) => sum + Number(item.rating), 0);
    const averageRating = totalRating / answeredQuestions.length;
    return averageRating.toFixed(1);
  };
  
  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const getRatingColor = (rating) => {
    if (rating <= 2) return 'text-red-500';
    if (rating <= 3.5) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getProgressColor = (rating) => {
    if (rating <= 2) return 'bg-red-500';
    if (rating <= 3.5) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const avgRating = calculateAverageRating();
  const progressPercentage = (avgRating / 5) * 100;
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <Award className="h-16 w-16 text-green-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Interview Feedback
        </h1>
        
        {feedbackList.length > 0 ? (
          <>
            <p className="text-xl text-gray-600 mb-6">
              Here's how you performed in your recent interview
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Overall Rating</h2>
                <div className="flex items-center">
                  <span className={`text-3xl font-bold ${getRatingColor(avgRating)}`}>
                    {avgRating}
                  </span>
                  <span className="text-2xl text-gray-400 ml-1">/5</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className={`h-4 rounded-full ${getProgressColor(avgRating)}`} 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Needs Improvement</span>
                <span>Satisfactory</span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="mb-8 text-left p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                <p className="text-blue-700">
                  Review each question below to see your answers, correct responses, and personalized feedback.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {feedbackList.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(item.id)}
                    className="w-full p-4 text-left bg-blue-600 hover:bg-blue-700 text-white flex justify-between items-center"
                  >
                    <div className="flex-1 font-medium">{item.question}</div>
                    <div className="flex items-center ml-3">
                      {item.rating > 0 && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${
                          item.rating <= 2 ? 'bg-red-100 text-red-800' : 
                          item.rating <= 3 ? 'bg-amber-100 text-amber-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.rating}/5
                        </span>
                      )}
                      {openQuestions[item.id] ? 
                        <ChevronUp className="h-5 w-5" /> : 
                        <ChevronDown className="h-5 w-5" />
                      }
                    </div>
                  </button>
                  
                  {openQuestions[item.id] && item.rating > 0 && (
                    <div className="p-4 bg-gray-50">
                      <div className="mb-6">
                        <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          Your Answer
                        </h3>
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                          {item.userAns || "No answer provided"}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Ideal Answer
                        </h3>
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                          {(item.correctAns || "Not provided").replace("**", '')}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2">
                          <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                          Feedback
                        </h3>
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                          {(item.feedback || "No feedback provided").replace("**", '')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center p-10">
            <h2 className="text-2xl font-bold text-gray-500">No Feedback Found</h2>
            <p className="text-gray-400 mt-2">No interview results are available at this time.</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={() => router.replace('/dashboard')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
