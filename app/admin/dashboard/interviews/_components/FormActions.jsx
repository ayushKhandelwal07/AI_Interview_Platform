"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

function FormActions({ loading, onCancel, onSubmit }) {
  return (
    <div className='flex gap-5 justify-end mt-6'>
      <Button 
        type="button"
        variant="outline"
        className='bg-white-600 text-black hover:text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-color' 
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button 
        className='tracking-normal bg-indigo-700 text-white hover:text-white rounded-xl text-sm font-medium hover:bg-indigo-800 transition-colors' 
        type='submit' 
        disabled={loading}
        onClick={onSubmit}
      > 
        {loading ? (
          <>
            <LoaderCircle className='animate-spin mr-2 h-4 w-4' /> 
            Generating Interview...
          </>
        ) : (
          'Create Interview'
        )} 
      </Button>
    </div>
  );
}

export default FormActions; 