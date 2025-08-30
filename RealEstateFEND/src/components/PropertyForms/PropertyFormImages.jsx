import {
	Card,
	Label,
	FileInput,
	Modal,
	ModalFooter,
	ModalBody,
	ModalHeader,
	Button,
} from "flowbite-react";
import { HiX, HiExclamation } from "react-icons/hi";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PropertyFormImages = ({
	images,
	existingImages,
	handleImageUpload,
	removeImage,
	removeExistingImage,
}) => {
	const { t } = useTranslation();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [imageToDelete, setImageToDelete] = useState(null);

	const handleDeleteClick = (image, index) => {
		setImageToDelete({ image, index });
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (imageToDelete) {
			removeExistingImage(imageToDelete.index, imageToDelete.image);
			setShowDeleteModal(false);
			setImageToDelete(null);
		}
	};

	const cancelDelete = () => {
		setShowDeleteModal(false);
		setImageToDelete(null);
	};

	return (
		<Card>
			<div className="p-6">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					{t("propertyForm.steps.photos")}
				</h3>
				<div className="mb-4">
					<Label htmlFor="images" value={t("propertyForm.photos.uploadLabel")}>
						{t("propertyForm.photos.uploadLabel")}
					</Label>
					<FileInput
						id="images"
						accept="image/*"
						multiple
						onChange={handleImageUpload}
						helperText={t("propertyForm.photos.helperText")}
					/>
				</div>
				{/* Existing Images */}
				{existingImages.length > 0 && (
					<div className="mb-4">
						<h4 className="text-sm font-medium text-gray-700 mb-2">
							{t("propertyForm.photos.existingPhotos")}
						</h4>
						<div className="grid grid-cols-3 md:grid-cols-6 gap-4">
							{existingImages.map((image, index) => (
								<div key={index} className="relative">
									<img
										src={image.url}
										alt={`Existing ${index + 1}`}
										className="w-full h-20 object-cover rounded-lg"
									/>
									<button
										type="button"
										onClick={() =>
											handleDeleteClick(image, index)
										}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
									>
										<HiX />
									</button>
								</div>
							))}
						</div>
					</div>
				)}
				{/* New Images */}
				{images.length > 0 && (
					<div>
						<h4 className="text-sm font-medium text-gray-700 mb-2">
							{t("propertyForm.photos.newPhotos")}
						</h4>
						<div className="grid grid-cols-3 md:grid-cols-6 gap-4">
							{images.map((image, index) => (
								<div key={index} className="relative">
									<img
										src={URL.createObjectURL(image)}
										alt={`New ${index + 1}`}
										className="w-full h-20 object-cover rounded-lg"
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
									>
										<HiX />
									</button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<Modal show={showDeleteModal} onClose={cancelDelete} size="md">
				<ModalHeader className="border-b border-gray-200 dark:border-gray-600">
					<div className="flex items-center space-x-2">
						<HiExclamation className="h-6 w-6 text-red-600" />
						<span>{t("propertyForm.photos.deletePhoto")}</span>
					</div>
				</ModalHeader>
				<ModalBody className="border-t border-gray-200 dark:border-gray-600">
					<div className="space-y-4">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{t("propertyForm.photos.deleteConfirmation")}
						</p>
						{imageToDelete && (
							<div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
								<img
									src={imageToDelete.image.url}
									alt={t("propertyForm.photos.photoToDelete")}
									className="w-full h-32 object-cover rounded-lg"
								/>
							</div>
						)}
					</div>
				</ModalBody>
				<ModalFooter>
					<div className="flex space-x-2">
						<Button color="failure" onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
							{t("propertyForm.photos.confirmDelete")}
						</Button>
						<Button color="gray" onClick={cancelDelete}>
							{t("propertyForm.photos.cancel")}
						</Button>
					</div>
				</ModalFooter>
			</Modal>
		</Card>
	);
};

export default PropertyFormImages;
