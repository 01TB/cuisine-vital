import React, { useState, useEffect, useRef } from "react";
import foodImg from '../assets/food-bg.jpg';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [count, setCount] = useState(0); // 0 for Step 1, 1 for Step 2, 2 for Success Popup
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        telephone: '',
        adresse: '',
        typeClient: 'PARTICULIER',
    });
    const [isCompany, setIsCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formFieldsRef = useRef(null);
    const [scrollableAreaMaxHeight, setScrollableAreaMaxHeight] = useState('auto');
    const navigate = useNavigate();

    useEffect(() => {
        if (count === 1) {
            const adjustHeight = () => {
                if (formFieldsRef.current) {
                    const formContainer = formFieldsRef.current.closest('.col-md-6');
                    if (formContainer) {
                        const headerHeight = 100;
                        const buttonContainerHeight = 150;
                        const columnPadding = 5 * 16 * 2;
                        const availableHeight = formContainer.clientHeight - headerHeight - buttonContainerHeight - columnPadding;
                        setScrollableAreaMaxHeight(`${Math.max(0, availableHeight)}px`);
                    }
                }
            };
            adjustHeight();
            window.addEventListener('resize', adjustHeight);
            return () => {
                window.removeEventListener('resize', adjustHeight);
            };
        }
    }, [count]);

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            typeClient: isCompany ? 'ENTREPRISE' : 'PARTICULIER',
            prenom: isCompany ? '' : prev.prenom
        }));
    }, [isCompany]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setIsCompany(e.target.checked);
    };

    const handleNext = () => {
        setError(null);
        if (!formData.nom || !formData.adresse || !formData.telephone) {
            setError("Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Adresse).");
            return;
        }
        if (!isCompany && !formData.prenom) {
            setError("Veuillez renseigner votre prénom.");
            return;
        }
        setCount(1);
    };

    const handleSubmitFinal = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // REMINDER: zoneLivraisonId is required by your backend entity.
            // Replace '1' with actual logic to select a zone ID,
            // or ensure your backend handles it appropriately (e.g., a default value).
            const dataToSend = {
                ...formData,
                zoneLivraisonId: 1 
            };

            const response = await fetch('http://localhost:3000/client/register', { // !! Replace with your NestJS backend URL !!
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'inscription.');
            }

            const result = await response.json();
            console.log('Client registered successfully:', result);
            setLoading(false);
            setCount(2); // Show success popup
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Une erreur inattendue est survenue.');
            setLoading(false);
        }
    };

    // Define common styles
    const softInputStyle = "form-control border-0 bg-secondary-subtle rounded-pill py-2 px-3";
    const softInputStyleTextarea = "form-control border-0 bg-secondary-subtle rounded-3 py-2 px-3";
    const softButtonStyle = "btn rounded-pill fw-semibold py-2 px-4";
    const primaryColor = '#f0ad4e'; // Your primary orange color

    return (
        <div className="container-fluid overflow-hidden min-vh-100 d-flex align-items-center p-0">
            {/* Step 1: Basic Information */}
            {count === 0 && (
                <div className="row g-0 w-100 min-vh-100">
                    <div className="col-md-6 d-flex flex-column justify-content-center p-5 bg-white">
                        <h1 className="display-4 fw-bold mb-3" style={{ color: primaryColor }}>Sotro be</h1>
                        <h2 className="mb-3 text-muted">Bienvenue !</h2>
                        <h3 className="mb-4">Inscrivez-vous pour bénéficier de nos services.</h3>
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="w-100" style={{ maxWidth: '450px' }}>
                            <div className="form-check form-switch mb-4">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    role="switch" 
                                    id="isCompanyToggle"
                                    checked={isCompany}
                                    onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label fw-semibold text-muted" htmlFor="isCompanyToggle">
                                    Je suis une entreprise
                                </label>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="nom" className="form-label fw-semibold text-muted">
                                    Votre nom / Le nom de votre entreprise
                                </label>
                                <input
                                    type="text"
                                    className={softInputStyle}
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="prenom" className="form-label fw-semibold text-muted">Prénom</label>
                                <input
                                    type="text"
                                    className={`${softInputStyle} ${isCompany ? 'bg-secondary-subtle text-muted' : ''}`}
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleInputChange}
                                    disabled={isCompany}
                                    required={!isCompany}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="telephone" className="form-label fw-semibold text-muted">Téléphone</label>
                                <input
                                    type="tel"
                                    className={softInputStyle}
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="adresse" className="form-label fw-semibold text-muted">Adresse</label>
                                <textarea
                                    className={softInputStyleTextarea}
                                    id="adresse"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div className="d-grid gap-2 mt-auto">
                                <button
                                    type="button"
                                    className={`${softButtonStyle}`}
                                    style={{ backgroundColor: primaryColor, color: 'white' }}
                                    onClick={handleNext}
                                >
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex align-items-center justify-content-center bg-light-subtle p-0">
                        <img
                            src={foodImg}
                            alt="Placeholder Image"
                            className="img-fluid w-100 h-100 rounded-0"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            )}

            {/* Step 2: Account Details */}
            {count === 1 && (
                <div className="row g-0 w-100 min-vh-100">
                    <div className="col-md-6 d-flex flex-column justify-content-center p-5 bg-white">
                        <h2 className="card-title text-center mb-4 fw-bold" style={{ color: primaryColor }}>Créez vos identifiants</h2>
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        {loading && (
                            <div className="text-center mb-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmitFinal} className="mx-auto w-100 d-flex flex-column" style={{ maxWidth: '450px', flexGrow: 1 }}>
                            <div 
                                ref={formFieldsRef}
                                className="flex-grow-1 overflow-y-auto pe-2"
                                style={{ maxHeight: scrollableAreaMaxHeight }}
                            >
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold text-muted">Email</label>
                                    <input
                                        type="email"
                                        className={softInputStyle}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="motDePasse" className="form-label fw-semibold text-muted">Mot de passe</label>
                                    <input
                                        type="password"
                                        className={softInputStyle}
                                        id="motDePasse"
                                        name="motDePasse"
                                        value={formData.motDePasse}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-auto pt-3 border-top">
                                <button
                                    type="submit"
                                    className={`${softButtonStyle}`}
                                    style={{ backgroundColor: primaryColor, color: 'white' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                                
                                </button>
                                <button
                                    type="button"
                                    className={`${softButtonStyle} btn-outline-secondary`}
                                    onClick={() => setCount(0)}
                                    disabled={loading}
                                >
                                    Précédent
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-6 d-flex align-items-center justify-content-center bg-light-subtle p-0">
                        <img
                            src={foodImg}
                            alt="Placeholder Image"
                            className="img-fluid w-100 h-100 rounded-0"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            )}

            {/* Success Popup (appears over Step 2 when count === 2) */}
            {count === 2 && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }} // zIndex to be on top
                >
                    <div 
                        className="bg-white shadow-lg rounded-4 overflow-hidden" 
                        style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', display: 'flex' }} // Use flex to help inner row/cols
                    >
                        <div className="row g-0 flex-grow-1"> {/* flex-grow-1 to make row fill container */}
                            {/* Left Column: Image Placeholder */}
                            <div className="col-md-5 d-flex align-items-center justify-content-center p-0">
                                <img
                                    src={foodImg} // You can change this to a specific success image if needed
                                    alt="Success Illustration"
                                    className="img-fluid w-100 h-100 rounded-start-4" // Use rounded-start-4 for consistent corner
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            {/* Right Column: Success Message */}
                            <div className="col-md-7 p-4 d-flex flex-column justify-content-center text-center">
                                <h2 className="card-title mb-3 fw-bold" style={{ color: primaryColor }}>
                                    Félicitations !
                                </h2>
                                <p className="card-text lead mb-4">
                                    Votre inscription a été effectuée avec succès.
                                </p>
                                <p className="card-text mb-4 text-muted">
                                    Nous vous contacterons bientôt pour finaliser votre accès à nos services.
                                </p>
                                <button
                                    type="button"
                                    className={`${softButtonStyle}`}
                                    style={{ backgroundColor: primaryColor, color: 'white' }}
                                    onClick={() => navigate('/login')} // Redirects to login
                                >
                                    Retour à la connexion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}    
        </div>
    );
}

export default SignUp;