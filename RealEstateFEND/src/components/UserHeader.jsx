import {
	Navbar,
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownDivider,
	DropdownHeader,
	Button,
	TextInput,
	Modal,
	ModalBody,
	ModalHeader,
} from "flowbite-react";
import { useState } from "react";
import {
	HiSearch,
	HiHome,
	HiHeart,
	HiUser,
	HiPlus,
	HiMenu,
	HiX,
	HiGlobe,
	HiChat,
} from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/Theme";
import { useAuthContext } from "../context/Auth";
import { useTranslation } from "react-i18next";

const UserHeader = () => {
	const location = useLocation();
	const isMainPage = location.pathname === "/";
	const { darkMode, toggleDarkMode } = useTheme();
	const { user, logout, isLoggedIn } = useAuthContext();
	const { t, i18n } = useTranslation("common");
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);

	const currentLanguage = i18n.language || "tr";

	const handleLogout = () => {
		logout();
		setShowMobileMenu(false);
	};

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(
				`/properties?search=${encodeURIComponent(searchQuery.trim())}`
			);
			setShowMobileSearch(false);
		}
	};

	return (
		<>
			<Navbar
				fluid
				rounded={false}
				className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50"
			>
				<div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
					{/* Mobile Menu Button */}
					<div className="flex items-center space-x-3">
						<button
							onClick={() => setShowMobileMenu(true)}
							className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
						>
							<HiMenu className="w-6 h-6" />
						</button>

						{/* Logo and Brand */}
						<Link to="/" className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
								<HiHome className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900 dark:text-white">
								RealEstate
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-6">
						<Link
							to="/"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
						>
							{t("navbar.home")}
						</Link>
						<Link
							to="/properties"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
						>
							{t("navbar.properties")}
						</Link>
						<Link
							to="/map"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
						>
							{t("navbar.map")}
						</Link>
						{/* <Link
							to="/about"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
						>
							{t("navbar.about")}
						</Link>
						<Link
							to="/contact"
							className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
						>
							{t("navbar.contact")}
						</Link> */}
					</div>

					{/* Desktop Search Bar */}
					{isMainPage && (
						<div className="hidden md:flex flex-1 max-w-lg mx-8">
							<form onSubmit={handleSearch} className="w-full">
								<div className="relative">
									<TextInput
										type="text"
										placeholder={t(
											"navbar.searchPlaceholder"
										)}
										value={searchQuery}
										onChange={(e) =>
											setSearchQuery(e.target.value)
										}
										rightIcon={HiSearch}
										className="w-full"
									/>
								</div>
							</form>
						</div>
					)}

					{/* Right Section - User Actions */}
					<div className="flex items-center space-x-2">
						{isLoggedIn() ? (
							<>
								{/* Add Property Button */}
								<Button
									as={Link}
									to="/properties/new"
									color="blue"
									size="sm"
									className="hidden sm:flex"
								>
									<HiPlus className="w-4 h-4 mr-2" />
									{t("navbar.post")}
								</Button>

								{/* Language Selector */}
								<Dropdown
									arrowIcon={false}
									inline={true}
									placement="bottom-end"
									label={
										<div className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer">
											<HiGlobe className="w-4 h-4" />
											<span className="hidden sm:inline">
												{currentLanguage === "en"
													? "🇺🇸 EN"
													: "🇹🇷 TR"}
											</span>
											<span className="sm:hidden">
												{currentLanguage === "en"
													? "🇺🇸"
													: "🇹🇷"}
											</span>
										</div>
									}
								>
									<DropdownItem
										onClick={() => changeLanguage("tr")}
										className={
											currentLanguage === "tr"
												? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
												: ""
										}
									>
										<div className="flex items-center space-x-2">
											<span>🇹🇷</span>
											<span>Türkçe</span>
											{currentLanguage === "tr" && (
												<span className="text-blue-600">
													✓
												</span>
											)}
										</div>
									</DropdownItem>
									<DropdownItem
										onClick={() => changeLanguage("en")}
										className={
											currentLanguage === "en"
												? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
												: ""
										}
									>
										<div className="flex items-center space-x-2">
											<span>🇺🇸</span>
											<span>English</span>
											{currentLanguage === "en" && (
												<span className="text-blue-600">
													✓
												</span>
											)}
										</div>
									</DropdownItem>
								</Dropdown>
								{/* User Profile Dropdown */}
								<Dropdown
									arrowIcon={false}
									inline={true}
									placement="bottom-end"
									label={
										<Avatar
											alt="User settings"
											img={
												user?.profilePicture ||
												"https://flowbite.com/docs/images/people/profile-picture-5.jpg"
											}
											rounded
											size="sm"
										/>
									}
								>
									<DropdownHeader>
										<p className="text-sm text-gray-900 dark:text-white">
											{t("navbar.welcome")}{" "}
											<span className="font-semibold">
												{user?.firstName ||
													t("navbar.user")}
											</span>
										</p>
										<p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
											{user?.email || "Email"}
										</p>
									</DropdownHeader>
									<DropdownItem as={Link} to="/user/profile">
										{t("navbar.profile")}
									</DropdownItem>
									<DropdownItem
										as={Link}
										to="/user/my-properties"
									>
										{t("navbar.myProperties")}
									</DropdownItem>
									<DropdownItem
										as={Link}
										to="/user/favorites"
									>
										{t("navbar.favorites")}
									</DropdownItem>
									<DropdownItem as={Link} to="/user/messages">
										{t("navbar.messages")}
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem
										as="button"
										onClick={toggleDarkMode}
									>
										{darkMode ? t("navbar.lightTheme") : t("navbar.darkTheme")}
									</DropdownItem>
									{/* <DropdownItem as={Link} to="/user/settings">
										{t("navbar.settings")}
									</DropdownItem> */}
									<DropdownDivider />
									<DropdownItem
										as="button"
										onClick={handleLogout}
										className="text-red-600"
									>
										{t("navbar.logout")}
									</DropdownItem>
								</Dropdown>
							</>
						) : (
							<>
								{/* Language Selector for non-authenticated users */}
								<Dropdown
									arrowIcon={false}
									inline={true}
									placement="bottom-end"
									label={
										<div className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer">
											<HiGlobe className="w-4 h-4" />
											<span className="hidden sm:inline">
												{currentLanguage === "en"
													? "🇺🇸 EN"
													: "🇹🇷 TR"}
											</span>
											<span className="sm:hidden">
												{currentLanguage === "en"
													? "🇺🇸"
													: "🇹🇷"}
											</span>
										</div>
									}
								>
									<DropdownItem
										onClick={() => changeLanguage("tr")}
										className={
											currentLanguage === "tr"
												? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
												: ""
										}
									>
										<div className="flex items-center space-x-2">
											<span>🇹🇷</span>
											<span>Türkçe</span>
											{currentLanguage === "tr" && (
												<span className="text-blue-600">
													✓
												</span>
											)}
										</div>
									</DropdownItem>
									<DropdownItem
										onClick={() => changeLanguage("en")}
										className={
											currentLanguage === "en"
												? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
												: ""
										}
									>
										<div className="flex items-center space-x-2">
											<span>🇺🇸</span>
											<span>English</span>
											{currentLanguage === "en" && (
												<span className="text-blue-600">
													✓
												</span>
											)}
										</div>
									</DropdownItem>
								</Dropdown>

								{/* Login/Register Buttons for non-authenticated users */}
								<Button
									as={Link}
									to="/login"
									color="gray"
									size="sm"
								>
									{t("navbar.login")}
								</Button>
								<Button
									as={Link}
									to="/signup"
									color="blue"
									size="sm"
									className="hidden sm:flex"
								>
									{t("navbar.register")}
								</Button>
							</>
						)}

						{/* Mobile Search Button */}
						<button
							onClick={() => setShowMobileSearch(true)}
							className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
						>
							<HiSearch className="w-6 h-6" />
						</button>
					</div>
				</div>
			</Navbar>

			{/* Mobile Menu Modal */}
			{showMobileMenu && (
				<div className="fixed inset-0 z-50 lg:hidden">
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/75"
						onClick={() => setShowMobileMenu(false)}
					></div>

					{/* Sidebar */}
					<div
						className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${
							showMobileMenu
								? "translate-x-0"
								: "-translate-x-full"
						}`}
					>
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
										<HiHome className="w-5 h-5 text-white" />
									</div>
									<span className="text-lg font-bold text-gray-900 dark:text-white">
										RealEstate
									</span>
								</div>
								<button
									onClick={() => setShowMobileMenu(false)}
									className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
								>
									<HiX className="w-6 h-6" />
								</button>
							</div>

							{/* Menu Items */}
							<div className="flex-1 overflow-y-auto">
								<div className="p-4">
									{isLoggedIn() && (
										<div className="mb-6">
											<div className="flex items-center space-x-3 mb-4">
												<Avatar
													alt="User"
													img={
														user?.profilePicture ||
														"https://flowbite.com/docs/images/people/profile-picture-5.jpg"
													}
													rounded
													size="sm"
												/>
												<div>
													<p className="text-sm font-semibold text-gray-900 dark:text-white">
														{user?.firstName ||
															t("navbar.user")}
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
														{user?.email}
													</p>
												</div>
											</div>
										</div>
									)}

									<nav className="space-y-2">
										<Link
											to="/properties"
											className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											<HiHome className="w-5 h-5" />
											<span>
												{t("navbar.properties")}
											</span>
										</Link>

										<Link
											to="/map"
											className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											<HiSearch className="w-5 h-5" />
											<span>{t("navbar.map")}</span>
										</Link>

										{isLoggedIn() && (
											<>
												<Link
													to="/properties/new"
													className="flex items-center space-x-3 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors font-medium"
													onClick={() =>
														setShowMobileMenu(false)
													}
												>
													<HiPlus className="w-5 h-5" />
													<span>
														{t("navbar.post")}
													</span>
												</Link>

												<Link
													to="/user/favorites"
													className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
													onClick={() =>
														setShowMobileMenu(false)
													}
												>
													<HiHeart className="w-5 h-5" />
													<span>
														{t("navbar.favorites")}
													</span>
												</Link>

												<Link
													to="/user/messages"
													className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
													onClick={() =>
														setShowMobileMenu(false)
													}
												>
													<HiChat className="w-5 h-5" />
													<span>
														{t("navbar.messages")}
													</span>
												</Link>

												<Link
													to="/user/profile"
													className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
													onClick={() =>
														setShowMobileMenu(false)
													}
												>
													<HiUser className="w-5 h-5" />
													<span>
														{t("navbar.profile")}
													</span>
												</Link>
											</>
										)}

										<Link
											to="/about"
											className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											<HiHome className="w-5 h-5" />
											<span>{t("navbar.about")}</span>
										</Link>

										<Link
											to="/contact"
											className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											<HiUser className="w-5 h-5" />
											<span>{t("navbar.contact")}</span>
										</Link>

										{/* Language Selector in Mobile Menu */}
										<div className="px-3 py-2">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
													{t("navbar.language")}
												</span>
											</div>
											<div className="flex space-x-2">
												<button
													onClick={() => {
														changeLanguage("tr");
														setShowMobileMenu(
															false
														);
													}}
													className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
														currentLanguage === "tr"
															? "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
															: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
													}`}
												>
													<span>🇹🇷</span>
													<span>TR</span>
													{currentLanguage ===
														"tr" && <span>✓</span>}
												</button>
												<button
													onClick={() => {
														changeLanguage("en");
														setShowMobileMenu(
															false
														);
													}}
													className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
														currentLanguage === "en"
															? "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
															: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
													}`}
												>
													<span>🇺🇸</span>
													<span>EN</span>
													{currentLanguage ===
														"en" && <span>✓</span>}
												</button>
											</div>
										</div>
									</nav>
								</div>
							</div>

							{/* Footer */}
							<div className="border-t border-gray-200 dark:border-gray-700 p-4">
								{isLoggedIn() ? (
									<>
										<button
											onClick={toggleDarkMode}
											className="flex items-center space-x-3 px-3 py-2 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-left"
										>
											<span className="w-5 h-5">🌙</span>
											<span>
												{darkMode
													? t("navbar.lightTheme")
													: t("navbar.darkTheme")}
											</span>
										</button>
										<button
											onClick={handleLogout}
											className="flex items-center space-x-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors text-left mt-2"
										>
											<span className="w-5 h-5">🚪</span>
											<span>{t("navbar.logout")}</span>
										</button>
									</>
								) : (
									<div className="space-y-2">
										<Link
											to="/login"
											className="block w-full px-3 py-2 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											{t("navbar.login")}
										</Link>
										<Link
											to="/signup"
											className="block w-full px-3 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											{t("navbar.register")}
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Mobile Search Modal */}
			<Modal
				show={showMobileSearch}
				onClose={() => setShowMobileSearch(false)}
				size="md"
			>
				<ModalHeader>{t("navbar.search")}</ModalHeader>
				<ModalBody>
					<form onSubmit={handleSearch}>
						<TextInput
							type="text"
							placeholder={t("navbar.searchPlaceholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							rightIcon={HiSearch}
							className="w-full"
							autoFocus
						/>
						<Button
							type="submit"
							className="w-full mt-4"
							color="blue"
						>
							{t("navbar.search")}
						</Button>
					</form>
				</ModalBody>
			</Modal>
		</>
	);
};

export default UserHeader;
