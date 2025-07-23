'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  FiMapPin, FiHome, FiPhone, FiArrowLeft, FiSquare, FiDroplet, 
  FiBriefcase, FiCalendar, FiLayers, FiUsers 
} from 'react-icons/fi';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';
import ImageGallery from '@/components/ImageGallery';

export default function PropertyDetails() {
  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null); // 'residential', 'commercial', or 'legacy'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      let response = null;
      let foundPropertyType = null;

      // Try fetching from residential properties first
      try {
        response = await axios.get(API_URLS.RESIDENTIAL_PROPERTY_BY_ID(params.id), API_DEFAULT_CONFIG);
        if (response.data.success) {
          setProperty({ ...response.data.data, propertyCategory: 'residential' });
          foundPropertyType = 'residential';
        }
      } catch (resError) {
        // Try fetching from commercial properties
        try {
          response = await axios.get(API_URLS.COMMERCIAL_PROPERTY_BY_ID(params.id), API_DEFAULT_CONFIG);
          if (response.data.success) {
            setProperty({ ...response.data.data, propertyCategory: 'commercial' });
            foundPropertyType = 'commercial';
          }
        } catch (comError) {
          // Fallback to legacy property API
          try {
            response = await axios.get(API_URLS.PROPERTY_BY_ID(params.id));
            setProperty({ ...response.data, propertyCategory: 'legacy' });
            foundPropertyType = 'legacy';
          } catch (legacyError) {
            throw new Error('Property not found in any collection');
          }
        }
      }
      
      setPropertyType(foundPropertyType);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Property not found');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not specified';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get property data based on type
  const getPropertyData = () => {
    if (!property) return {};
    
    if (property.propertyCategory === 'residential') {
      return {
        title: property.name || 'Residential Property',
        price: property.cost,
        description: property.descriptions,
        location: `${property.locality}, ${property.location}, ${property.city}`,
        propertyType: property.property_type,
        category: 'Residential',
        lookingFor: property.looking_for,
        area: property.build_up_area,
        areaUnit: property.area_unit,
        bhk: property.bhk_rk,
        rent: property.rent,
        furnishings: property.flat_furnishings || [],
        amenities: property.society_amenities || [],
        availableFrom: property.available_from,
        commission: property.commission,
        putOnTop: property.put_on_top
      };
    } else if (property.propertyCategory === 'commercial') {
      return {
        title: property.your_name || 'Commercial Property',
        price: property.cost,
        description: property.description,
        location: `${property.locality}, ${property.location}, ${property.city}`,
        propertyType: property.property_type,
        category: 'Commercial',
        lookingFor: property.looking_to,
        area: property.build_up_area,
        areaUnit: property.build_up_area_unit,
        carpetArea: property.carpet_area,
        carpetAreaUnit: property.carpet_area_unit,
        floor: property.your_floor,
        totalFloors: property.total_floor,
        ownership: property.ownership,
        monthlyRent: property.monthly_rent,
        possessionStatus: property.possession_status,
        locationHub: property.location_hub,
        amenities: property.amenities || [],
        availableFrom: property.available_from,
        commission: property.commission,
        putOnTop: property.put_on_top
      };
    }
    
    // Legacy property structure
    return {
      title: property.title || 'Property',
      price: property.price,
      description: property.description,
      location: property.address || property.city,
      propertyType: property.propertyType,
      category: 'Property',
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms
    };
  };

  const propertyData = getPropertyData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-2"
          >
            <FiArrowLeft className="mr-2" />
            Back to Properties
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{propertyData.title}</h1>
              <div className="flex items-center text-gray-600 mt-2">
                <FiMapPin className="mr-1" />
                <span>{propertyData.location}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex space-x-2">
                {propertyData.category && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {propertyData.category}
                  </span>
                )}
                {propertyData.lookingFor && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium uppercase">
                    {propertyData.lookingFor}
                  </span>
                )}
                {propertyData.putOnTop && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <ImageGallery 
                images={property.images} 
                title={property.title}
              />
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
              
              {/* Residential Property Details */}
              {property.propertyCategory === 'residential' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FiHome className="text-2xl mb-2 mx-auto text-gray-600" />
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold capitalize">{propertyData.propertyType}</p>
                  </div>
                  
                  {propertyData.bhk && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiSquare className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Configuration</p>
                      <p className="font-semibold">{propertyData.bhk}</p>
                    </div>
                  )}
                  
                  {propertyData.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiLayers className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Built-up Area</p>
                      <p className="font-semibold">{propertyData.area} {propertyData.areaUnit}</p>
                    </div>
                  )}
                  
                  {propertyData.rent && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiCalendar className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Monthly Rent</p>
                      <p className="font-semibold">₹{new Intl.NumberFormat('en-IN').format(propertyData.rent)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Commercial Property Details */}
              {property.propertyCategory === 'commercial' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FiBriefcase className="text-2xl mb-2 mx-auto text-gray-600" />
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold capitalize">{propertyData.propertyType}</p>
                  </div>
                  
                  {propertyData.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiLayers className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Built-up Area</p>
                      <p className="font-semibold">{propertyData.area} {propertyData.areaUnit}</p>
                    </div>
                  )}
                  
                  {propertyData.floor && propertyData.totalFloors && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiSquare className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Floor</p>
                      <p className="font-semibold">{propertyData.floor} / {propertyData.totalFloors}</p>
                    </div>
                  )}
                  
                  {propertyData.ownership && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiUsers className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Ownership</p>
                      <p className="font-semibold capitalize">{propertyData.ownership.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Legacy Property Details */}
              {property.propertyCategory === 'legacy' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold capitalize">{propertyData.propertyType}</p>
                  </div>
                  
                  {propertyData.bedrooms > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiSquare className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Bedrooms</p>
                      <p className="font-semibold">{propertyData.bedrooms}</p>
                    </div>
                  )}
                  
                  {propertyData.bathrooms > 0 && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <FiDroplet className="text-2xl mb-2 mx-auto text-gray-600" />
                      <p className="text-sm text-gray-600">Bathrooms</p>
                      <p className="font-semibold">{propertyData.bathrooms}</p>
                    </div>
                  )}
                  
                  {propertyData.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Area</p>
                      <p className="font-semibold">{propertyData.area} sq ft</p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              <div className="space-y-6">
                {propertyData.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{propertyData.description}</p>
                  </div>
                )}

                {/* Residential Specific Information */}
                {property.propertyCategory === 'residential' && (
                  <>
                    {propertyData.furnishings?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Furnishings</h3>
                        <div className="flex flex-wrap gap-2">
                          {propertyData.furnishings.map((item, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {item.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {propertyData.amenities?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Society Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {propertyData.amenities.map((item, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              {item.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Commercial Specific Information */}
                {property.propertyCategory === 'commercial' && (
                  <>
                    {propertyData.carpetArea && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Carpet Area</p>
                            <p className="font-semibold">{propertyData.carpetArea} {propertyData.carpetAreaUnit}</p>
                          </div>
                          {propertyData.possessionStatus && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-600">Possession</p>
                              <p className="font-semibold capitalize">{propertyData.possessionStatus.replace('_', ' ')}</p>
                            </div>
                          )}
                          {propertyData.locationHub && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-600">Location Hub</p>
                              <p className="font-semibold">{propertyData.locationHub}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {propertyData.amenities?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {propertyData.amenities.map((item, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {item.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Common Additional Info */}
                {(propertyData.availableFrom || propertyData.commission) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {propertyData.availableFrom && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Available From</p>
                          <p className="font-semibold">{new Date(propertyData.availableFrom).toLocaleDateString()}</p>
                        </div>
                      )}
                      {propertyData.commission > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Commission</p>
                          <p className="font-semibold">₹{new Intl.NumberFormat('en-IN').format(propertyData.commission)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-blue-600">{formatPrice(propertyData.price)}</p>
                {(propertyData.rent || propertyData.monthlyRent) && (
                  <p className="text-sm text-gray-600 mt-1">
                    + ₹{new Intl.NumberFormat('en-IN').format(propertyData.rent || propertyData.monthlyRent)}/month rent
                  </p>
                )}
              </div>

              {/* Property Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold">{propertyData.category}</span>
                </div>
                {propertyData.lookingFor && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Listed for</span>
                    <span className="font-semibold capitalize">{propertyData.lookingFor}</span>
                  </div>
                )}
                {propertyData.area && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Area</span>
                    <span className="font-semibold">{propertyData.area} {propertyData.areaUnit}</span>
                  </div>
                )}
                {property.propertyCategory === 'residential' && propertyData.bhk && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Configuration</span>
                    <span className="font-semibold">{propertyData.bhk}</span>
                  </div>
                )}
                {property.propertyCategory === 'commercial' && propertyData.ownership && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Ownership</span>
                    <span className="font-semibold capitalize">{propertyData.ownership.replace('_', ' ')}</span>
                  </div>
                )}
              </div>

              {/* Owner Contact */}
              {property.user && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Owner</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiHome className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{property.user.name}</p>
                      <p className="text-sm text-gray-600">Property Owner</p>
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${property.user.phoneNumber}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiPhone />
                    Call Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 