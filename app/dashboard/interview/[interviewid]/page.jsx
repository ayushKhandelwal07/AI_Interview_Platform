"use client"

import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Webcam from "react-webcam";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnable, setWebCamEnable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  /*
  get interview details of user using uId 
  */
  const GetInterviewDetails = async () => {
    try {
      const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewid));
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartInterview = () => {
    window.location.href = '/dashboard/interview/' + params.interviewid + '/start';
  }

  const handleEnableWebcam = () => {
    setWebCamEnable(true);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Let's Get Started</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Interview Information */}
          <div className="space-y-6">
            {/* Interview Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Details</h2>
                    <div className='flex flex-col p-5 rounded-lg  gap-5 ' >
                          <h2 className='text-lg '><strong>Job Role/Job Position : </strong>{`${(interviewData ? interviewData.jobPosition : " Loading...")}`}</h2>
                          <h2 className='text-lg'><strong>Job Description/Tech Stack : </strong>{`${(interviewData ? interviewData.jobDesc: " Loading...")}`}</h2>
                          <h2 className='text-lg'><strong>Year's of Experience : </strong>{`${(interviewData ? interviewData.jobExperience: " Loading...")}`}</h2>
                    </div>
              </div>
            </div>

            {/* Information Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Information</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>{process.env.NEXT_PUBLIC_INFORMATION || 
                        "Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It Has 5 questions which you can answer and at the last you will get the report on the basis of your answer.NOTE: We never record your video, Web cam access you can disable at any time if you want."}</p>
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
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Interview