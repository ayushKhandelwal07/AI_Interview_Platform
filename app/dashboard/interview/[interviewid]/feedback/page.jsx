"use client"
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import {
      Collapsible,
      CollapsibleContent,
      CollapsibleTrigger,
    } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
    

export default function feedback({params}) {
      const [feedbackList , setFeedbackList] = useState([]);
      const router= useRouter();

      useEffect(()=>{
            GetFeedback();
      },[]) 
      const GetFeedback = async ()=>{
            const result = await db.select().from(UserAnswer) 
            .where(eq(UserAnswer.mockIdRef, params.interviewid))
            .orderBy(UserAnswer.id)

            setFeedbackList(result); 
      }
      const calculateAverageRating = () => {
            if (feedbackList.length === 0) {
                  return 0;
            }

            const totalRating = feedbackList.reduce((sum, item) => sum + item.rating, 0);
            const averageRating = totalRating / feedbackList.length;

            return averageRating;
      };

return (
      <div className='p-2'>
            {feedbackList?.length ==0 ? <h2 className='font-bold text-xl text-grey-500'>No Feedback Found</h2>
             :
             <>
            <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
            <h2 className='font-bold text-2xl'>Here is your interview Feedback</h2> 
            <h2 className='text-blue-600 text-lg my-3'>Your overall interview rating : <strong className='text-blue-500'>{calculateAverageRating}</strong></h2>
            <h2 className='text-sm text-gray-500'>Find below interview questions with correct answer, Your answer and feedback for improvement</h2>
            {feedbackList && feedbackList.map((item,index)=>(
                              <Collapsible key={index} >
                                                <CollapsibleTrigger className='p-2 border-slate-100 bg-blue-900 rounded-lg my-2 text-left flex justify-between gap-3 w-full'>
                                                {item.question}<ChevronsUpDown className='h-4 w-5'/>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                      <div className='flex flex-col gap-2'>
                                                            <h2 className='text-red-500 p-2 border border-slate-500 rounded-lg'><strong>Rating : {item.rating}</strong></h2>
                                                            <h2 className='p-2 text-red-800 font-normal border rounded-lg text-base bg-red-100 '><strong>Your Answer : {(item.userAns)}</strong></h2>
                                                            <h2 className='p-2 text-green-800 font-normal border rounded-lg text-base bg-green-200 '><strong>Correct Answer : {(item.correctAns).replace("**",'')}</strong></h2>
                                                            <h2 className='p-2 text-blue-800 font-normal border rounded-lg text-base bg-blue-200 '><strong>Feedback : {(item.feedback).replace("**",'')}</strong></h2>

                                                      </div>
                                                </CollapsibleContent>
                              </Collapsible>   
            ))}
            </>}
            <div>
            </div>
                  <Button className='mt-10' onClick={()=>router.replace('/dashboard')}>Go home</Button>
      </div >
)
}
