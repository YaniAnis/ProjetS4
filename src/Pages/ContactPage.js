import React, { useState } from 'react';
import './Contact.css';
import { ChevronRight, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqData = [
	{
		question: 'Comment acheter un billet sur votre site ? ',
		answer:
			'Il vous suffit de sélectionner le match qui vous intéresse, de choisir la catégorie de place, puis de cliquer sur “Réserver”. Le paiement se fait ensuite en ligne par carte bancaire',
	},
	{
		question: 'Puis je annuler ou échanger mes billets ?',
		answer:
			"Les billets ne sont ni échangeables ni remboursables, sauf en cas d'annulation du match. .",
	},
	{
		question: 'Quand vais-je recevoir mes billets  ?',
		answer:
			'Vos billets sont envoyés par e-mail immédiatement après validation du paiement.',
	},
	{
		question: "Est-ce que les billets sont nominatifs ?",
		answer:
			'Non, les billets ne sont généralement pas nominatifs, sauf indication contraire. Une pièce d’identité peut toutefois être demandée à l’entrée du stade.',
	},
	{
		question: 'Les billets sont-ils électroniques ou physiques  ?',
		answer:
			"Tous les billets sont électroniques (e-tickets) et peuvent être présentés directement depuis votre téléphone à l’entrée du stade. Aucun envoi postal n’est nécessaire.",
	},
	{
		question: 'Que faire si je n’ai pas reçu mes billets par e-mail ?',
		answer:
			'Vérifiez d’abord votre dossier “spam” ou “courrier indésirable”. Si vous ne trouvez toujours rien, connectez-vous à votre espace client pour les télécharger directement ou contactez notre support.',
	},
];

function ContactPage() {
	const navigate = useNavigate();
	const [openIndex, setOpenIndex] = useState(null);

	const handleContactClick = () => {
		navigate('/contact-message');
	};

	const handleToggle = (idx) => {
		setOpenIndex(openIndex === idx ? null : idx);
	};

	return (
		<main className="help-page">
			{/* Stadium Background Image */}
			<div className="stadium-background">
				<img
					src="/images/Contact/stadium-background.png"
					alt="Stadium"
					className="stadium-image"
				/>
				<div className="overlay"></div>
			</div>

			{/* Content Container */}
			<div className="container">
				{/* Header Section */}
				<div className="header-section">
					<h1 className="main-title">NEED HELP ?</h1>
				</div>

				{/* Main Content */}
				<div className="content-grid">
					{/* Left Column - Information of the Moment */}
					<div className="info-column">
						<h2 className="section-title">INFORMATIONS OF THE MOMENT</h2>
						<div className="faq-list">
							{faqData.map((item, idx) => (
								<div
									className={`faq-item dark${
										openIndex === idx ? ' open' : ''
									}`}
									key={idx}
								>
									<div
										className="faq-title-row"
										onClick={() => handleToggle(idx)}
									>
										<span className="faq-title">{item.question}</span>
										<ChevronRight
											className="chevron-icon"
											style={{
												transition: 'transform 0.2s',
												transform:
													openIndex === idx
														? 'rotate(90deg)'
														: 'rotate(0deg)',
											}}
										/>
									</div>
									{openIndex === idx && (
										<div
											className="faq-answer"
											style={{
												marginTop: '8px',
												color: '#b0ffb0',
											}}
										>
											{item.answer}
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Right Column - Email Contact */}
					<div className="email-column">
						<div className="email-content">
							<div className="email-icon-container">
								<Mail className="email-icon" />
							</div>
							<h2 className="email-title">EMAIL</h2>
							<p className="email-description">
								Vous n'avez pas trouvé la réponse à votre question ?
								<br />
								Contactez notre équipe de support.
							</p>
							<button
								onClick={handleContactClick}
								className="contact-button"
							>
								Contacter
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export default ContactPage;