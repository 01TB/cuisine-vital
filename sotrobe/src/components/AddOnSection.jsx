import { Container, Row, Col, ListGroup, Button, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import kafe from '../assets/kafe.png';

const AddOnSection = () => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        setImageUrl(kafe);
    }, []);

    return (
        <Container fluid className="">
            {/* Floating CSS animation */}
            <style>
                {`
                    .floating-image {
                        animation: float 3s ease-in-out infinite;
                    }

                    @keyframes float {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0); }
                    }
                `}
            </style>

            <Row className="align-items-center">
                <Col md={6} className="p-5">
                    <h2 className="mb-4 fw-bold">Choisissez un accompagnement et une boisson</h2>
                    <p className="text-muted">
                        Complétez votre plat avec une boisson chaude ou froide et un accompagnement gourmand.
                        C'est inclus dans votre formule !
                    </p>

                    <Button variant="dark rounded-5">Voir les menus</Button>
                </Col>

                <Col md={6} className="d-flex justify-content-center">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Image d'accompagnement"
                            fluid
                            rounded
                            className="floating-image"
                            style={{ height: "600px", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                height: "600px",
                                backgroundColor: "#ddd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#888",
                                fontSize: "1.2rem"
                            }}
                        >
                            Image indisponible
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AddOnSection;
