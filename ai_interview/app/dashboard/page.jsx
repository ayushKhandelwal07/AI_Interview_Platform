import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

export default function Dashboard() {
  return (
    <div>
      
      <h2 className='font-bold text-3xl'>Dashboard</h2>
      <h2 className='text-slate-500'>Create and start your mock interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 py-5'>
        <AddNewInterview />
      </div>

      {/* Previous Interview List  */}
      <InterviewList />
      
    </div>
  )
}
