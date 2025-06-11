"use client"
import { useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation';
import Header from '../dashboard/_components/Header';

export default function Pricing(){
      const [isAnnually, setIsAnnually] = useState(false);
      const router = useRouter();


             return (<>
            <Header />
            <div className="bg-gradient-to-br py-4 px-4">
                  <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-6">
                              <p className="text-bold text-xl text-black-600 mb-4">Stop Burning Cash on Hiring. Start at <span className='font-bold text-2xl'>$99</span>  Today</p>
                              
                              {/* Toggle */}
                              <div className="flex items-center justify-center mb-6">
                                    <div className="bg-gray-200 p-1 rounded-full flex">
                                          <button
                                                onClick={() => setIsAnnually(false)}
                                                className={`px-6 py-2 rounded-full font-medium transition-all ${
                                                      !isAnnually 
                                                            ? 'bg-blue-600 text-white shadow-md' 
                                                            : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                          >
                                                Monthly
                                          </button>
                                          <button
                                                onClick={() => setIsAnnually(true)}
                                                className={`px-6 py-2 rounded-full font-medium transition-all ${
                                                      isAnnually 
                                                            ? 'bg-blue-600 text-white shadow-md' 
                                                            : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                          >
                                                Annually
                                          </button>
                                    </div>
                              </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                              {/* Free Plan */}
                              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                    <div className="mb-6">
                                          <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                                          <p className="text-gray-600 mb-4">Perfect for individuals getting started with interview preparation.</p>
                                          
                                          <div className="flex items-baseline mb-4">
                                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                                <span className="text-gray-600 ml-2">/month</span>
                                          </div>
                                          
                                          <button onClick={()=> router.push("/dashboard")} className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors">
                                                Get Started Free
                                          </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700"><strong>10 Mock Interviews</strong> per month</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">Basic AI feedback</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">5 Job categories</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">Email support</span>
                                          </div>
                                    </div>
                              </div>

                              {/* Pro Plan */}
                              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 relative">
                                    <div className="mb-6">
                                          <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                                          <p className="text-gray-600 mb-4">For businesses and teams who need advanced features and unlimited access.</p>
                                          
                                          <div className="flex items-baseline mb-4">
                                                <span className="text-4xl font-bold text-gray-900">
                                                      ${isAnnually ? '75' : '99'}
                                                </span>
                                                <span className="text-gray-600 ml-2">/month</span>
                                                {isAnnually && (
                                                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                                                            Save 25%
                                                      </span>
                                                )}
                                          </div>
                                          
                                          <button onClick={()=> router.push("/dashboard")} className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                                                Start Pro Trial
                                          </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700"><strong>Unlimited Mock Interviews</strong></span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700"><strong>Admin Dashboard</strong> - Send interviews</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">Advanced AI feedback & analytics</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">All categories & custom questions</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">Team management</span>
                                          </div>
                                          <div className="flex items-center">
                                                <Check className="w-4 h-4 text-green-600 mr-2 bg-green-100 rounded-full p-0.5" />
                                                <span className="text-sm text-gray-700">Priority support</span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
            </>)
}


