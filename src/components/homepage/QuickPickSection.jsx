import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function QuickPickSection() {
  const categories = [
    { icon: '🏠', label: 'Houses', count: '2,300+', gradient: 'from-blue-500 to-cyan-500' },
    { icon: '🏢', label: 'Apartments', count: '1,800+', gradient: 'from-purple-500 to-pink-500' },
    { icon: '🏘️', label: 'Villas', count: '950+', gradient: 'from-green-500 to-emerald-500' },
    { icon: '🏪', label: 'Commercial', count: '620+', gradient: 'from-orange-500 to-red-500' },
    { icon: '🏡', label: 'Condos', count: '1,200+', gradient: 'from-indigo-500 to-purple-500' }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">QUICK PICK YOUR CHOICE</h2>
          <p className="text-xl text-muted-foreground">Browse properties by category to find exactly what you&apos;re looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">{category.label}</CardTitle>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 