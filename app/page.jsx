import Header from "./dashboard/_components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (  
    <div className="min-h-screen mx-5">
      <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
      <Footer />
    </div>
  );
}
