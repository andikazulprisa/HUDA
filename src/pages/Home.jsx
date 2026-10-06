import Hero from "../components/Hero";
import ExploreSection from "../components/ExploreSection";
import FeaturedKnowledge from "../components/FeaturedKnowledge";
import WhyHuda from "../components/WhyHuda";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <main>
        <Hero />
        <ExploreSection />
        <FeaturedKnowledge />
        <CTASection />
        <WhyHuda />
      </main>

      <Footer />
    </>
  );
}

export default Home;
