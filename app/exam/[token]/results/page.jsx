"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/utils/db';
import MockInterview, { CandidateSession, UserAnswer, InterviewAnalytics } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ExamResults() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [candidateSession, setCandidateSession] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.token) {
      loadResultsData();
    }
  }, [params.token]);

  const loadResultsData = async () => {
    try {
      setLoading(true);
      
      // Get candidate session
      const sessionResult = await db
        .select()
        .from(CandidateSession)
        .where(eq(CandidateSession.uniqueToken, params.token));

      if (!sessionResult || sessionResult.length === 0) {
        setError('Invalid or expired interview link');
        setLoading(false);
        return;
      }

      const session = sessionResult[0];
      setCandidateSession(session);

      // Get interview details
      const interviewResult = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, session.mockId));

      if (!interviewResult || interviewResult.length === 0) {
        setError('Interview not found');
        setLoading(false);
        return;
      }

      setInterviewData(interviewResult[0]);

      // Send completion notification to admin (without scores)
      await sendCompletionToAdmin(session.mockId);

      setLoading(false);

    } catch (error) {
      console.error('Error loading results:', error);
      setError('An error occurred while loading results');
      setLoading(false);
    }
  };

  const sendCompletionToAdmin = async (mockId) => {
    try {
      // Simple completion notification to admin
      const completionData = {
        candidateToken: params.token,
        mockId: mockId,
        candidateName: candidateSession?.candidateName,
        candidateEmail: candidateSession?.candidateEmail,
        interviewDetails: {
          position: interviewData?.jobPosition,
          experience: interviewData?.jobExperience,
          description: interviewData?.jobDesc
        },
        completedAt: candidateSession?.completedAt || new Date(),
        status: 'completed'
      };

      // Update analytics with completion only
      const existingAnalytics = await db
        .select()
        .from(InterviewAnalytics)
        .where(eq(InterviewAnalytics.mockId, mockId));

      if (existingAnalytics.length > 0) {
        // Update existing analytics
        const current = existingAnalytics[0];
        const newCompletedInterviews = parseInt(current.completedInterviews || 0) + 1;
        
        await db
          .update(InterviewAnalytics)
          .set({
            completedInterviews: newCompletedInterviews.toString(),
            lastUpdated: new Date()
          })
          .where(eq(InterviewAnalytics.mockId, mockId));
      } else {
        // Create new analytics record
        await db.insert(InterviewAnalytics).values({
          mockId: mockId,
          completedInterviews: '1',
          lastUpdated: new Date()
        });
      }

      console.log('Interview completion sent to admin platform');
    } catch (error) {
      console.error('Error sending completion to admin:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            🎉 Interview Completed!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you {candidateSession?.candidateName}
          </p>
          <p className="text-gray-500">
            for taking the time to complete the interview
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ✅ Successfully Submitted
              </h3>
              <p className="text-green-700 text-sm">
                Your interview responses have been recorded and sent to our team for review.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📧 What's Next?
              </h3>
              <p className="text-blue-700 text-sm">
                We'll review your responses and get back to you within 2-3 business days.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <strong>Position:</strong> {interviewData?.jobPosition}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Completed:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleGoHome}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Home className="h-5 w-5" />
          Return Home
        </Button>

        {/* Footer Message */}
        <p className="text-xs text-gray-400 mt-6">
          Thank you for your interest in joining our team! 🚀
        </p>
      </div>
    </div>
  );
}

export default ExamResults; 