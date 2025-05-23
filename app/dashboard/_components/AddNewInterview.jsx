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
      const [pdfResponse , setPdfResponse] = useState(null);
      const [loading , setLoading] = useState(false);
      const [jsonResponse , setJsonResponce] = useState([]);
      const route=useRouter();
      const {user} = useUser(); 


            const onSubmit =async (e)=>{
                  setLoading(true)
                  e.preventDefault()
                  // console.log(jobPosition,jobDescription,jobExperience);

                  const InputPrompt="Job Position: " +  jobPosition + ", Job Description:  " + jobDescription +", Years of Experience: " + jobDescription+ ", Depends on this information please give me " + process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS +" Interview question with Answer in Json Format";
                  const result = await chatSession.sendMessage(InputPrompt);
                  
                  // console.log(result.response.text())
                  const final_result = (result.response.text()).replace('```json','').replace('```',''); 
                 
                  
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
                              route.push('/dashboard/interview/'+resp[0]?.mockId);                       
                        }

                        
                        // console.log("response id : ",resp )
                        setLoading(false);
                  }else{
                        console.log("Some error occur")
                  }
            }

    
  return (
    <div>
      <div className='p-10 bg-zinc-100 border rounded-2xl bg hover:scale-105 cursor-pointer transition-all'
            onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogOverlay className="fixed inset-0 bg-slate z-50" />
      <DialogContent className='max-w-2xl bg-white rounded-2xl shadow-lg'>
      <DialogHeader>
            <DialogTitle className='flex justify-center font-bold text-2xl'>Tell Us More About Your Job Interviewing</DialogTitle>
            <DialogDescription>

                        <form onSubmit={onSubmit} >
                        <div>
                              <h2 className='flex justify-center text-gray-500'>Add details about your job position,Your skills and Year of experience</h2>
                              
                              <div className='mt-5'>
                                    <div className='grid grid-cols-3 gap-4'>
                                          <div className='my-3 col-span-2'>
                                                <label className='pl-1 font-semibold text-base'>Job Position</label>
                                                <Input
                                                      className='rounded-xl text-black placeholder:text-gray-500 border-black' 
                                                      placeholder='Ex. Full Stack Developer / Machine Lerning Engineer' 
                                                      required 
                                                      onChange={(event)=>setJobPosition(event.target.value)} />
                                          </div> 

                                          <div className='my-3 col-span-1'>
                                                <label className='pl-1 font-semibold text-base'>Experience</label>
                                                <Input 
                                                      className='rounded-xl text-black placeholder:text-gray-500 border-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
                                                      type='number' 
                                                      placeholder='Ex. 5 years' 
                                                      min='0' 
                                                      max='30' 
                                                onChange={(event)=>setJobExperience(event.target.value)}/>
                                          </div>
                                    </div>
                              </div>

                              <div className='my-3'>
                                    <label className='pl-1 font-semibold text-base'>Job Description / Tech Stack</label>
                                    <Textarea 
                                          className='rounded-xl text-black placeholder:text-gray-500 border-black' 
                                          placeholder='Ex. Node.js , React , Express.js , MongoDb , Docker etc'
                                          onChange={(event)=>setJobDescription(event.target.value)} />
                              </div> 
                              <div className='my-3'>
                                    <label className='pl-1 font-semibold text-base'>Upload Resume</label>
                                    <Input 
                                          className='rounded-xl text-black placeholder:text-gray-500 border-black hover:pointer cursor-pointer' 
                                          type='file'
                                          accept='.pdf'
                                          placeholder='Upload your resume in PDF format'
                                          onChange={(event)=>setPdfResponse(event.target.value)}/>
                              </div>  

                        </div>

                        <div className='pl-1 flex gap-5 justify-end'>
                              <Button className='bg-primary/10 hover:bg-primary/20 rounded-xl' onClick={()=>setOpenDialog(false)}>Cancel</Button>
                              <Button className='rounded-xl tracking-normal' type='submit' disable={loading}> {loading? <> Generating... <LoaderCircle className='animate-spin' />  </> : 'Start Inerview'} </Button>
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
