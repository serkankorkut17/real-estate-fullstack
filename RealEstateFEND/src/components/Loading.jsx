import React from "react";
import { Spinner } from "flowbite-react";

const Loading = ({ 
  message = "Yükleniyor...", 
  size = "xl", 
  overlay = true, 
  color = "info",
  variant = "default" // "default", "button", "inline"
}) => {
  
  // Button içinde kullanım için
  if (variant === "button") {
    return (
      <div className="flex items-center space-x-2">
        <Spinner size="sm" color={color} />
        <span>{message}</span>
      </div>
    );
  }

  // Full screen overlay
  if (overlay && variant === "default") {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900/50 backdrop-blur-sm fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <Spinner 
            aria-label="Loading spinner"
            size={size}
            color={color}
          />
          <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
            {message}
          </p>
        </div>
      </div>
    );
  }

  // Inline loading (overlay olmadan)
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <Spinner 
        aria-label="Loading spinner"
        size={size}
        color={color}
      />
      <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
        {message}
      </p>
    </div>
  );
};

export default Loading;


// // API çağrısı sırasında
// {isLoading && <Loading message="Emlak verileri yükleniyor..." />}

// // Form gönderim sırasında
// <Button disabled={isSubmitting}>
//   {isSubmitting ? (
//     <Loading variant="button" message="Kaydediliyor..." />
//   ) : (
//     "Kaydet"
//   )}
// </Button>

// // Sayfa içi loading
// <Loading 
//   overlay={false} 
//   size="lg" 
//   color="success" 
//   message="Harita yükleniyor..." 
// />
