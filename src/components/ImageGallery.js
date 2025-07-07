'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';

export default function ImageGallery({ images = [], title = "Image" }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter out empty or invalid images
  const validImages = images.filter(img => img && img.trim() !== '');

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (!validImages || validImages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FiImage size={64} className="mx-auto mb-2" />
            <p>No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Main Image */}
      <div className="relative h-96 bg-gray-200 group">
        <img
          src={validImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback for broken images */}
        <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
          <div className="text-center">
            <FiImage size={64} className="mx-auto mb-2" />
            <p>Image not available</p>
          </div>
        </div>

        {/* Navigation Arrows (only show if more than 1 image) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation (only show if more than 1 image) */}
      {validImages.length > 1 && (
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback for broken thumbnail */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200" style={{ display: 'none' }}>
                  <FiImage size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 