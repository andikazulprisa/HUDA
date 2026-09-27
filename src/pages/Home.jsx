import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ExploreSection from "../components/ExploreSection";
import FeaturedKnowledge from "../components/FeaturedKnowledge";
import WhyHuda from "../components/WhyHuda";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ExploreSection />
        <FeaturedKnowledge />
        <WhyHuda />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}

export default Home;
