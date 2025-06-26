import Link from 'next/link';
import { FiMapPin, FiTag, FiStar, FiUser } from 'react-icons/fi';

export default function ItemCard({ item }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'electronics':
        return '📱';
      case 'furniture':
        return '🪑';
      case 'clothing':
        return '👕';
      case 'books':
        return '📚';
      case 'vehicles':
        return '🚗';
      case 'appliances':
        return '🏠';
      case 'sports':
        return '⚽';
      case 'toys':
        return '🧸';
      default:
        return '📦';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/items/${item._id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        {/* Item Image */}
        <div className="relative h-48 bg-gray-200">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiTag size={48} />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
            {getCategoryIcon(item.category)} {item.category}
          </div>
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {formatPrice(item.price)}
          </div>
          {!item.isAvailable && (
            <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sold
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <FiMapPin className="mr-1" size={16} />
            <span className="text-sm">{item.location}</span>
          </div>

          {item.city && (
            <p className="text-sm text-gray-500 mb-3">
              {item.city}{item.state && `, ${item.state}`}
            </p>
          )}

          {/* Item Features */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
              {item.brand && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                  {item.brand}
                </span>
              )}
            </div>
            {item.isAvailable && (
              <span className="text-green-600 text-xs font-medium">Available</span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Owner Info */}
          {item.user && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Listed by: <span className="font-medium">{item.user.name}</span>
                </p>
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 