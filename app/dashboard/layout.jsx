"use client"
import React from 'react'
import Header from './_components/Header'
import { useSearchParams } from 'next/navigation'

export default function DashboardLayout({children}) {
  const searchParams = useSearchParams();
  const candidateToken = searchParams.get('candidate');
  const isCandidate = !!candidateToken;

  return (
    <div>   
            {!isCandidate && <Header />}
            <div className={isCandidate ? 'mx-0' : 'mx-5 md:mx-20 lg:mx-36'}>
              {children}
            </div>
    </div>
  )
}
