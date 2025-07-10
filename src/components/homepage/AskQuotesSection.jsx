import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AskQuotesSection() {
  const services = [
    { title: 'Property Valuation', desc: 'Get accurate market value estimates', icon: '💰', gradient: 'from-green-500 to-emerald-500' },
    { title: 'Rental Pricing', desc: 'Optimize your rental income potential', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { title: 'Investment Advice', desc: 'Expert guidance for property investment', icon: '💡', gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="outline" className="mb-4">
          💬 Expert Consultation
        </Badge>
        <h2 className="text-5xl font-bold text-foreground mb-6">Ask Quotes</h2>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
          Get personalized quotes from verified property dealers and agents
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-8 text-center space-y-6">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <div>
                  <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.desc}</CardDescription>
                </div>
                <Button className="w-full">
                  Get Quote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 