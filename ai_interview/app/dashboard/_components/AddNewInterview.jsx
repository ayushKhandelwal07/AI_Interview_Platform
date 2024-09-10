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
      const [jobPosition , setJobPosition] = useState();
      const [jobDescription, setJobDescription] = useState();
      const [jobExperience , setJobExperience] = useState();
      const [loading , setLoading] = useState(false);
      const [jsonResponse , setJsonResponce] = useState([]);
      const route=useRouter();
      const {user} = useUser(); 


            const onSubmit =async (e)=>{
                  setLoading(true)
                  e.preventDefault()
                  console.log(jobPosition,jobDescription,jobExperience);

                  const InputPrompt="Job Position: " +  jobPosition + ", Job Description:  " + jobDescription +", Years of Experience: " + jobDescription+ ", Depends on this information please give me " + process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS +" Interview question with Answer in Json Format, Give Question and Answer as field in JSON"
                  const result = await chatSession.sendMessage(InputPrompt);
                  
                  console.log(result.response.text())
                  const final_result = (result.response.text()).replace('```json','').replace('```','');
                  console.log(final_result);
                  console.log(JSON.parse(final_result));
                  
                  setJsonResponce(final_result)

                  if(final_result){
                        const resp= await db.insert(MockInterview)
                        .values({
                              mockId:uuid4(),
                              jsonMockResp:final_result,
                              jobPosition:jobPosition,
                              jobDesc:jobDescription,
                              jobExperience:jobExperience,
                              createdBy:user?.primaryEmailAddress?.emailAddress,
                              creaetdAt:moment().format('DD-MM-yyyy')
                        }).returning({mockId:MockInterview.mockId});

                        if(resp){
                              setOpenDialog(false);
                              route.push('/dashboard/interviw/'+resp[0]?.mockId);                        }

                        
                        console.log("response id : ",resp )
                        setLoading(false);
                  }else{
                        console.log("Some error occur")
                  }
            }

    
  return (
    <div>
      <div className='p-10 border rounded-lg bg-slate-900 hover:scale-105 cursor-pointer transition-all'
            onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+  Add New</h2>
            
      </div>
      <Dialog className='bg-black' open={openDialog}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
      <DialogContent className='max-w-2xl'>
      <DialogHeader>
            <DialogTitle  className='font-bold text-2xl'>Tell us more about your job interviewing</DialogTitle>
            <DialogDescription>

                  <form onSubmit={onSubmit} >
                  <div>
                        <h2>Add details about your job position,Your skills and Year of experience</h2>
                        <div className='mt-7 my-2'>
                              <label>Job Position / Role</label>
                              <Input  placeholder='Ex. Full Stack Developer' required 
                              onChange={(event)=>setJobPosition(event.target.value)} />
                        </div> 
                        <div className='my-3'>
                              <label>Job Description / Tech Stack in short</label>
                              <Textarea placeholder='Ex. Node.js , React , Express.js , MongoDb , Docker etc'
                              onChange={(event)=>setJobDescription(event.target.value)} />
                        </div> 
                        <div className='my-3'>
                              <label>Experience</label>
                              <Input type='number' placeholder='Ex. 5' min='0' max='30' 
                              onChange={(event)=>setJobExperience(event.target.value)}/>
                        </div> 

                  </div>

                  <div className='flex gap-5 justify-end'>
                        <Button variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                        <Button  type='submit' disable={loading}> {loading? <><LoaderCircle className='animate-spin' /> Generating... </> : 'Start Inerview'} </Button>
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
