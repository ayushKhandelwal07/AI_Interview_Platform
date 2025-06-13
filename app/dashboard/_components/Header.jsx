"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import logo from '../../../public/logo.svg'
import { Menu, X, UserIcon } from "lucide-react";
import { useState } from 'react';
import { useAdmin } from '@/contexts/RoleContext';

function Header() {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const path = usePathname();
      const router = useRouter();
      const { isSignedIn } = useUser();
      const { isAdmin, setIsAdmin } = useAdmin();

      function userMenuRole() {
            return (
                  <UserButton>
                        <UserButton.MenuItems>
                              <UserButton.Action
                                    label={isAdmin ? "Switch to User" : "Switch to Admin"}
                                    labelIcon={<UserIcon />}
                                    onClick={() => {
                                          setIsAdmin(!isAdmin);
                                          router.push(isAdmin ? "/dashboard" : "/admin/dashboard");
                                    }}
                              />
                        </UserButton.MenuItems>
                  </UserButton>
            )
      }

      const HandleClick = (path) => {
            router.push(path)
            setIsMenuOpen(false);
      }

      const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen);
      }

      return (
            <div className='sticky top-5 backdrop-blur-lg z-50 flex p-4 items-center justify-between hover m-5 mx-5 rounded-2xl border border-slate-200'>
                  <div className='flex-1'>
                        <Image 
                              alt='loading...' 
                              src={logo} 
                              width={160} 
                              height={100} 
                              className='hover:cursor-pointer'
                              quality={100}
                              priority={true}
                              style={{
                                    imageRendering: 'high-quality',
                                    WebkitBackfaceVisibility: 'hidden',
                                    backfaceVisibility: 'hidden'
                              }}
                              onClick={() => {HandleClick("/")}} 
                        />
                  </div>

                  {/* Mobile Menu Button */}
                  <button 
                        className='md:hidden p-2'
                        onClick={toggleMenu}
                  >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>

                  {/* Desktop Navigation */}
                  <div className='hidden md:flex flex-1 justify-center'>
                        <ul className='flex text-lg gap-8'>
                              <li className={`hover:text-primary cursor-pointer
                                    ${path === (isAdmin ? '/admin/dashboard' : '/dashboard') && 'text-primary font-bold'}
                                    `} onClick={() => HandleClick(isAdmin ? '/admin/dashboard' : '/dashboard')}>Dashboard</li>
                              <li className={`hover:text-primary cursor-pointer
                                    ${path=='/dashboard/how'&& 'text-primary font-bold' }
                                    `} onClick={() => HandleClick('/how')}>How it work ?</li>
                              <li className={`hover:text-primary cursor-pointer
                                    ${path=='/dashboard/pricing'&& 'text-primary font-bold' }
                                    `} onClick={() => HandleClick('/pricing')}>Pricing</li>
                              <li className={`hover:text-primary cursor-pointer
                                    ${path=='/dashboard/blogs'&& 'text-primary font-bold' }
                                    `} onClick={() => HandleClick('/blogs')}>Blogs</li>
                        </ul>
                  </div>

                  {/* Desktop User Button */}
                  <div className='hidden md:flex flex-1 justify-end'>
                        {isSignedIn ? userMenuRole() : <button onClick={() => router.push("/sign-in")} className='bg-primary rounded-xl hover:bg-primary/90 text-white px-3 py-1 text-lg font-medium'>Sign in</button>}
                  </div>

                  {/* Mobile Menu */}
                  {isMenuOpen && (
                        <div className='absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl mt-2 p-4 md:hidden'>
                              <ul className='flex flex-col gap-4'>
                                    <li className='flex justify-end'>
                                          <UserButton />
                                    </li>
                                    <li className={`hover:text-primary cursor-pointer
                                          ${path === (isAdmin ? '/admin/dashboard' : '/dashboard') && 'text-primary font-bold'}
                                          `} onClick={() => HandleClick(isAdmin ? '/admin/dashboard' : '/dashboard')}>Dashboard</li>
                                    <li className={`hover:text-primary cursor-pointer
                                          ${path=='/dashboard/how'&& 'text-primary font-bold' }
                                          `} onClick={() => HandleClick('/dashboard/how')}>How it work ?</li>
                                    <li className={`hover:text-primary cursor-pointer
                                          ${path=='/dashboard/pricing'&& 'text-primary font-bold' }
                                          `} onClick={() => HandleClick('/dashboard/pricing')}>Pricing</li>
                                    <li className={`hover:text-primary cursor-pointer
                                          ${path=='/dashboard/blogs'&& 'text-primary font-bold' }
                                          `} onClick={() => HandleClick('/dashboard/blogs')}>Blogs</li>
                              </ul>
                        </div>
                  )}
            </div>
      )
}

export default Header
