import React from 'react';
import HeroSection from "../components/HeroSection";
import MenuCarousel from "../components/MenuCarousel";
import AddOnSection from "../components/AddOnSection";
import FooterSection from "../components/FooterSection";
import Header from "../components/Header";

const AuthenticatedLandingPage = () => {
    // In a real application, you would fetch the user's name from an authentication context or state
    const userName = "Utilisateur"; // Placeholder

    return (
        <>
            <Header />
            <HeroSection />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Bienvenue, {userName} !</h2>
                <p className="text-center lead">Découvrez nos dernières offres et gérez vos commandes.</p>
            </div>
            <MenuCarousel />
            <AddOnSection />
            <FooterSection />
        </>
    );
}

export default AuthenticatedLandingPage;
