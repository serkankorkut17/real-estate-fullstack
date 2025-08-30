import { useEffect, useState } from "react";

const ScrollToTopButton = ({ threshold = 300 }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const onScroll = () => setVisible(window.pageYOffset > threshold);
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => window.removeEventListener('scroll', onScroll);
	}, [threshold]);

	const scrollToTop = () => {
		if (typeof window === 'undefined') return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<button
			aria-label="Scroll to top"
			onClick={scrollToTop}
			className={`fixed right-4 bottom-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} hover:bg-blue-700`}
		>
			<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
			</svg>
		</button>
	);
};

export default ScrollToTopButton;
