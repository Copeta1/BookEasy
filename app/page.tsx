import Features from "./components/landing/Features";
import Footer from "./components/landing/Footer";
import Hero from "./components/landing/Hero";
import Navbar from "./components/landing/Navbar";
import Pricing from "./components/landing/Pricing";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
