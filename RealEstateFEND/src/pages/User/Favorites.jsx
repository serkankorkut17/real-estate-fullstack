import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/Auth";
import PropertyCard from "../../components/Properties/PropertyCard";
import Loading from "../../components/Loading";
import { HiHeart } from "react-icons/hi";

const Favorites = () => {
	const { t } = useTranslation("common");
	const { favorites, user, loading } = useAuthContext();

	if (loading) {
		return <Loading />;
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-16">
					<HiHeart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						{t("auth.pleaseLogin")}
					</h2>
					<p className="text-gray-600 dark:text-gray-300">
						{t("favorites.loginRequired")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center mb-4">
					<HiHeart className="h-8 w-8 text-red-500 mr-3" />
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{t("favorites.title")}
					</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-300">
					{favorites.length > 0
						? t("favorites.subtitle", { count: favorites.length })
						: t("favorites.emptySubtitle")
					}
				</p>
			</div>

			{/* Favorites Grid */}
			{favorites.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{favorites.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							buttonName={t("favorites.viewProperty")}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<HiHeart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						{t("favorites.empty")}
					</h2>
					<p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
						{t("favorites.emptyDescription")}
					</p>
					<button
						onClick={() => window.location.href = '/properties'}
						className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
					>
						{t("favorites.browseProperties")}
					</button>
				</div>
			)}
		</div>
	);
};

export default Favorites;
