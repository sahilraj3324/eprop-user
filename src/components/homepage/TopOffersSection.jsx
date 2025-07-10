import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export default function TopOffersSection({ properties }) {
  const topOffers = properties.slice(0, 8); // First 8 as "top offers"

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="destructive" className="mb-4">
            🔥 Hot Deals
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6">TOP OFFERS</h2>
          <p className="text-xl text-muted-foreground">Don&apos;t miss out on these amazing deals and limited-time offers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topOffers.map((property) => (
            <Card key={property._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
              <div className="relative">
                <img 
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop"} 
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge variant="destructive" className="absolute top-3 right-3">
                  HOT DEAL
                </Badge>
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 truncate">{property.title}</CardTitle>
                <CardDescription className="mb-3 truncate flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {property.address}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${property.price}</span>
                  <Button size="sm" variant="outline">
                    View
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