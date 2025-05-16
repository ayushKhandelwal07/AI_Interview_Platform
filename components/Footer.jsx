import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const sections = [
    {
      title: "Product",
      links: [
        { text: "Features", href: "#features" },
        { text: "How It Works", href: "#how-it-works" },
        { text: "Pricing", href: "#pricing" },
        { text: "Testimonials", href: "#testimonials" },
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
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", href: "#" },
        { text: "Terms of Service", href: "#" },
        { text: "Cookie Policy", href: "#" },
        { text: "GDPR", href: "#" },
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
            <p className="text-gray-600 mb-6 max-w-xs">
              Revolutionize your technical hiring with AI-powered interviews that save time and improve candidate experience.
            </p>
            <div className="flex space-x-4">
              {["Facebook", "Twitter", "LinkedIn", "GitHub"].map((social, i) => (
                <a 
                  key={i} 
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                >
                  {social[0]}
                </a>
              ))}
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