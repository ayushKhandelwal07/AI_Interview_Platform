import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
const router = useRouter();

const onStart = () => {
      router.push('/dashboard/interview/'+interview?.mockId)
}

const onFeedback = () => {
      router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
}

  return (
    <div className='border border-slate-500 rounded-md p-3 '>
      <h2 className='font bold  text-blue-600 '>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-grey-500'> {interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-xs text-grey-500 '>Created At : {(interview.createdAt).toDateString().slice(4)}</h2>
      <div className='flex justify-between my-2 gap-5 '>
            <Button onClick={onFeedback} size='sm' variant='outline' className='w-full border-gray-600'>Feedback</Button>
            <Button onClick={onStart} size='sm' className='w-full'>Start </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
