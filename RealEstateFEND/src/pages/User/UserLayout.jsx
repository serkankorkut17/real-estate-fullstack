import { Outlet } from "react-router-dom";
import UserHeader from "../../components/UserHeader";
import Footer from "../../components/Footer";
import ScrollToTopButton from "../../components/ScrollToTopButton";

const UserLayout = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
			{/* Header */}
			<UserHeader />

			{/* Main Content */}
			<main className="flex-1">
				<Outlet />
			</main>

			{/* Footer */}
			<Footer />
			<ScrollToTopButton />
		</div>
	);
};

export default UserLayout;