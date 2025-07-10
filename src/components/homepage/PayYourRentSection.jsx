import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export default function PayYourRentSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                💳 Easy Payments
              </Badge>
              <h2 className="text-5xl font-bold text-foreground">
                Pay Your Rent,
                <span className="block text-orange-600">Effortlessly!</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Streamline your rental payments with our secure and convenient payment system. 
                Never miss a payment again with automated reminders and multiple payment options.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                'Secure Online Payments',
                'Automatic Payment Reminders',
                'Digital Payment History'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop",
              "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
              "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop"
            ].map((src, index) => (
              <Card key={index} className={`overflow-hidden border-0 shadow-lg ${index % 2 === 1 ? 'mt-8' : ''}`}>
                <img src={src} alt={`Interior ${index + 1}`} className="w-full h-48 object-cover" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 