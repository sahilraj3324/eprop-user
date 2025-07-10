import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download } from 'lucide-react';

export default function MobileAppSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                📱 Mobile First
              </Badge>
              <h2 className="text-5xl font-bold">Download Our App Today!</h2>
              <p className="text-xl opacity-90">
                Take property hunting on the go. Access thousands of listings, 
                virtual tours, and instant notifications right from your mobile device.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="secondary" size="lg" className="bg-black hover:bg-gray-800 text-white">
                <Smartphone className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </Button>
              <Button variant="secondary" size="lg" className="bg-black hover:bg-gray-800 text-white">
                <Download className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 inline-block p-8">
              <div className="w-48 h-96 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                <Smartphone className="h-24 w-24 text-purple-600" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 