"use client"

import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { eq } from 'drizzle-orm';
import {  Ghost, WebcamIcon } from 'lucide-react';
import Webcam from "react-webcam";
import React, { useEffect, useState } from 'react'
import { onUserMedia ,onUserMediaError } from  'react-webcam';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

function Interview({params}) {
      const [interviewData , setInterviewData] = useState(null);
      const[webCamEnable , setWebCamEnable] = useState(false);
      

      useEffect(()=>{
            // console.log("params",params)
            // console.log('params_interview_id',params.interviewid);
            GetInterviewDetails();
      },[])

      /*
      get interview details of user using uId 
      */
      const GetInterviewDetails = async ()=>{
            const result = await db.select().from(MockInterview) 
            .where(eq(MockInterview.mockId,params.interviewid))

            // console.log('data_result',result[0]); 
            setInterviewData(result[0]);
      }
return (
      <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2'>
                              <div className='flex flex-col my-10 gap-7 '>
                                                <div className='flex flex-col p-5 rounded-lg border gap-5 ' >
                                                                  <h2 className='text-lg'><strong>Job Role/Job Position : </strong>{`${(interviewData ? interviewData.jobPosition : " Loading...")}`}</h2>
                                                                  <h2 className='text-lg'><strong>Job Description/Tech Stack : </strong>{`${(interviewData ? interviewData.jobDesc: " Loading...")}`}</h2>
                                                                  <h2 className='text-lg'><strong>Year's of Experience : </strong>{`${(interviewData ? interviewData.jobExperience: " Loading...")}`}</h2>
                                                </div>

                                                <div className='p-5 border rounded-lg border-yellow-300 bg-myyellow text-'> 
                                                                  <h2 className='flex gap-2 items-center text-yellow-700'><Lightbulb />  <strong>Information</strong></h2> 
                                                                  <h2 className='text-yellow-600 mt-4'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                                                </div>
                              </div>   
                                                 
                              <div className='m-5'>
                                                {webCamEnable ? <Webcam
                                                onUserMedia={()=>setWebCamEnable(true)}
                                                onUserMediaError={()=>setWebCamEnable(false)}
                                                style={{height:300,width:300}} mirrored={true} /> 
                                                : <>
                                                <WebcamIcon className='h-72 w-full my-7 p-20 bg rounded-lg border  bg-slate-950' />
                                                <Button className="w-full hover:bg-slate-950 hover:text-slate-400 border border-slate-500" variant='ghost'  onClick={()=>setWebCamEnable(true)}>Enable Web Cam and Microphone</Button>
                                                </>
                                                }
                                                <div className='flex justify-end items-end mt-4'>
                                                      <Button onClick={() => window.location.href = '/dashboard/interview/'+ params.interviewid+'/start'}>Start</Button>
                                                </div>
                              </div>  
            </div>
      </div>
)
}

export default Interview
