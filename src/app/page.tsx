import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SphereSection from "@/components/SphereSection";

// Below-the-fold chapters are split into their own chunks.
const PhilosophySection = dynamic(() => import("@/components/PhilosophySection"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <AboutSection />
        <ServicesSection />
        <SphereSection />
        <PhilosophySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
