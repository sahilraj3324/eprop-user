import PropertyCard from '@/components/PropertyCard';
import { Badge } from '@/components/ui/badge';

export default function NewlyAddedPropertiesSection({ properties }) {
  const newProperties = properties.slice(-4); // Last 4 properties as "newly listed"

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            ✨ Latest Listings
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6">Explore Newly Added Properties</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our latest property listings with modern amenities and prime locations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
} 