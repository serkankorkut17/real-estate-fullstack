import { useState, useRef } from "react";
import { Button } from "flowbite-react";
import { HiMap, HiX } from "react-icons/hi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationSelector = ({
	formData,
	setFormData,
	locationInfo,
	setLocationInfo,
	loading = false,
	setLoading,
}) => {
	const { t } = useTranslation();
	const [showMapModal, setShowMapModal] = useState(false);
	const [tempMapLocation, setTempMapLocation] = useState(null);
	const [mapCenter, setMapCenter] = useState({
		latitude: 41.0082,
		longitude: 28.9784,
	});
	const [mapZoom, setMapZoom] = useState(15);

	// Geocoding cache - aynı adresi tekrar aramaktan kaçınmak için
	const geocodeCache = useState(new Map())[0];

	// Rate limiting için son istek zamanı
	const lastRequestTime = useRef(0);

	// Geocoding functions - İyileştirilmiş versiyon
	const geocodeAddress = async (address) => {
		try {
			// Cache kontrolü
			const cacheKey = address.toLowerCase().trim();
			if (geocodeCache.has(cacheKey)) {
				console.log(`Cache hit for: ${address}`);
				return geocodeCache.get(cacheKey);
			}

			// Rate limiting - minimum 1 saniye bekleme
			const now = Date.now();
			const timeSinceLastRequest = now - lastRequestTime.current;
			if (timeSinceLastRequest < 1000) {
				const waitTime = 1000 - timeSinceLastRequest;
				console.log(`Rate limiting: waiting ${waitTime}ms`);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
			lastRequestTime.current = Date.now();

			// Adres formatını optimize et
			const cleanAddress = address.replace(/\s+/g, " ").trim();

			// Nominatim API (OpenStreetMap) - Gelişmiş parametreler
			const params = new URLSearchParams({
				format: "json",
				q: cleanAddress,
				countrycodes: "tr",
				limit: "5", // Daha fazla sonuç al
				addressdetails: "1", // Adres detaylarını al
				extratags: "1", // Ekstra etiketler
				namedetails: "1", // İsim detayları
				"accept-language": "tr,en", // Türkçe öncelik
			});

			console.log(`🌐 API Request: /api/geocode?${params.toString()}`);

			const response = await fetch(`/api/geocode?${params.toString()}`, {
				headers: {
					"User-Agent": "RealEstate-App/1.0",
					"Accept-Language": "tr,en;q=0.9",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(`📊 API Response for "${cleanAddress}":`, data);

			if (data && data.length > 0) {
				console.log(`🎯 Found ${data.length} results`);

				// En iyi sonucu seç (confidence score'a göre)
				const bestResult = data.reduce((best, current) => {
					const bestImportance = parseFloat(best.importance || 0);
					const currentImportance = parseFloat(
						current.importance || 0
					);
					return currentImportance > bestImportance ? current : best;
				});

				console.log(`🏆 Best result:`, bestResult);

				const result = {
					latitude: parseFloat(bestResult.lat),
					longitude: parseFloat(bestResult.lon),
					display_name: bestResult.display_name,
					importance: bestResult.importance,
					type: bestResult.type,
					address: bestResult.address,
				};

				// Cache'e kaydet
				geocodeCache.set(cacheKey, result);

				return result;
			} else {
				console.log(`❌ No results found for "${cleanAddress}"`);
			}

			// Başarısız sonuçları da cache'le (tekrar denememeyi önlemek için)
			geocodeCache.set(cacheKey, null);
			return null;
		} catch (error) {
			console.error("Geocoding error:", error);
			// Rate limiting kontrolü
			if (error.message.includes("429")) {
				throw new Error(
					t("locationSelector.rateLimitError")
				);
			}
			return null;
		}
	};

	const handleLocationFromAddress = async () => {
		if (!formData.city || !formData.district) {
			alert(
				t("locationSelector.minimumLocationRequired")
			);
			return;
		}

		// Adres formatını optimize et - daha doğru sonuçlar için
		const addressParts = [
			formData.addressLine,
			formData.street,
			formData.neighborhood,
			formData.district,
			formData.city,
			"Turkey",
		].filter(Boolean);

		// adresline kısmında sadece no:32 ya da No: 32 kısmını al
		const addressNumberMatch = formData.addressLine.match(/no:\s*\d+/i);
		let addressNumber = "";
		if (addressNumberMatch) {
			addressNumber = addressNumberMatch[0];
		}

		console.log(addressNumber);

		// Birden fazla kombinasyon dene - daha akıllı formatlar
		const addressCombinations = [
			// En detaylı format
			addressParts.join(", "),

			// Türkiye formatı - sokak no mahalle ilçe şehir
			`${addressNumber} ${formData.street}, ${formData.neighborhood}, ${formData.district}, ${formData.city}, Turkey`
				.replace(/,\s*,/g, ",")
				.replace(/^,\s*|,\s*$/g, ""),

			// Sadece önemli kısımlar
			`${formData.street || ""} ${formData.neighborhood || ""} ${
				formData.district
			} ${formData.city} Turkey`
				.replace(/\s+/g, " ")
				.trim(),

			// Mahalle ilçe şehir
			`${formData.neighborhood || ""} ${formData.district} ${
				formData.city
			} Turkey`
				.replace(/\s+/g, " ")
				.trim(),

			// İlçe şehir
			`${formData.district} ${formData.city}, Turkey`,

			// Sadece şehir
			`${formData.city}, Turkey`,
		].filter(
			(addr) =>
				addr.length > 10 && addr !== "Turkey" && !addr.startsWith(",")
		);

		setLoading(true);
		try {
			let result = null;
			let successAddress = "";

			// Sırayla dene, en detaylıdan başla
			for (const address of addressCombinations) {
				console.log(`🔍 Trying address: "${address}"`);
				result = await geocodeAddress(address);

				if (result) {
					successAddress = address;
					console.log(`✅ Success with: "${address}"`);
					console.log(
						`📍 Coordinates: ${result.latitude}, ${result.longitude}`
					);
					console.log(`📝 Display name: ${result.display_name}`);
					break;
				} else {
					console.log(`❌ Failed with: "${address}"`);
				}

				// Rate limiting'den kaçınmak için kısa bekleme
				await new Promise((resolve) => setTimeout(resolve, 500));
			}

			if (result) {
				setLocationInfo({
					latitude: result.latitude,
					longitude: result.longitude,
					source: "address",
				});

				// Daha detaylı bilgi göster
				const confidence = result.importance
					? (parseFloat(result.importance) * 100).toFixed(1)
					: "N/A";
				alert(
					`✅ ${t("locationSelector.locationFound")}\n\n${t("locationSelector.address")}: ${
						result.display_name
					}\n${t("locationSelector.coordinates")}: ${result.latitude.toFixed(
						6
					)}, ${result.longitude.toFixed(
						6
					)}\n${t("locationSelector.confidenceScore")}: %${confidence}\n\n${t("locationSelector.usedSearch")}: "${successAddress}"`
				);
			} else {
				// Kullanıcıya hangi adreslerin denendiğini göster
				alert(
					`❌ ${t("locationSelector.locationNotFound")}\n\n${t("locationSelector.triedAddresses")}:\n${addressCombinations
						.map((addr, i) => `${i + 1}. ${addr}`)
						.join(
							"\n"
						)}\n\n${t("locationSelector.suggestions")}:\n• ${t("locationSelector.checkAddress")}\n• ${t("locationSelector.tryGeneral")}\n• ${t("locationSelector.tryEnglishChars")}`
				);
			}
		} catch (error) {
			console.error("Geocoding error:", error);
			alert(`${t("locationSelector.calculationError")}: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	// Reverse geocoding fonksiyonu ekleyelim
	const reverseGeocode = async (latitude, longitude) => {
		try {
			const params = new URLSearchParams({
				format: "json",
				lat: latitude,
				lon: longitude,
				addressdetails: "1",
				"accept-language": "tr,en",
				zoom: "18", // Daha detaylı adres bilgisi için
			});

			console.log(`🔄 Reverse geocoding: ${latitude}, ${longitude}`);

			const response = await fetch(
				`/api/reverse-geocode?${params.toString()}`,
				{
					headers: {
						"User-Agent": "RealEstate-App/1.0",
						"Accept-Language": "tr,en;q=0.9",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(`📍 Reverse geocoding result:`, data);

			if (data && data.address) {
				const address = data.address;

				// Türkiye adres formatına göre field mapping
				let city =
					address.city || address.state || address.province || "";
				let district =
					address.town ||
					address.district ||
					address.municipality ||
					"";

				// Eğer ilçe boşsa ve ilde "Merkez" varsa, "Merkez"i ilçeye taşı
				if (!district && city.toLowerCase().includes("merkez")) {
					district = "Merkez";
					city = city.replace(/merkez/i, "").trim(); // "Merkez" kelimesini ilden kaldır
				}

				// Türkiye adres formatına göre field mapping
				const addressInfo = {
					country: address.country || "Turkey",
					city: city,
					district: district,
					neighborhood:
						address.neighbourhood ||
						address.suburb ||
						address.quarter ||
						"",
					street: address.road || address.street || "",
					addressLine:
						[
							address.house_number,
							address.building,
							address.apartment,
						]
							.filter(Boolean)
							.join(", ") || "",
				};

				return addressInfo;
			}

			return null;
		} catch (error) {
			console.error("Reverse geocoding error:", error);
			return null;
		}
	};

	const handleCurrentLocation = () => {
		if (navigator.geolocation) {
			setLoading(true);
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const lat = position.coords.latitude;
					const lng = position.coords.longitude;

					// Konum bilgisini güncelle
					setLocationInfo({
						latitude: lat,
						longitude: lng,
						source: "geolocation",
					});

					// Reverse geocoding ile adres bilgilerini al
					try {
						const addressInfo = await reverseGeocode(lat, lng);

						if (addressInfo) {
							// Form alanlarını güncelle
							setFormData((prev) => ({
								...prev,
								...addressInfo,
							}));

							setLoading(false);
							alert(
								`✅ ${t("locationSelector.locationAndAddressUpdated")}\n\n` +
									`📍 ${t("locationSelector.coordinates")}: ${lat.toFixed(
										6
									)}, ${lng.toFixed(6)}\n` +
									`🏠 ${t("locationSelector.address")}: ${addressInfo.street || "N/A"} ${
										addressInfo.neighborhood || "N/A"
									}, ${addressInfo.district || "N/A"}, ${
										addressInfo.city || "N/A"
									}\n\n` +
									`${t("locationSelector.formFieldsAutoFilled")}`
							);
						} else {
							setLoading(false);
							alert(
								`⚠️ ${t("locationSelector.locationFoundNoAddress")}\n\n` +
									`📍 ${t("locationSelector.coordinates")}: ${lat.toFixed(
										6
									)}, ${lng.toFixed(6)}\n` +
									`${t("locationSelector.manualAddressNote")}`
							);
						}
					} catch (error) {
						console.error("Address lookup error:", error);
						setLoading(false);
						alert(
							`✅ ${t("locationSelector.locationObtained")}: ${lat.toFixed(6)}, ${lng.toFixed(
								6
							)}\n\n` +
								`⚠️ ${t("locationSelector.addressNotObtained")}`
						);
					}
				},
				(error) => {
					console.error("Konum alınamadı:", error);
					setLoading(false);

					let errorMessage = t("locationSelector.locationNotObtained") + " ";
					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorMessage += t("locationSelector.permissionDenied");
							break;
						case error.POSITION_UNAVAILABLE:
							errorMessage += t("locationSelector.positionUnavailable");
							break;
						case error.TIMEOUT:
							errorMessage += t("locationSelector.timeout");
							break;
						default:
							errorMessage += t("locationSelector.unknownError");
							break;
					}
					alert(errorMessage);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 60000,
				}
			);
		} else {
			alert(t("locationSelector.browserNotSupported"));
		}
	};

	// Harita tıklama eventi için component
	const MapClickHandler = ({ onLocationSelect }) => {
		const map = useMapEvents({
			click: (e) => {
				const { lat, lng } = e.latlng;
				onLocationSelect({ latitude: lat, longitude: lng });
				// map.setView ve setMapCenter çağrısını kaldırıyoruz
				// Sadece marker konumunu güncelliyoruz
			},
		});
		return null;
	};

	// Harita modalını açma
	const handleOpenMapModal = () => {
		// Mevcut konum varsa haritayı o konuma center'la
		const initialLocation =
			locationInfo.latitude && locationInfo.longitude
				? {
						latitude: locationInfo.latitude,
						longitude: locationInfo.longitude,
				  }
				: { latitude: 41.0082, longitude: 28.9784 }; // İstanbul default

		setTempMapLocation(initialLocation);
		setMapCenter(initialLocation);
		setMapZoom(15); // Uygun bir zoom seviyesi
		setShowMapModal(true);
	};

	// Harita konumunu seçme
	const handleMapLocationSelect = async (location) => {
		setTempMapLocation(location);
		
		// Seçilen konumun adres bilgisini al
		try {
			const addressInfo = await reverseGeocode(location.latitude, location.longitude);
			if (addressInfo) {
				const addressText = [
					addressInfo.street,
					addressInfo.neighborhood,
					addressInfo.district,
					addressInfo.city
				].filter(Boolean).join(", ");
				
				setTempMapLocation({
					...location,
					address: addressText || t("locationSelector.addressNotFound")
				});
			}
		} catch (error) {
			console.error("Address lookup error:", error);
		}
	};

	// Harita konumunu onaylama
	const handleConfirmMapLocation = async () => {
		if (tempMapLocation) {
			setLoading(true);

			// Konum bilgisini güncelle
			setLocationInfo({
				latitude: tempMapLocation.latitude,
				longitude: tempMapLocation.longitude,
				source: "map",
			});

			// Reverse geocoding ile adres bilgilerini al
			try {
				const addressInfo = await reverseGeocode(
					tempMapLocation.latitude,
					tempMapLocation.longitude
				);

				if (addressInfo) {
					// Form alanlarını güncelle
					setFormData((prev) => ({
						...prev,
						...addressInfo,
					}));

					setLoading(false);
					setShowMapModal(false);
					alert(
						`✅ ${t("locationSelector.locationAndAddressUpdated")}\n\n` +
							`📍 ${t("locationSelector.coordinates")}: ${tempMapLocation.latitude.toFixed(
								6
							)}, ${tempMapLocation.longitude.toFixed(6)}\n` +
							`🏠 ${t("locationSelector.address")}: ${addressInfo.street || "N/A"} ${
								addressInfo.neighborhood || "N/A"
							}, ${addressInfo.district || "N/A"}, ${
								addressInfo.city || "N/A"
							}\n\n` +
							`${t("locationSelector.formFieldsAutoFilled")}`
					);
				} else {
					setLoading(false);
					setShowMapModal(false);
					alert(
						`⚠️ ${t("locationSelector.locationSelectedNoAddress")}\n\n` +
							`📍 ${t("locationSelector.coordinates")}: ${tempMapLocation.latitude.toFixed(
								6
							)}, ${tempMapLocation.longitude.toFixed(6)}\n` +
							`${t("locationSelector.manualAddressNote")}`
					);
				}
			} catch (error) {
				console.error("Address lookup error:", error);
				setLoading(false);
				setShowMapModal(false);
				alert(
					`✅ ${t("locationSelector.locationSelected")}: ${tempMapLocation.latitude.toFixed(
						6
					)}, ${tempMapLocation.longitude.toFixed(6)}\n\n` +
						`⚠️ ${t("locationSelector.addressNotObtained")}`
				);
			}
		}
	};

	return (
		<div className="dark:bg-gray-800 dark:text-white">
			{/* Location Buttons */}
			<div className="flex flex-wrap gap-3">
				<Button
					type="button"
					color="blue"
					size="sm"
					onClick={handleCurrentLocation}
					disabled={loading}
				>
					📍 {t("locationSelector.useCurrentLocation")}
				</Button>
				{/* <Button
					type="button"
					color="green"
					size="sm"
					onClick={handleLocationFromAddress}
					disabled={loading || !formData.city || !formData.district}
				>
					🗺️ Adresten Konum Hesapla
				</Button> */}
				<Button
					type="button"
					color="purple"
					size="sm"
					onClick={handleOpenMapModal}
					disabled={loading}
				>
					<HiMap className="mr-2 h-4 w-4" />
					{t("locationSelector.selectFromMap")}
				</Button>
			</div>

			{/* Harita Modal */}
			{showMapModal && (
				<div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-full overflow-auto">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								{t("locationSelector.selectLocation")}
							</h3>
							<button
								type="button"
								onClick={() => setShowMapModal(false)}
								className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
							>
								<HiX className="h-6 w-6" />
							</button>
						</div>

						{/* Modal Body */}
						<div className="p-6 space-y-4">
							<div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
								<p className="text-sm text-blue-800 dark:text-blue-300">
									<strong>🗺️ {t("locationSelector.mapUsage")}:</strong> {t("locationSelector.mapUsageDescription")}
								</p>
								{tempMapLocation && (
									<p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
										<strong>📍 {t("locationSelector.selectedLocation")}:</strong>{" "}
										{tempMapLocation.latitude.toFixed(6)},{" "}
										{tempMapLocation.longitude.toFixed(6)}
										{tempMapLocation.address && (
											<span className="block mt-1">
												<strong>🏠 {t("locationSelector.address")}:</strong> {tempMapLocation.address}
											</span>
										)}
									</p>
								)}
							</div>

							<div className="h-96 w-full border rounded-lg overflow-hidden">
								<MapContainer
									center={[
										mapCenter.latitude,
										mapCenter.longitude,
									]}
									zoom={mapZoom}
									style={{
										height: "100%",
										width: "100%",
									}}
								>
									<TileLayer
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>
									<MapClickHandler
										onLocationSelect={
											handleMapLocationSelect
										}
									/>
									{tempMapLocation && (
										<Marker
											position={[
												tempMapLocation.latitude,
												tempMapLocation.longitude,
											]}
										/>
									)}
								</MapContainer>
							</div>

							<div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
								<div className="text-sm text-gray-600 dark:text-gray-300">
									💡 <strong>{t("locationSelector.tip")}:</strong> {t("locationSelector.mapTip")}
								</div>
								<div className="flex gap-2">
									<Button
										color="gray"
										onClick={() => setShowMapModal(false)}
									>
										{t("locationSelector.cancel")}
									</Button>
									<Button
										color="blue"
										onClick={handleConfirmMapLocation}
										disabled={!tempMapLocation}
									>
										{t("locationSelector.confirmLocation")}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default LocationSelector;
