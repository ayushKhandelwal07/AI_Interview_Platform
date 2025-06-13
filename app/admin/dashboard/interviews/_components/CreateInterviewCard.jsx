"use client"
import React from 'react';
import { Plus } from 'lucide-react';

function CreateInterviewCard({ onClick }) {
  return (
    <div 
      className='p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-2xl hover:scale-105 cursor-pointer transition-all hover:shadow-lg group'
      onClick={onClick}
    >
      <div className="text-center">
        <Plus className="h-12 w-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
        <h2 className='font-bold text-xl text-blue-700 mb-2'>Create New Interview</h2>
        <p className='text-blue-600 text-sm'>Set up a new AI-powered interview session</p>
      </div>
    </div>
  );
}

export default CreateInterviewCard; 