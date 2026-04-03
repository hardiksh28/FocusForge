import Navbar from "../components/layout/Navbar";
import Background from "../components/layout/Background";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Features from "../components/sections/Features";
import Feedback from "../components/sections/Feedback";
import Pricing from "../components/sections/Pricing";
import CTA from "../components/sections/CTA";
import Footer from "../components/layout/Footer";

export default function Landing() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Features />
        <Feedback />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
