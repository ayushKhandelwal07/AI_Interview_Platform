"use client"
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function InterviewForm({ 
  jobPosition, 
  setJobPosition, 
  jobDescription, 
  setJobDescription, 
  jobExperience, 
  setJobExperience, 
  onSubmit, 
  loading 
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <h2>Add details about your job position, Your skills and Year of experience</h2>
        
        <div className='mt-7 my-2'>
          <label className="block text-sm font-medium mb-2">Job Position / Role</label>
          <Input 
            className='rounded-xl' 
            placeholder='Ex. Full Stack Developer' 
            required 
            value={jobPosition}
            onChange={(event) => setJobPosition(event.target.value)} 
          />
        </div> 
        
        <div className='my-3'>
          <label className="block text-sm font-medium mb-2">Job Description / Tech Stack in short</label>
          <Textarea 
            className='rounded-xl' 
            placeholder='Ex. Node.js, React, Express.js, MongoDB, Docker etc'
            required
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)} 
          />
        </div> 
        
        <div className='my-3'>
          <label className="block text-sm font-medium mb-2">Experience (Years)</label>
          <Input 
            className='rounded-xl' 
            type='number' 
            placeholder='Ex. 5' 
            min='0' 
            max='30' 
            required
            value={jobExperience}
            onChange={(event) => setJobExperience(event.target.value)}
          />
        </div> 
      </div>
    </form>
  );
}

export default InterviewForm; 