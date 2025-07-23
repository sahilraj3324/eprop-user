'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiHome, FiInfo, FiDollarSign, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';
import ImageUpload from '@/components/ImageUpload';

export default function CreateProperty() {
  const [user, setUser] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [propertyCategory, setPropertyCategory] = useState('residential');
  
  // Common fields
  const [commonFormData, setCommonFormData] = useState({
    looking_for: 'rent',
    city: '',
    location: '',
    locality: '',
    cost: '',
    available_from: '',
    commission: '',
    put_on_top: false,
    images: [],
  });

  // Residential specific fields
  const [residentialFormData, setResidentialFormData] = useState({
    name: '',
    property_type: '',
    bhk_rk: '',
    build_up_area: '',
    area_unit: 'sqft',
    flat_furnishings: [],
    society_amenities: [],
    rent: '',
    descriptions: '',
  });

  // Commercial specific fields
  const [commercialFormData, setCommercialFormData] = useState({
    property_type: '',
    your_name: '',
    possession_status: 'ready_to_move',
    location_hub: '',
    build_up_area: '',
    build_up_area_unit: 'sqft',
    carpet_area: '',
    carpet_area_unit: 'sqft',
    ownership: 'freehold',
    total_floor: '',
    your_floor: '',
    monthly_rent: '',
    description: '',
    amenities: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Predefined options for furnishings and amenities
  const residentialFurnishings = [
    'Sofa', 'Bed', 'Wardrobe', 'Dining Table', 'TV', 'Refrigerator', 
    'Washing Machine', 'Air Conditioner', 'Microwave', 'Water Heater',
    'Curtains', 'Ceiling Fan', 'Study Table', 'Shoe Rack'
  ];

  const residentialAmenities = [
    'Swimming Pool', 'Gym', 'Garden', 'Security', 'Lift', 'Parking',
    'Power Backup', 'Water Supply', 'Clubhouse', 'Children Play Area',
    'CCTV', 'Intercom', 'Maintenance Staff', 'Jogging Track'
  ];

  const commercialAmenities = [
    'Parking', 'Security', 'Lift', 'Power Backup', 'Reception',
    'Conference Room', 'Pantry', 'CCTV', 'Fire Safety', 'AC',
    'High Speed Internet', 'Cafeteria', 'ATM', 'Medical Room'
  ];

  const stages = [
    { number: 1, title: 'Property Type', icon: FiHome, description: 'Choose category and purpose' },
    { number: 2, title: 'Property Details', icon: FiInfo, description: 'Add specifications and features' },
    { number: 3, title: 'Pricing & Submit', icon: FiDollarSign, description: 'Set pricing and list property' }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      router.push('/auth/login');
    }
  };

  const handleCommonChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommonFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleResidentialChange = (e) => {
    const { name, value } = e.target;
    setResidentialFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCommercialChange = (e) => {
    const { name, value } = e.target;
    setCommercialFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (fieldName, value, isResidential = true) => {
    const targetFormData = isResidential ? residentialFormData : commercialFormData;
    const setTargetFormData = isResidential ? setResidentialFormData : setCommercialFormData;
    
    const currentArray = targetFormData[fieldName] || [];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setTargetFormData(prev => ({
      ...prev,
      [fieldName]: updatedArray,
    }));
  };

  const handleImagesChange = (newImages) => {
    setCommonFormData(prev => ({
      ...prev,
      images: newImages,
    }));
  };

  const validateStage = (stage) => {
    switch (stage) {
      case 1:
        return propertyCategory && commonFormData.looking_for;
      case 2:
        if (propertyCategory === 'residential') {
          return (
            commonFormData.city &&
            commonFormData.location &&
            commonFormData.locality &&
            residentialFormData.name &&
            residentialFormData.property_type &&
            residentialFormData.bhk_rk &&
            residentialFormData.build_up_area
          );
        } else {
          return (
            commonFormData.city &&
            commonFormData.location &&
            commonFormData.locality &&
            commercialFormData.your_name &&
            commercialFormData.property_type &&
            commercialFormData.build_up_area
          );
        }
      case 3:
        return commonFormData.cost;
      default:
        return false;
    }
  };

  const nextStage = () => {
    if (validateStage(currentStage) && currentStage < 3) {
      setCurrentStage(currentStage + 1);
      setError('');
    } else {
      setError('Please fill all required fields before proceeding');
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStage(3)) {
      setError('Please fill all required fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let propertyData = {
        ...commonFormData,
        user: user._id,
        cost: parseFloat(commonFormData.cost),
        commission: parseFloat(commonFormData.commission) || 0,
        available_from: commonFormData.available_from || new Date().toISOString().split('T')[0],
      };

      if (propertyCategory === 'residential') {
        propertyData = {
          ...propertyData,
          ...residentialFormData,
          build_up_area: parseFloat(residentialFormData.build_up_area),
          rent: parseFloat(residentialFormData.rent) || 0,
        };
        
        const response = await axios.post(API_URLS.RESIDENTIAL_PROPERTIES, propertyData, API_DEFAULT_CONFIG);
        if (response.data.success) {
          router.push(`/properties/${response.data.data._id}`);
        }
      } else {
        // Commercial property
        propertyData = {
          ...propertyData,
          looking_to: propertyData.looking_for, // Map field name
          ...commercialFormData,
          build_up_area: parseFloat(commercialFormData.build_up_area),
          carpet_area: parseFloat(commercialFormData.carpet_area) || 0,
          total_floor: parseInt(commercialFormData.total_floor) || 0,
          your_floor: parseInt(commercialFormData.your_floor) || 0,
          monthly_rent: parseFloat(commercialFormData.monthly_rent) || 0,
        };
        
        delete propertyData.looking_for; // Remove the mapped field
        
        const response = await axios.post(API_URLS.COMMERCIAL_PROPERTIES, propertyData, API_DEFAULT_CONFIG);
        if (response.data.success) {
          router.push(`/properties/${response.data.data._id}`);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const renderStage1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's start with the basics</h2>
        <p className="text-gray-600">Tell us what type of property you want to list</p>
      </div>

      {/* Property Category Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Category *</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
            propertyCategory === 'residential' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <input
              type="radio"
              name="propertyCategory"
              value="residential"
              checked={propertyCategory === 'residential'}
              onChange={(e) => setPropertyCategory(e.target.value)}
              className="sr-only"
            />
            <div className="text-center">
              <div className="text-4xl mb-3">🏠</div>
              <div className="font-semibold text-lg mb-2">Residential Property</div>
              <div className="text-sm text-gray-600">Apartments, Houses, Villas, Independent Floors</div>
            </div>
          </label>

          <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${
            propertyCategory === 'commercial' 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <input
              type="radio"
              name="propertyCategory"
              value="commercial"
              checked={propertyCategory === 'commercial'}
              onChange={(e) => setPropertyCategory(e.target.value)}
              className="sr-only"
            />
            <div className="text-center">
              <div className="text-4xl mb-3">🏢</div>
              <div className="font-semibold text-lg mb-2">Commercial Property</div>
              <div className="text-sm text-gray-600">Offices, Shops, Warehouses, Showrooms</div>
            </div>
          </label>
        </div>
      </div>

      {/* Looking For Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What are you looking to do? *</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['rent', 'sale', 'lease'].map((option) => (
            <label key={option} className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              commonFormData.looking_for === option 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="looking_for"
                value={option}
                checked={commonFormData.looking_for === option}
                onChange={handleCommonChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {option === 'rent' && '🏡'}
                  {option === 'sale' && '💰'}
                </div>
                <div className="font-medium capitalize">{option}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStage2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
        <p className="text-gray-600">Add detailed information about your property</p>
      </div>

      {/* Basic Location Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              required
              value={commonFormData.city}
              onChange={handleCommonChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Area *
            </label>
            <input
              type="text"
              name="location"
              required
              value={commonFormData.location}
              onChange={handleCommonChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Andheri, CP, Koramangala"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locality *
            </label>
            <input
              type="text"
              name="locality"
              required
              value={commonFormData.locality}
              onChange={handleCommonChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Specific locality/street"
            />
          </div>
        </div>
      </div>

      {/* Property Specific Details */}
      {propertyCategory === 'residential' ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Residential Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={residentialFormData.name}
                onChange={handleResidentialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Luxury 3BHK Apartment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="property_type"
                required
                value={residentialFormData.property_type}
                onChange={handleResidentialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="independent_house">Independent House</option>
                <option value="builder_floor">Builder Floor</option>
                <option value="penthouse">Penthouse</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BHK/RK *
              </label>
              <select
                name="bhk_rk"
                required
                value={residentialFormData.bhk_rk}
                onChange={handleResidentialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="1RK">1 RK</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
                <option value="5+BHK">5+ BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area *
              </label>
              <input
                type="number"
                name="build_up_area"
                required
                value={residentialFormData.build_up_area}
                onChange={handleResidentialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Unit
              </label>
              <select
                name="area_unit"
                value={residentialFormData.area_unit}
                onChange={handleResidentialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sqft">Sq Ft</option>
                <option value="sqm">Sq M</option>
                <option value="sqyd">Sq Yd</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From
              </label>
              <input
                type="date"
                name="available_from"
                value={commonFormData.available_from}
                onChange={handleCommonChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Furnishings */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Furnishings</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {residentialFurnishings.map((furnishing) => (
                <label key={furnishing} className={`cursor-pointer border rounded-lg p-3 text-sm transition-all ${
                  residentialFormData.flat_furnishings.includes(furnishing)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={residentialFormData.flat_furnishings.includes(furnishing)}
                    onChange={() => handleArrayChange('flat_furnishings', furnishing, true)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    {residentialFormData.flat_furnishings.includes(furnishing) && (
                      <FiCheck className="mx-auto mb-1" size={16} />
                    )}
                    {furnishing}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Society Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {residentialAmenities.map((amenity) => (
                <label key={amenity} className={`cursor-pointer border rounded-lg p-3 text-sm transition-all ${
                  residentialFormData.society_amenities.includes(amenity)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={residentialFormData.society_amenities.includes(amenity)}
                    onChange={() => handleArrayChange('society_amenities', amenity, true)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    {residentialFormData.society_amenities.includes(amenity) && (
                      <FiCheck className="mx-auto mb-1" size={16} />
                    )}
                    {amenity}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="descriptions"
              value={residentialFormData.descriptions}
              onChange={handleResidentialChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your property in detail..."
            />
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercial Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                name="your_name"
                required
                value={commercialFormData.your_name}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Premium Office Complex"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="property_type"
                required
                value={commercialFormData.property_type}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="office_space">Office Space</option>
                <option value="retail_shop">Retail Shop</option>
                <option value="warehouse">Warehouse</option>
                <option value="showroom">Showroom</option>
                <option value="restaurant">Restaurant Space</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Possession Status *
              </label>
              <select
                name="possession_status"
                value={commercialFormData.possession_status}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ready_to_move">Ready to Move</option>
                <option value="under_construction">Under Construction</option>
                <option value="new_launch">New Launch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ownership *
              </label>
              <select
                name="ownership"
                value={commercialFormData.ownership}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="freehold">Freehold</option>
                <option value="leasehold">Leasehold</option>
                <option value="co_operative_society">Co-operative Society</option>
                <option value="power_of_attorney">Power of Attorney</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Hub
              </label>
              <input
                type="text"
                name="location_hub"
                value={commercialFormData.location_hub}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Financial District, IT Park"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area *
              </label>
              <input
                type="number"
                name="build_up_area"
                required
                value={commercialFormData.build_up_area}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carpet Area
              </label>
              <input
                type="number"
                name="carpet_area"
                value={commercialFormData.carpet_area}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Carpet area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Floors
              </label>
              <input
                type="number"
                name="total_floor"
                value={commercialFormData.total_floor}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Total floors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Floor
              </label>
              <input
                type="number"
                name="your_floor"
                value={commercialFormData.your_floor}
                onChange={handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Property floor"
              />
            </div>
          </div>

          {/* Commercial Amenities */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commercialAmenities.map((amenity) => (
                <label key={amenity} className={`cursor-pointer border rounded-lg p-3 text-sm transition-all ${
                  commercialFormData.amenities.includes(amenity)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={commercialFormData.amenities.includes(amenity)}
                    onChange={() => handleArrayChange('amenities', amenity, false)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    {commercialFormData.amenities.includes(amenity) && (
                      <FiCheck className="mx-auto mb-1" size={16} />
                    )}
                    {amenity}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={commercialFormData.description}
              onChange={handleCommercialChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your commercial property in detail..."
            />
          </div>
        </div>
      )}

      {/* Images */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>
        <ImageUpload
          images={commonFormData.images}
          onChange={handleImagesChange}
          folder="properties"
          maxImages={10}
          disabled={loading}
        />
      </div>
    </div>
  );

  const renderStage3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing & Final Details</h2>
        <p className="text-gray-600">Set your pricing and complete the listing</p>
      </div>

      {/* Pricing based on listing type */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pricing for {commonFormData.looking_for === 'rent' ? 'Rent' : commonFormData.looking_for === 'sale' ? 'Sale' : 'Lease'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Rent/Cost */}
          {commonFormData.looking_for === 'rent' || commonFormData.looking_for === 'lease' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly {commonFormData.looking_for === 'rent' ? 'Rent' : 'Lease Amount'} (₹) *
              </label>
              <input
                type="number"
                name={propertyCategory === 'residential' ? 'rent' : 'monthly_rent'}
                required
                value={propertyCategory === 'residential' ? residentialFormData.rent : commercialFormData.monthly_rent}
                onChange={propertyCategory === 'residential' ? handleResidentialChange : handleCommercialChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter monthly amount"
              />
            </div>
          ) : null}

          {/* Total Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {commonFormData.looking_for === 'sale' ? 'Sale Price (₹) *' : 'Security Deposit/Total Cost (₹) *'}
            </label>
            <input
              type="number"
              name="cost"
              required
              value={commonFormData.cost}
              onChange={handleCommonChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={commonFormData.looking_for === 'sale' ? 'Enter sale price' : 'Enter security deposit'}
            />
          </div>
        </div>
      </div>

      {/* Commission - Only for agents */}
      {user?.user_type === 'agent' && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Commission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Amount (₹)
              </label>
              <input
                type="number"
                name="commission"
                value={commonFormData.commission}
                onChange={handleCommonChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your commission"
              />
            </div>
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">
                  As a registered agent, you can set your commission for this property listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Options */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Options</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="put_on_top"
            checked={commonFormData.put_on_top}
            onChange={handleCommonChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-3 block text-sm text-gray-900">
            <span className="font-medium">Put on top of listings</span>
            <span className="block text-gray-600">Your property will appear at the top of search results</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Property Type:</span>
            <span className="font-medium capitalize">{propertyCategory} - {commonFormData.looking_for}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{commonFormData.locality}, {commonFormData.city}</span>
          </div>
          {propertyCategory === 'residential' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Configuration:</span>
              <span className="font-medium">{residentialFormData.bhk_rk} - {residentialFormData.build_up_area} {residentialFormData.area_unit}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Images:</span>
            <span className="font-medium">{commonFormData.images.length} photos uploaded</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {stages.map((stage) => {
              const IconComponent = stage.icon;
              const isActive = currentStage === stage.number;
              const isCompleted = currentStage > stage.number;
              
              return (
                <div key={stage.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <FiCheck size={20} />
                    ) : (
                      <IconComponent size={20} />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {stage.title}
                    </div>
                    <div className="text-xs text-gray-500">{stage.description}</div>
                  </div>
                  {stage.number < 3 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStage > stage.number ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStage / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">List Your Property</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Render Current Stage */}
            {currentStage === 1 && renderStage1()}
            {currentStage === 2 && renderStage2()}
            {currentStage === 3 && renderStage3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
              <div>
                {currentStage > 1 && (
                  <button
                    type="button"
                    onClick={prevStage}
                    className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FiArrowLeft className="mr-2" size={16} />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                {currentStage < 3 ? (
                  <button
                    type="button"
                    onClick={nextStage}
                    disabled={!validateStage(currentStage)}
                    className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FiArrowRight className="ml-2" size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !validateStage(3)}
                    className="flex items-center px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Creating Property...' : 'List Property'}
                    {!loading && <FiCheck className="ml-2" size={16} />}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 