"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/utils/db';
import MockInterview, { CandidateSession, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Mic, Square } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModel';
import moment from 'moment';
import QuestionsSection from './_components/Questions';
import RecordAnswerSection from './_components/RecordAnswerSection';

function StartInterview() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [candidateSession, setCandidateSession] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviweQuestions, setMockInterviewQuestions] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      
      // Get candidate session first
      const sessionResult = await db
        .select()
        .from(CandidateSession)
        .where(eq(CandidateSession.uniqueToken, params.token));
      
      if (!sessionResult || sessionResult.length === 0) {
        // Invalid candidate token
        router.push('/exam/invalid');
        return;
      }

      const session = sessionResult[0];
      setCandidateSession(session);

      // Check if already completed
      if (session.status === 'completed') {
        router.push(`/exam/${params.token}/results`);
        return;
      }

      // Get interview details
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, session.mockId));
      
      if (result && result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp.replace(/```/g, ''));
        setMockInterviewQuestions(jsonMockResp);
        setInterviewData(result[0]);
      } else {
        console.error("No interview found with this ID");
        router.push('/exam/invalid');
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      router.push('/exam/invalid');
    } finally {
      setLoading(false);
    }
  };

  const startStopRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real implementation, you would stop the actual recording here
      toast.success('Recording stopped');
    } else {
      setIsRecording(true);
      // In a real implementation, you would start the actual recording here
      toast.success('Recording started');
    }
  };

  const updateUserAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide an answer before proceeding');
      return;
    }

    setLoading(true);
    
    try {
      const feedbackPrompt = `Question: ${mockInterviweQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;
      
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: candidateSession.mockId,
        question: mockInterviweQuestions[activeQuestionIndex]?.question,
        correctAns: mockInterviweQuestions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: candidateSession.candidateEmail,
        createdAt: moment().format('DD-MM-yyyy')
      });

      if (resp) {
        toast.success('Answer recorded successfully');
        setUserAnswer('');
        setResults([...results, JsonFeedbackResp]);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Error saving your answer');
    } finally {
      setLoading(false);
    }
  };

  const goToNextQuestion = () => {
    if (activeQuestionIndex < mockInterviweQuestions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCompleteInterview = async () => {
    if (candidateSession) {
      try {
        // Update candidate session to completed
        await db.update(CandidateSession)
          .set({ 
            status: 'completed',
            completedAt: new Date()
          })
          .where(eq(CandidateSession.uniqueToken, params.token));
        
        // Redirect to results page
        router.push(`/exam/${params.token}/results`);
      } catch (error) {
        console.error('Error completing interview:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700">Loading interview questions...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.664 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {interviewData?.jobPosition || 'Technical Interview Practice'}
          </h1>
          <p className="text-slate-600 mt-2">
            Answer each question clearly and professionally as you would in a real interview.
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-blue-700 text-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          Question {activeQuestionIndex + 1} of {mockInterviweQuestions?.length || 0}
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionsSection 
          mockInterviweQuestions={mockInterviweQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        <RecordAnswerSection 
          mockInterviweQuestions={mockInterviweQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          candidateSession={candidateSession}
        />
      </div>
      
      <div className="max-w-7xl mx-auto mt-10 flex justify-between">
        <Button 
          variant="outline" 
          onClick={goToPreviousQuestion}
          disabled={activeQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous Question
        </Button>
        
        <div>
          {activeQuestionIndex === mockInterviweQuestions?.length - 1 ? (
            <Button 
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              onClick={handleCompleteInterview}
            >
              <CheckCircle size={16} />
              Complete Interview
            </Button>
          ) : (
            <Button 
              onClick={goToNextQuestion}
              className="flex items-center gap-2"
            >
              Next Question
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <footer className="mt-8 text-center text-slate-600 text-sm">
        <p>Remember to answer truthfully and clearly. Your responses are being recorded for feedback.</p>
      </footer>
    </div>
  );
}

export default StartInterview; 