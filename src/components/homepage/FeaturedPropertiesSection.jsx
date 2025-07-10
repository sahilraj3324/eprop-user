import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';

export default function FeaturedPropertiesSection({ properties }) {
  const featuredProperties = properties.slice(2, 6); // Featured properties

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Badge variant="outline" className="mb-4">
              ⭐ Premium Collection
            </Badge>
            <h2 className="text-5xl font-bold text-foreground mb-6">Premium Properties For Modern Living</h2>
            <p className="text-xl text-muted-foreground">
              Experience luxury and comfort in our carefully curated premium properties with world-class amenities.
            </p>
          </div>
          <div className="text-right">
            <Button size="lg" variant="outline">
              View All Properties
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProperties.map((property) => (
            <Card key={property._id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
              <div className="relative">
                <img 
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop"} 
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{property.title}</CardTitle>
                <CardDescription className="mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">${property.price}/month</div>
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 