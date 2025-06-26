export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find Your Dream Property
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Discover the perfect home, apartment, or commercial space
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">10,000+</h3>
            <p>Properties Listed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">5,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-2">50+</h3>
            <p>Cities Covered</p>
          </div>
        </div>
      </div>
    </div>
  );
} 