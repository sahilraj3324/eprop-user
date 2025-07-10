import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Home as HomeIcon, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
      <div className="relative container mx-auto px-4 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                🏡 #1 Property Portal
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Find Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dream Home
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Discover the perfect property that matches your lifestyle and budget. 
                Thousands of verified listings await you.
              </p>
            </div>
            
            {/* Search Card */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5" />
                  Find Your Perfect Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    <Input placeholder="Enter city, area..." className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <HomeIcon className="h-4 w-4" />
                      Property Type
                    </label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget</label>
                    <Select>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Any Budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Budget</SelectItem>
                        <SelectItem value="under-1000">Under $1000</SelectItem>
                        <SelectItem value="1000-2000">$1000 - $2000</SelectItem>
                        <SelectItem value="2000-5000">$2000 - $5000</SelectItem>
                        <SelectItem value="above-5000">Above $5000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="lg" className="w-full h-12 text-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Search Properties
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <Card className="overflow-hidden border-0 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop" 
                  alt="Modern Dream House"
                  className="w-full h-[600px] object-cover"
                />
              </Card>
              <Card className="absolute -bottom-6 -left-6 bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Verified Properties</CardTitle>
                      <CardDescription>100% Authentic Listings</CardDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 