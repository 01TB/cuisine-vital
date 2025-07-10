import HeroSection from "../components/HeroSection";
import MenuCarousel from "../components/MenuCarousel";
import AddOnSection from "../components/AddOnSection";
import FooterSection from "../components/FooterSection";
import Header from "../components/Header";

const LandingPage = () => {
    return (
        <>
        <Header/>
        <HeroSection />
        <MenuCarousel />
        <AddOnSection />
        <FooterSection/>
        </>
    );
}

export default LandingPage;