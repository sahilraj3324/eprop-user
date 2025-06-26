import Link from 'next/link';
import { FiMapPin, FiHome, FiSquare, FiDroplet } from 'react-icons/fi';

export default function PropertyCard({ property }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'apartment':
        return '🏢';
      case 'house':
        return '🏠';
      case 'villa':
        return '🏡';
      case 'plot':
        return '📍';
      case 'commercial':
        return '🏢';
      default:
        return '🏠';
    }
  };

  return (
    <Link href={`/properties/${property._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Property Image */}
        <div className="relative h-48 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiHome size={48} />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
            {getPropertyTypeIcon(property.propertyType)} {property.propertyType}
          </div>
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <FiMapPin className="mr-1" size={16} />
            <span className="text-sm">{property.address}</span>
          </div>

          {property.city && (
            <p className="text-sm text-gray-500 mb-3">
              {property.city}{property.state && `, ${property.state}`}
            </p>
          )}

          {/* Property Features */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <FiSquare className="mr-1" size={16} />
                  <span>{property.bedrooms} Bed</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center">
                  <FiDroplet className="mr-1" size={16} />
                  <span>{property.bathrooms} Bath</span>
                </div>
              )}
            </div>
            {property.area && (
              <span className="font-medium">{property.area} sq ft</span>
            )}
          </div>

          {/* Owner Info */}
          {property.user && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Listed by: <span className="font-medium">{property.user.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 