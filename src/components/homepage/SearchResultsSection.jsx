import PropertyCard from '@/components/PropertyCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function SearchResultsSection({ searchTerm, filteredProperties }) {
  if (!searchTerm) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Results for &quot;{searchTerm}&quot; ({filteredProperties.length} found)
            </CardTitle>
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
} 