import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminSidebar from "../../components/AdminSidebar";
import Footer from "../../components/Footer";

const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Sidebar */}
			<AdminSidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 lg:ml-0">
				{/* Header */}
				<AdminHeader
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>

				{/* Page Content */}
				<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 mt-[60px] py-8 px-6 lg:py-4 lg:px-3 lg:pr-4">
					<div className="w-full max-w-none">
						<Outlet />
					</div>
				</main>

				{/* Footer */}
				<Footer />
			</div>

			{/* Mobile sidebar overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
};

export default AdminLayout;
