"use client"

import { db } from '@/utils/db';
import MockInterview, { CandidateSession } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon, User, FileText } from 'lucide-react';
import Webcam from "react-webcam";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [candidateSession, setCandidateSession] = useState(null);
  const [webCamEnable, setWebCamEnable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const candidateToken = searchParams.get('candidate');
  const isCandidate = !!candidateToken;

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  /*
  get interview details of user using uId 
  */
  const GetInterviewDetails = async () => {
    try {
      // Get interview details
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewid));
      setInterviewData(result[0]);

      // If candidate mode, get candidate session
      if (candidateToken) {
        const sessionResult = await db
          .select()
          .from(CandidateSession)
          .where(eq(CandidateSession.uniqueToken, candidateToken));
        
        if (sessionResult && sessionResult.length > 0) {
          setCandidateSession(sessionResult[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartInterview = () => {
    const startUrl = candidateToken 
      ? `/dashboard/interview/${params.interviewid}/start?candidate=${candidateToken}`
      : `/dashboard/interview/${params.interviewid}/start`;
    window.location.href = startUrl;
  }

  const handleEnableWebcam = () => {
    setWebCamEnable(true);
  }

  return (
    <div className={isCandidate ? "min-h-screen bg-gray-50 px-4 py-8" : "max-w-7xl mx-auto px-4 sm:px-6 py-12"}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {isCandidate ? 'Welcome to Your Interview' : "Let's Get Started"}
        </h1>
        {isCandidate && candidateSession && (
          <p className="text-lg text-gray-600">
            Hello {candidateSession.candidateName}, please review the details below before starting
          </p>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className={isCandidate ? "max-w-6xl mx-auto grid md:grid-cols-2 gap-8" : "grid md:grid-cols-2 gap-8"}>
          {/* Left Column - Interview Information */}
          <div className="space-y-6">
            {/* Interview Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Interview Details
                </h2>
                <div className='flex flex-col p-5 rounded-lg gap-5'>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-lg font-medium text-gray-900">{interviewData ? interviewData.jobPosition : "Loading..."}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Required Experience</label>
                    <p className="text-gray-700">{interviewData ? interviewData.jobExperience + " years" : "Loading..."}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Job Description</label>
                    <p className="text-gray-700 text-sm leading-relaxed">{interviewData ? interviewData.jobDesc : "Loading..."}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Info (only for candidates) */}
            {isCandidate && candidateSession && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-600" />
                  Your Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{candidateSession.candidateName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">{candidateSession.candidateEmail}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Information Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      {isCandidate ? 'Interview Instructions' : 'Information'}
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      {isCandidate ? (
                        <ul className="space-y-1">
                          <li>• Ensure you have a stable internet connection</li>
                          <li>• Find a quiet environment with good lighting</li>
                          <li>• Enable your webcam and microphone when prompted</li>
                          <li>• Speak clearly and take your time to answer</li>
                        </ul>
                      ) : (
                        <p>{process.env.NEXT_PUBLIC_INFORMATION || 
                          "Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It Has 5 questions which you can answer and at the last you will get the report on the basis of your answer.NOTE: We never record your video, Web cam access you can disable at any time if you want."}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Webcam & Controls */}
          <div className="flex flex-col space-y-4">
            {/* Webcam Container */}
            <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
              {webCamEnable ? (
                <Webcam
                  onUserMedia={() => setWebCamEnable(true)}
                  onUserMediaError={() => setWebCamEnable(false)}
                  className="w-full h-full object-cover"
                  mirrored={true}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-gray-400">
                  <WebcamIcon className="h-16 w-16 mb-2" />
                  <p className="text-sm text-center">Camera is currently disabled</p>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <Button 
              className={`rounded-md w-full py-5 text-base font-medium
                 ${webCamEnable
                   ? 'bg-red-600 hover:bg-red-700'
                   : 'bg-indigo-600 hover:bg-indigo-700'}`}
              onClick={() => setWebCamEnable(!webCamEnable)}
            >
              {webCamEnable ? 'Disable Camera and Microphone' : 'Enable Web Cam and Microphone'}
            </Button>

            {/* Start Button */}
            <div className="flex justify-end pt-4">
              <Button 
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 font-medium text-white rounded-lg transition-colors"
                onClick={handleStartInterview}
                disabled={!webCamEnable}
              >
                {isCandidate ? 'Start Interview' : 'Start Mock Interview'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Interview