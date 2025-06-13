"use client"
import React, { useState } from 'react'
import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      DialogOverlay
    } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Ghost, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAiModel';
import { db } from '@/utils/db';
import {  v4 as uuid4} from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import MockInterview from '@/utils/schema';
import { useRouter } from 'next/navigation';
    

function AddNewInterview() {
      const [openDialog , setOpenDialog] = useState(false);
      const [jobPosition , setJobPosition] = useState('');
      const [jobDescription, setJobDescription] = useState('');
      const [jobExperience , setJobExperience] = useState('');
      const [loading , setLoading] = useState(false);
      const [jsonResponse , setJsonResponce] = useState([]);
      const route=useRouter();
      const {user} = useUser(); 

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
                  const InputPrompt="Job Position: " +  jobPosition + ", Job Description:  " + jobDescription +", Years of Experience: " + jobExperience+ ", Depends on this information please give me " + process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS +" Interview question with Answer in Json Format";
                  const result = await chatSession.sendMessage(InputPrompt);
                  
                  const final_result = (result.response.text()).replace('```json','').replace('```',''); 
                  setJsonResponce(final_result);

                  if(final_result){
                        const resp= await db.insert(MockInterview)
                        .values({
                              mockId:uuid4(),
                              jsonMockResp:final_result,
                              jobPosition:jobPosition,
                              jobDesc:jobDescription,
                              jobExperience:jobExperience,
                              createdBy:user?.primaryEmailAddress?.emailAddress,
                              createdByRole: 'user',
                              creaetdAt:moment().format('DD-MM-yyyy')
                        }).returning({mockId:MockInterview.mockId});

                        if(resp){
                              setOpenDialog(false);
                              route.push('/dashboard/interview/'+resp[0]?.mockId);  
                        }
                  } else {
                        console.log("Some error occur");
                  }
            } catch (error) {
                  console.error('Error creating interview:', error);
                  alert('Error creating interview. Please try again.');
            } finally {
                  setLoading(false);
            }
      }

      const handleCancel = (e) => {
            e.preventDefault();
            setOpenDialog(false);
      }

    
  return (
    <div>
      <div className='p-10 bg-zinc-100 border rounded-2xl bg hover:scale-105 cursor-pointer transition-all'
            onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogOverlay className="fixed inset-0 bg-slate z-50" />
      <DialogContent className='max-w-2xl bg-white rounded-2xl'>
      <DialogHeader>
            <DialogTitle className='font-bold text-2xl'>Tell us more about your job interviewing</DialogTitle>
            <DialogDescription>
                  <form onSubmit={onSubmit}>
                  <div>
                        <h2>Add details about your job position,Your skills and Year of experience</h2>
                        <div className='mt-7 my-2'>
                              <label>Job Position / Role</label>
                              <Input 
                                    className='rounded-xl' 
                                    placeholder='Ex. Full Stack Developer' 
                                    required 
                                    value={jobPosition}
                                    onChange={(event)=>setJobPosition(event.target.value)} 
                              />
                        </div> 
                        <div className='my-3'>
                              <label>Job Description / Tech Stack in short</label>
                              <Textarea 
                                    className='rounded-xl' 
                                    placeholder='Ex. Node.js , React , Express.js , MongoDb , Docker etc'
                                    required
                                    value={jobDescription}
                                    onChange={(event)=>setJobDescription(event.target.value)} 
                              />
                        </div> 
                        <div className='my-3'>
                              <label>Experience</label>
                              <Input 
                                    className='rounded-xl' 
                                    type='number' 
                                    placeholder='Ex. 5 years' 
                                    min='0' 
                                    max='30' 
                                    required
                                    value={jobExperience}
                                    onChange={(event)=>setJobExperience(event.target.value)}
                              />
                        </div> 
                  </div>

                  <div className='flex gap-5 justify-end'>
                        <Button 
                              type="button"
                              className='bg-primary/10 rounded-xl' 
                              onClick={handleCancel}
                              disabled={loading}
                        >
                              Cancel
                        </Button>
                        <Button 
                              className='rounded-xl tracking-normal' 
                              type='submit' 
                              disabled={loading}
                        > 
                              {loading ? (
                                    <>
                                          <LoaderCircle className='animate-spin mr-2' /> 
                                          Generating...
                                    </>
                              ) : (
                                    'Start Interview'
                              )} 
                        </Button>
                  </div>
                  </form>
            </DialogDescription>
      </DialogHeader>
      </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview
