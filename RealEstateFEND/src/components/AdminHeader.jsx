import {
	Navbar,
	Avatar,
	Dropdown,
	DrawerHeader,
	DropdownItem,
	DropdownDivider,
	DropdownHeader,
} from "flowbite-react";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTheme } from "../context/Theme";
import { useAuthContext } from "../context/Auth";

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
	const { darkMode, toggleDarkMode } = useTheme();
	const { user, logout } = useAuthContext();

	const handleLogout = () => {
		logout();
	};

	return (
		<Navbar
			fluid
			rounded={false}
			className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white"
		>
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center">
					{/* Mobile menu button */}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="lg:hidden p-2 text-gray-600 hover:text-gray-900 mr-3"
					>
						<HiMenuAlt3 className="w-6 h-6" />
					</button>

					{/* Brand/Logo */}
					<Link to="/" className="flex items-center">
						<span className="text-xl font-semibold text-gray-900 dark:text-white">
							Real Estate
						</span>
					</Link>
				</div>

				<div className="items-center space-x-4 flex relative">
					{/* User Profile Dropdown */}
					{/* Right section: User dropdown */}
					<div className="flex items-center">
						<Dropdown
							arrowIcon={false}
							inline={true}
							placement="bottom-end"
							label={
								<Avatar
									alt="User settings"
									img={user?.profilePictureUrl || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
									rounded
								/>
							}
						>
							<DropdownHeader>
								<p className="text-sm text-gray-900 dark:text-white">
									Welcome,{" "}
									<span className="font-semibold">{user?.firstName || "User"}</span>
								</p>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
									{user?.email || "Email"}
								</p>
							</DropdownHeader>
							<DropdownItem as={Link} to="/profile">
								My Profile
							</DropdownItem>
							<DropdownItem as="button" onClick={toggleDarkMode}>
								Dark Mode
							</DropdownItem>
							{/* <DropdownItem as={Link} to="/settings">
								Settings
							</DropdownItem> */}
							<DropdownDivider />
							<DropdownItem as={Link} to="/" onClick={logout}>
								Sign out
							</DropdownItem>
						</Dropdown>
					</div>
				</div>
			</div>
		</Navbar>
	);
};

export default AdminHeader;
