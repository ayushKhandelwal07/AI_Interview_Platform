"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
function Header() {

      const path = usePathname();
      useEffect(()=>{
            console.log(path);
      },[])

  return (
    <div className='flex  p-4 items-center justify-between hover shadow-md '>
      <Image alt='loading...' src={'/logo.svg'} width={160} height={100}  />
            <ul className='hidden md:flex gap-10 border-solid border-2 border-slate-700 px-20 py-2 rounded-full' >
                  <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                        ${path=='/dashboard'&& 'text-primary font-bold' }
                        `}>Dashboard</li>
                  <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                        ${path=='/dashboard/questions'&& 'text-primary font-bold' }
                        `}>Questions</li>
                  <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                        ${path=='/dashboard/upgrade'&& 'text-primary font-bold' }
                        `}>Upgrade</li>
                  <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                        ${path=='/dashboard/how'&& 'text-primary font-bold' }
                        `}>How it work ? </li>
            </ul>
            <UserButton className="" />
    </div>
  )
}

export default Header
