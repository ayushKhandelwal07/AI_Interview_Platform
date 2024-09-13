"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { ConsoleLogWriter } from 'drizzle-orm';
import { CirclePause, Mic } from 'lucide-react';
import moment from 'moment/moment';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from "react-webcam";
import { toast } from 'sonner';

function RecordAnswerSection({mockInterviweQuestions,activeQuestionIndex,interviewData}) {
      const [userAnswer , setUserAnswer] = useState('');
      const {user} = useUser();
      const [loading , setLoading] = useState(false);

      const {
            error,
            interimResult,
            isRecording,
            results,
            startSpeechToText,
            stopSpeechToText,
            setResults
          } = useSpeechToText({
            continuous: true,
            useLegacyResults: false
          });

          useEffect(()=>{
            results.map((result)=>{
                  setUserAnswer(prevAns=>prevAns+result?.transcript)
            })
          },[results])

          useEffect(()=>{
                if(!isRecording && userAnswer?.length>10){
                      UpdateUserAnswer();
                }
          },[userAnswer])
          
          const StartStopRecrding =async () => {
                  if(isRecording){
                  
                        stopSpeechToText();
                        if(userAnswer?.length<10){
                              toast('Answer should be more than 10 words, Please record again');
                        }                        
                  }else{
                        startSpeechToText();
                  }
            }


            const UpdateUserAnswer=async()=>{
                  // console.log('prompt_reached')
                  // console.log(userAnswer);
                  setLoading(true);
                  const feedbackPrompt = "Question : " + mockInterviweQuestions[activeQuestionIndex]?.Question + 
                        ", User Answer:" + userAnswer + "Depend on the question and user answer for interview questions "+
                        " Please give us rating from 1 to 10 for answer and feedback as area of improvement if any"+
                        "in must be just 4-5 lines response with JSON format with only two fields  'rating' field and 'feedback' field remember two fields and JSON format only";

                        const result =await chatSession.sendMessage(feedbackPrompt);

                        const mockJosnReasponse = (result.response.text()).replace('```json','').replace('```','');
                        // console.log(mockJosnReasponse)
                        const JsonFeedbackResp = JSON.parse(mockJosnReasponse)

                        // console.log(mockInterviweQuestions);
                        const resp = await db.insert(UserAnswer)
                        .values({
                              mockIdRef:interviewData?.mockId,
                              question:mockInterviweQuestions[activeQuestionIndex]?.question,
                              correctAns:mockInterviweQuestions[activeQuestionIndex]?.answer,
                              userAns:userAnswer,
                              feedback:JsonFeedbackResp?.feedback,
                              rating:JsonFeedbackResp?.rating,
                              userEmail:user?.primaryEmailAddress?.emailAddress,
                              createdAt:moment().format('DD-MM-yyyy')
                        })
                        if(resp){
                              toast('User Answer Recorded Successfully');
                              setUserAnswer('');
                              setResults([]);
                        }else{
                              toast('Please record again');
                        }
                        setResults([]);
                        setLoading(false);
            }

  return (
      <div className='flex justify-center items-center flex-col '>
            <div className='flex justify-center items-center  align-center bg-slate-950 border rounded-lg my-10 z-0 border-slate-500'>
                  <Image src={'/canimg.png'} height={200} width={200} className='absolute' />
                  <Webcam 
                        mirrored={true}
                        style={{height:300,
                              width:'100%',
                              zIndex:10,
                        }}
                  />
            </div>

                  <Button disabled={loading} variant=' outline' className={`hover:bg-blue-100 hover:text-black hover:border-black border-slate-500`}
                  onClick={StartStopRecrding}>
                        {isRecording ? 
                        <h2 className='flex gap-2 text-red-600 '>
                              <CirclePause className='h-5 w-5' /> Stop Recording...
                        </h2>
                        :      
                        <h2 className='flex gap-2'>
                              <Mic className='h-5 w-5' /> Record Answer
                        </h2>                      
                  }</Button>  
    </div>
  )
}

export default RecordAnswerSection
