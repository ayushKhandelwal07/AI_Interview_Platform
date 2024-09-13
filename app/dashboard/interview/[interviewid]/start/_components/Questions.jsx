import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviweQuestions,activeQuestionIndex}) {

      const textToSpeach = (text) => {
            if('speechSynthesis' in window){
                  const speech = new SpeechSynthesisUtterance(text);
                  window.speechSynthesis.speak(speech);
            }else{
                  alert("Sorry,  Your Browser Does Not Support Speech to Voice")
            }
      }

  return mockInterviweQuestions&&(
    <div className='p-5 border rounded-lg my-10 border-slate-500 '>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 '>  
            {mockInterviweQuestions && mockInterviweQuestions.map((Question,index)=> (
                  <h2 className={`p-2 bg-black rounded-full text-xs md:text-sm text-center cursor-pointer text-white ${activeQuestionIndex==index && 'bg-primary text-white border-black'}`}>Questions {index+1}</h2>
            ))}

      </div>
      <h2 className='my-5 text-sm md:text-lg'>{mockInterviweQuestions[activeQuestionIndex]?.question} </h2>
      <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviweQuestions[activeQuestionIndex]?.question)} /> 

            <div className='border rounded-lg bg-blue-100 p-5 mt-20'>
                  <h2 className='flex gap-2 items-center text-primary'  >
                        <Lightbulb />  <strong>Information</strong>
                  </h2>
                  <h2 className='text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
</div>
  )
}

export default QuestionsSection
