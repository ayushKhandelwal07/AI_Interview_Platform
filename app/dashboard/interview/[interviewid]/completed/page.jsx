"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/utils/db';
import MockInterview, { CandidateSession } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { CheckCircle, Clock, FileText, User, Copy, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function InterviewCompleted({ params }) {
  const [candidateSession, setCandidateSession] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const candidateToken = searchParams.get('candidate');

  useEffect(() => {
    if (candidateToken) {
      loadCompletionData();
    }
  }, [candidateToken]);

  const loadCompletionData = async () => {
    try {
      // Get candidate session
      const sessionResult = await db
        .select()
        .from(CandidateSession)
        .where(eq(CandidateSession.uniqueToken, candidateToken));

      if (sessionResult && sessionResult.length > 0) {
        setCandidateSession(sessionResult[0]);

        // Get interview details
        const interviewResult = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, sessionResult[0].mockId));

        if (interviewResult && interviewResult.length > 0) {
          setInterviewData(interviewResult[0]);
        }
      }
    } catch (error) {
      console.error('Error loading completion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferenceNumber = () => {
    if (candidateToken) {
      navigator.clipboard.writeText(candidateToken);
      toast('Reference number copied to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading completion details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Completed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for taking the time to complete this interview.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Interview Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold mb-4">Interview Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Candidate</p>
                  <p className="font-medium">{candidateSession?.candidateName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Position</p>
                  <p className="font-medium">{interviewData?.jobPosition}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Completed At</p>
                  <p className="font-medium">
                    {candidateSession?.completedAt ? 
                      new Date(candidateSession.completedAt).toLocaleString() : 
                      'Just now'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Copy className="h-5 w-5 mr-3 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">Reference Number</p>
                  <p className="font-medium font-mono text-sm">{candidateToken?.slice(-8)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* What Happens Next */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Review Process</h4>
                    <p className="text-gray-600 text-sm">
                      Our team will carefully review your responses and evaluate your performance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Feedback & Results</h4>
                    <p className="text-gray-600 text-sm">
                      You will receive detailed feedback and results within 2-3 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Next Steps</h4>
                    <p className="text-gray-600 text-sm">
                      If selected, we will contact you for the next round of interviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Please save your reference number: <span className="font-mono font-medium">{candidateToken?.slice(-8)}</span></li>
                <li>• Check your email regularly for updates on your application</li>
                <li>• If you have any questions, contact us with your reference number</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={copyReferenceNumber}
                variant="outline"
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white hover:text-white rounded-xl"
              >
                <Copy className="h-4 w-4" />
                Copy Reference Number
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white hover:text-white rounded-xl"
              >
                <Printer className="h-4 w-4" />
                Print Confirmation
              </Button>
              <Button
                onClick={() => window.close()}
                className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white rounded-xl"
              >
                Close Window
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Thank you for your interest in joining our team!</p>
        </div>
      </div>
    </div>
  );
}

export default InterviewCompleted; 