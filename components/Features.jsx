import React from 'react';
import { CheckCircle, Clock, Users, Search } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "AI-Powered Interviews",
      description: "Our advanced AI conducts technical interviews, evaluates responses, and provides detailed insights.",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
    {
      title: "Save 80% of Time",
      description: "Automate the screening process and focus only on the most qualified candidates.",
      icon: <Clock className="h-10 w-10 text-primary" />,
    },
    {
      title: "Skill-Based Evaluation",
      description: "Accurately assess candidates' technical skills, problem-solving abilities, and cultural fit.",
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
    },
    {
      title: "Unbiased Hiring",
      description: "Eliminate unconscious bias with objective evaluations based solely on technical merit.",
      icon: <Search className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <section className="py-20 bg-white "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accentDark mb-4">
            Streamline Your Technical Hiring
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform helps you identify the best technical talent faster and more accurately than traditional methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-accentDark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features; 