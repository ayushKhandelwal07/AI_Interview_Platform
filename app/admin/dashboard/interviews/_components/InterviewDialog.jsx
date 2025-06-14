"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay
} from "@/components/ui/dialog";
import { chatSession } from '@/utils/GeminiAiModel';
import { db } from '@/utils/db';
import { v4 as uuid4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import MockInterview, { InterviewLink } from '@/utils/schema';
import { useRouter } from 'next/navigation';
import InterviewForm from './InterviewForm';
import FormActions from './FormActions';

function InterviewDialog({ open, onOpenChange, onInterviewCreated }) {
  const [jobPosition, setJobPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const resetForm = () => {
    setJobPosition('');
    setJobDescription('');
    setJobExperience('');
    setJsonResponse([]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate required fields
    if (!jobPosition || !jobDescription || !jobExperience) {
      alert('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}, Depends on this information please give me ${process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS} Interview question with Answer in Json Format`;
      
      const result = await chatSession.sendMessage(InputPrompt);
      const final_result = (result.response.text()).replace('```json', '').replace('```', '');
      setJsonResponse(final_result);

      if (final_result) {
        const resp = await db.insert(MockInterview)
          .values({
            mockId: uuid4(),
            jsonMockResp: final_result,
            jobPosition: jobPosition,
            jobDesc: jobDescription,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdByRole: 'admin',
            creaetdAt: moment().format('DD-MM-yyyy')
          })
          .returning({ mockId: MockInterview.mockId });

        if (resp) {
          onOpenChange(false);
          resetForm();
          const interviewRoute = `/admin/dashboard/interview/${resp[0]?.mockId}`;
          console.log(`/admin/dashboard/interview/${resp[0]?.mockId}`)
          console.log(`${resp[0]?.mockId}`)
          
          // Save the interview link to the InterviewLink table
          try {
            await db.insert(InterviewLink)
              .values({
                mockId: resp[0]?.mockId,
                link: interviewRoute,
                status: 'active',
                createdBy: user?.primaryEmailAddress?.emailAddress,
                candidateEmail: null // Can be set later when sharing with candidates
              });
                         console.log('Interview link saved successfully');
           } catch (linkError) {
             console.error('Error saving interview link:', linkError);
           }
           
           // Call the callback to refresh the interviews list
           if (onInterviewCreated) {
             onInterviewCreated();
           }
        } else {
          console.log("Some error occurred");
        }
      } else {
        console.log("Some error occurred");
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Error creating interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogContent className='max-w-2xl bg-white rounded-2xl'>
        <DialogHeader>
          <DialogTitle className='font-bold text-2xl text-gray-900'>
            Create New Interview
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Set up a new AI-powered interview session by providing job details.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <InterviewForm
            jobPosition={jobPosition}
            setJobPosition={setJobPosition}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            jobExperience={jobExperience}
            setJobExperience={setJobExperience}
            onSubmit={onSubmit}
            loading={loading}
          />
          
          <FormActions
            loading={loading}
            onCancel={handleCancel}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InterviewDialog; 