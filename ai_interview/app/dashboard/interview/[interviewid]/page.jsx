"use client"

import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { WebcamIcon } from 'lucide-react';
import Webcam from "react-webcam";
import React, { useEffect, useState } from 'react'
import { onUserMedia ,onUserMediaError } from  'react-webcam';
import { Button } from '@/components/ui/button';

function Interview({params}) {
      const [interviewData , setInterviewData] = useState();
      const[webCamEnable , setWebCamEnable] = useState(false);

      useEffect(()=>{
            console.log("params",params)
            console.log('params_interview_id',params.interviewid);
            GetInterviewDetails();
      },[])

      /*
      get interview details of user using uId 
      */
      const GetInterviewDetails = async ()=>{
            const result = await db.select().from(MockInterview) 
            .where(eq(MockInterview.mockId,params.interviewid))

            console.log(result);
            setInterviewData(result[0]);
      }
  return (
    <div className='my-10 flex justify-center flex-col items-center'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div>
            {webCamEnable ? <Webcam
            onUserMedia={()=>setWebCamEnable(true)}
            onUserMediaError={()=>setWebCamEnable(false)}
            style={{height:300,width:300}} mirrored={true} /> 
            : <>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg rounded-lg border  bg-slate-950' />
            <Button onClick={()=>setWebCamEnable(true)}>Enable Web Cam and Microphone</Button>
            </>
            }
      </div>

      <div>
            <h2><strong>Job Role/Job Position:</strong>{interviewData.jobPosition}</h2>

      </div>
    </div>
  )
}

export default Interview
