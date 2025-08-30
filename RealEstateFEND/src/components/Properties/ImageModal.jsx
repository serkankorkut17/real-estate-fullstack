import React from "react";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const ImageModal = ({
	showImageModal,
	setShowImageModal,
	property,
	selectedImageIndex,
  setSelectedImageIndex,
}) => {
	const nextImage = () => {
		if (property?.media && property.media.length > 0) {
			setSelectedImageIndex((prev) =>
				prev === property.media.length - 1 ? 0 : prev + 1
			);
		}
	};

	const prevImage = () => {
		if (property?.media && property.media.length > 0) {
			setSelectedImageIndex((prev) =>
				prev === 0 ? property.media.length - 1 : prev - 1
			);
		}
	};

	return (
		<Modal
			show={showImageModal}
			onClose={() => setShowImageModal(false)}
			size="7xl"
			className="dark"
		>
			<ModalHeader className="dark:bg-gray-800 dark:border-gray-700">
				<div className="flex items-center justify-between w-full">
					<span className="dark:text-white">{property.title}</span>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						{selectedImageIndex + 1} / {property.media?.length || 0}
					</span>
				</div>
			</ModalHeader>
			<ModalBody className="dark:bg-gray-900">
				{property.media && property.media[selectedImageIndex] && (
					<div className="relative">
						<img
							src={property.media[selectedImageIndex].url}
							alt={property.title}
							className="w-full max-h-[75vh] object-contain"
						/>
						{property.media.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
								>
									<HiChevronLeft className="h-6 w-6" />
								</button>
								<button
									onClick={nextImage}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
								>
									<HiChevronRight className="h-6 w-6" />
								</button>
							</>
						)}
					</div>
				)}
			</ModalBody>
		</Modal>
	);
};

export default ImageModal;
