const Testimonials = () => {
  const testimonials = [
    {
      quote: "InterviewAI has transformed our tech hiring. We've reduced time-to-hire by 60% while finding better candidates.",
      author: "Sarah Johnson",
      role: "CTO, TechFirm Inc.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      quote: "The detailed AI analysis of each candidate has helped us make more informed hiring decisions. Our engineering team loves it.",
      author: "Michael Chen",
      role: "Engineering Manager, DataCorp",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      quote: "As a startup, we don't have time for endless interviews. InterviewAI helps us find great developers quickly and efficiently.",
      author: "Alex Rivera",
      role: "Founder, LaunchApp",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accentDark mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of companies that have improved their technical hiring process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
            >
              <div className="absolute -top-3 -left-3 text-5xl text-primary opacity-20">"</div>
              <p className="text-gray-700 mb-6 relative z-10">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  loading="lazy"
                  decoding="async"
                  style={{
                    imageRendering: 'high-quality',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                  }}
                />
                <div>
                  <p className="font-semibold text-accentDark">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section 
          className="overflow-hidden rounded-xl mt-5"
          style={{
            backgroundImage: 'url(/bg.avif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'high-quality',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        >
        <div className="mt-16 rounded-xl p-8 shadow-sm text-white text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-4">Ready to Experience the Difference?</h1>
          <p className="max-w-2xl mx-auto mb-3 text-white">
            Join hundreds of forward-thinking companies that have revolutionized their technical hiring process with InterviewAI.
          </p>
        </div>
        </section>

      </div>
    </section>
  );
};

export default Testimonials; 