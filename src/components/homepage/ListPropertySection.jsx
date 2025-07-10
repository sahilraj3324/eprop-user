import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export default function ListPropertySection() {
  const features = [
    'Free property valuation',
    'Professional photography',
    'Marketing across multiple platforms',
    'Tenant screening services'
  ];

  const propertyImages = [
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=300&h=250&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=250&fit=crop"
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                🏠 For Property Owners
              </Badge>
              <h2 className="text-5xl font-bold">List Your Property Today!</h2>
              <p className="text-xl opacity-90">
                Join thousands of property owners who trust us to find the perfect tenants. 
                List your property and start earning rental income today.
              </p>
            </div>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              List Your Property
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {propertyImages.map((src, index) => (
              <Card key={index} className={`overflow-hidden border-0 shadow-xl ${index === 1 ? 'mt-8' : ''}`}>
                <img src={src} alt={`Property ${index + 1}`} className="w-full h-48 object-cover" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 