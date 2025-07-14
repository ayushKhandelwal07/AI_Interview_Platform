import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const sections = [
    {
      title: "Product",
      links: [
        { text: "Dashboard", href: "#features" },
        { text: "How It Works", href: "#how-it-works" },
        { text: "Pricing", href: "#pricing" },
        { text: "Blogs", href: "#testimonials" },
      ]
    },
    {
      title: "Resources",
      links: [
        { text: "Blog", href: "#" },
        { text: "Documentation", href: "#" },
        { text: "Guides", href: "#" },
        { text: "Support", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", href: "#" },
        { text: "Careers", href: "#" },
        { text: "Contact", href: "#" },
        { text: "Partners", href: "#" },
      ]
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2">
            <div className="text-2xl font-bold text-primary mb-4">InterviewAI</div>
            <p className="text-gray-600 mb-3 max-w-xs">
              Revolutionize your technical hiring with AI.
            </p>
            <div className='pb-4'>
              Contact me 
            </div>
            <div className="flex space-x-10 ">
              <a 
                href="https://github.com/ayushKhandelwal07" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="GitHub"
              >
                <Github size={25} />
              </a>
              <a 
                href="https://x.com/ashu0XD" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter size={25} />
              </a>
              <a 
                href="https://www.linkedin.com/in/ayush-khandelwal-284294287/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={25} />
              </a>
            </div>
          </div>

          {/* Footer links */}
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} InterviewAI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select 
              className="bg-gray-100 text-gray-700 rounded-md py-2 px-4 text-sm border-none focus:ring-2 focus:ring-primary"
            >
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 