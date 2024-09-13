'use client'
import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/Questions';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {
      const [interviewData , setInterviewData] = useState(null);
      const [mockInterviweQuestions , setMockInterviewQuestions] = useState(null);
      const [activeQuestionIndex , setActiveQuestionIndex] = useState(0);

      useEffect(()=>{
            GetInterviewDetails();
      },[])

      
      /*
      get interview details of user using uId 
      */

      const GetInterviewDetails = async ()=>{
            const result = await db.select().from(MockInterview) 
            .where(eq(MockInterview.mockId,params.interviewid))
            
            // console.log('data_result', result[0].jsonMockResp);
            const jsonMockResp = JSON.parse(result[0].jsonMockResp.replace(/```/g, ''));
            // console.log(jsonMockResp)
            setMockInterviewQuestions(jsonMockResp);
            setInterviewData(result[0]);
      }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 ' >
            <QuestionsSection 
            mockInterviweQuestions={mockInterviweQuestions}
            activeQuestionIndex={activeQuestionIndex} />

            <RecordAnswerSection 
            mockInterviweQuestions={mockInterviweQuestions}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}/>
      </div>
      <div className='flex justify-end gap-6'>
            {activeQuestionIndex >0 &&  
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button> }
            {activeQuestionIndex!= mockInterviweQuestions?.length-1 && 
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            {activeQuestionIndex==mockInterviweQuestions?.length-1 && 
            <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'} >
            <Button >End Interview</Button> 
            </Link> }

      </div>
    </div>
  )
}

export default StartInterview
