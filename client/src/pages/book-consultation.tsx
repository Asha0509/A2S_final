import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarCheck, Compass, Palette, Star, Clock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ConsultantCard from "@/components/consultant-card";

export default function BookConsultation() {
  const [selectedType, setSelectedType] = useState<'vastu' | 'interior' | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    consultationType: '',
    preferredDate: '',
    requirements: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: consultants } = useQuery({
    queryKey: ["/api/consultants", selectedType],
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your consultation has been booked successfully. You'll receive a confirmation email shortly.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        consultationType: '',
        preferredDate: '',
        requirements: ''
      });
      setSelectedTime('');
      setSelectedConsultant(null);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const consultantTypes = [
    {
      id: 'vastu' as const,
      title: 'Vastu Consultant',
      description: 'Get expert guidance on Vastu principles for your property',
      icon: Compass,
      price: 'Starting ₹2,000/session',
      color: 'border-emerald-200 hover:border-emerald-400',
      activeColor: 'border-emerald-400 bg-emerald-50'
    },
    {
      id: 'interior' as const,
      title: 'Interior Designer',
      description: 'Professional interior design consultation and planning',
      icon: Palette,
      price: 'Starting ₹3,500/session',
      color: 'border-slate-200 hover:border-emerald-400',
      activeColor: 'border-emerald-400 bg-emerald-50'
    }
  ];

  const timeSlots = ['10:00 AM', '02:00 PM', '05:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConsultant || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a consultant and time slot.",
        variant: "destructive",
      });
      return;
    }

    const selectedConsultantData = consultants?.find(c => c.id === selectedConsultant);
    
    bookingMutation.mutate({
      userId: "user-1", // Mock user ID
      consultantId: selectedConsultant,
      ...formData,
      consultationType: selectedType,
      preferredTime: selectedTime,
      totalAmount: selectedConsultantData?.price || 0,
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Book a Consultation</h2>
        <p className="text-slate-600">Connect with our expert consultants for personalized advice</p>
      </div>

      {/* Consultant Type Selection */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Choose Consultation Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultantTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`consultant-type border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    isSelected ? type.activeColor : type.color
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      <Icon className={`text-2xl ${
                        isSelected ? 'text-emerald-600' : 'text-slate-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">{type.title}</h4>
                      <p className="text-slate-600 text-sm">{type.description}</p>
                      <p className="text-emerald-600 font-medium text-sm mt-1">{type.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Consultants */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">
            Available {selectedType === 'vastu' ? 'Vastu Consultants' : selectedType === 'interior' ? 'Interior Designers' : 'Consultants'}
          </h3>
          
          {consultants?.map((consultant) => (
            <ConsultantCard 
              key={consultant.id}
              consultant={consultant}
              isSelected={selectedConsultant === consultant.id}
              onSelect={() => setSelectedConsultant(consultant.id)}
            />
          ))}

          {!selectedType && (
            <div className="text-center py-8">
              <Compass className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Please select a consultation type to view available consultants.</p>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Book Your Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="consultationType">Consultation Type</Label>
                  <Select 
                    value={selectedType || ''}
                    onValueChange={(value) => setSelectedType(value as 'vastu' | 'interior')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vastu">Vastu Consultation</SelectItem>
                      <SelectItem value="interior">Interior Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1BHK">1BHK Apartment</SelectItem>
                      <SelectItem value="2BHK">2BHK Apartment</SelectItem>
                      <SelectItem value="3BHK">3BHK Apartment</SelectItem>
                      <SelectItem value="Villa">Villa/House</SelectItem>
                      <SelectItem value="Commercial">Commercial Space</SelectItem>
                      <SelectItem value="Land">Land/Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Preferred Time</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`time-slot ${
                        selectedTime === time 
                          ? "bg-emerald-600 hover:bg-emerald-700" 
                          : "hover:border-emerald-400"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Please describe your specific requirements, budget range, or any questions you have..."
                  rows={4}
                />
              </div>

              {selectedConsultant && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-800">Consultation Fee</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ₹{consultants?.find(c => c.id === selectedConsultant)?.price || 0}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    Includes 60-minute session with detailed report and recommendations
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={bookingMutation.isPending}
              >
                <CalendarCheck className="w-4 h-4 mr-2" />
                {bookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
