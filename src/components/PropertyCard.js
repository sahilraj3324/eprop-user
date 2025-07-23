import Link from 'next/link';
import { FiMapPin, FiHome, FiSquare, FiDroplet, FiBriefcase, FiCalendar } from 'react-icons/fi';

export default function PropertyCard({ property }) {
  const formatPrice = (price) => {
    if (!price) return 'Price not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isResidential = property.propertyCategory === 'residential';
  const isCommercial = property.propertyCategory === 'commercial';

  // Get property data based on type
  const getPropertyData = () => {
    if (isResidential) {
      return {
        title: property.name || 'Residential Property',
        price: property.cost,
        location: `${property.locality}, ${property.location}, ${property.city}`,
        propertyType: property.property_type,
        category: 'Residential',
        categoryIcon: '🏠',
        lookingFor: property.looking_for,
        area: property.build_up_area,
        areaUnit: property.area_unit,
        bhk: property.bhk_rk,
        rent: property.rent,
        description: property.descriptions
      };
    } else if (isCommercial) {
      return {
        title: property.your_name || 'Commercial Property',
        price: property.cost,
        location: `${property.locality}, ${property.location}, ${property.city}`,
        propertyType: property.property_type,
        category: 'Commercial',
        categoryIcon: '🏢',
        lookingFor: property.looking_to,
        area: property.build_up_area,
        areaUnit: property.build_up_area_unit,
        carpetArea: property.carpet_area,
        floor: property.your_floor,
        totalFloors: property.total_floor,
        ownership: property.ownership,
        monthlyRent: property.monthly_rent,
        description: property.description
      };
    }
    
    // Fallback for old property structure
    return {
      title: property.title || 'Property',
      price: property.price,
      location: property.address || `${property.city}`,
      propertyType: property.propertyType,
      category: 'Property',
      categoryIcon: '🏠',
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms
    };
  };

  const propertyData = getPropertyData();

  const getPropertyTypeIcon = (type, category) => {
    if (category === 'Commercial') {
      return '🏢';
    }
    
    switch (type?.toLowerCase()) {
      case 'apartment':
        return '🏢';
      case 'house':
      case 'independent_house':
        return '🏠';
      case 'villa':
        return '🏡';
      case 'plot':
        return '📍';
      case 'penthouse':
        return '🏗️';
      case 'studio_apartment':
        return '🏠';
      default:
        return category === 'Commercial' ? '🏢' : '🏠';
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
              alt={propertyData.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiHome size={48} />
            </div>
          )}
          
          {/* Property Category Badge */}
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
            {getPropertyTypeIcon(propertyData.propertyType, propertyData.category)} {propertyData.category}
          </div>
          
          {/* Looking For Badge */}
          {propertyData.lookingFor && (
            <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium uppercase">
              {propertyData.lookingFor}
            </div>
          )}
          
          {/* Put on Top Badge */}
          {property.put_on_top && (
            <div className="absolute top-12 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {propertyData.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <FiMapPin className="mr-1" size={16} />
            <span className="text-sm line-clamp-1">{propertyData.location}</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(propertyData.price)}
            </span>
            {(propertyData.rent || propertyData.monthlyRent) && (
              <span className="text-sm text-gray-500 ml-2">
                + ₹{new Intl.NumberFormat('en-IN').format(propertyData.rent || propertyData.monthlyRent)}/month
              </span>
            )}
          </div>

          {/* Property Features */}
          <div className="space-y-2 text-sm text-gray-600">
            {/* Residential Features */}
            {isResidential && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {propertyData.bhk && (
                    <div className="flex items-center">
                      <FiHome className="mr-1" size={14} />
                      <span>{propertyData.bhk}</span>
                    </div>
                  )}
                  {propertyData.area && (
                    <div className="flex items-center">
                      <FiSquare className="mr-1" size={14} />
                      <span>{propertyData.area} {propertyData.areaUnit}</span>
                    </div>
                  )}
                </div>
                <span className="font-medium text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {propertyData.propertyType}
                </span>
              </div>
            )}

            {/* Commercial Features */}
            {isCommercial && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {propertyData.area && (
                      <div className="flex items-center">
                        <FiSquare className="mr-1" size={14} />
                        <span>{propertyData.area} {propertyData.areaUnit}</span>
                      </div>
                    )}
                    {propertyData.floor && propertyData.totalFloors && (
                      <div className="flex items-center">
                        <FiBriefcase className="mr-1" size={14} />
                        <span>Floor {propertyData.floor}/{propertyData.totalFloors}</span>
                      </div>
                    )}
                  </div>
                </div>
                {propertyData.ownership && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      {propertyData.ownership.replace('_', ' ')}
                    </span>
                    <span className="font-medium text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {propertyData.propertyType}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Old property structure fallback */}
            {!isResidential && !isCommercial && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {propertyData.bedrooms > 0 && (
                    <div className="flex items-center">
                      <FiSquare className="mr-1" size={14} />
                      <span>{propertyData.bedrooms} Bed</span>
                    </div>
                  )}
                  {propertyData.bathrooms > 0 && (
                    <div className="flex items-center">
                      <FiDroplet className="mr-1" size={14} />
                      <span>{propertyData.bathrooms} Bath</span>
                    </div>
                  )}
                </div>
                {propertyData.area && (
                  <span className="font-medium">{propertyData.area} sq ft</span>
                )}
              </div>
            )}
          </div>

          {/* Available From */}
          {property.available_from && (
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <FiCalendar className="mr-1" size={12} />
              <span>Available from {new Date(property.available_from).toLocaleDateString()}</span>
            </div>
          )}

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