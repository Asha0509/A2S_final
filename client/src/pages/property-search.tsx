import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home, Key, Map, Heart, Eye, Phone, Calendar } from "lucide-react";
import PropertyCard from "@/components/property-card";
import type { PropertyFilters } from "@/types";
import type { Property } from "@shared/schema";

export default function PropertySearch() {
  const [selectedPurpose, setSelectedPurpose] = useState<'buy' | 'rent' | 'land'>('buy');
  const [filters, setFilters] = useState<PropertyFilters>({
    purpose: 'buy',
    minPrice: 100000,
    maxPrice: 10000000,
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", filters],
  });

  const handlePurposeChange = (purpose: 'buy' | 'rent' | 'land') => {
    setSelectedPurpose(purpose);
    let newFilters: PropertyFilters = { purpose };
    
    if (purpose === 'rent') {
      newFilters = { ...newFilters, minPrice: 1000, maxPrice: 100000 };
    } else if (purpose === 'land') {
      newFilters = { ...newFilters, minPrice: 50000, maxPrice: 10000000 };
    } else {
      newFilters = { ...newFilters, minPrice: 100000, maxPrice: 10000000 };
    }
    
    setFilters(newFilters);
  };

  const formatPrice = (value: number) => {
    if (selectedPurpose === 'rent') {
      return value >= 1000 ? `₹${(value / 1000).toFixed(0)}K` : `₹${value}`;
    }
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(newAmenities);
    setFilters(prev => ({ ...prev, amenities: newAmenities }));
  };

  const amenitiesList = ['Gym', 'Swimming Pool', 'Security', 'Parking', 'Clubhouse', 'Garden', 'Balcony'];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Find Your Perfect Space</h2>
        
        {/* Property Type Selection */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'buy' as const, label: 'Buy', icon: Home },
            { key: 'rent' as const, label: 'Rent', icon: Key },
            { key: 'land' as const, label: 'Land', icon: Map }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => handlePurposeChange(key)}
              variant={selectedPurpose === key ? "default" : "outline"}
              className={`px-6 py-3 ${
                selectedPurpose === key 
                  ? "bg-teal-600 hover:bg-teal-700" 
                  : "hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Location</Label>
              <div className="relative">
                <Input 
                  placeholder="Search location..." 
                  className="pl-10"
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">
                {selectedPurpose === 'rent' ? 'Monthly Rent' : 'Budget Range'}
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[filters.minPrice || 0, filters.maxPrice || 10000000]}
                  onValueChange={handlePriceChange}
                  min={selectedPurpose === 'rent' ? 1000 : selectedPurpose === 'land' ? 50000 : 100000}
                  max={selectedPurpose === 'rent' ? 100000 : 10000000}
                  step={selectedPurpose === 'rent' ? 1000 : 100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{formatPrice(filters.minPrice || 0)}</span>
                  <span>{formatPrice(filters.maxPrice || 10000000)}</span>
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Property Type</Label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPurpose === 'land' ? (
                    <>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Facing */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2">Facing</Label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, facing: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="Northeast">Northeast</SelectItem>
                  <SelectItem value="Northwest">Northwest</SelectItem>
                  <SelectItem value="Southeast">Southeast</SelectItem>
                  <SelectItem value="Southwest">Southwest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <Label className="text-sm font-medium text-slate-700 mb-3">Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Search className="w-4 h-4 mr-2" />
              Search Properties
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-slate-200 rounded-t-lg"></div>
              <CardContent className="p-5">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded mb-4"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {properties && properties.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">No properties found</h3>
          <p className="text-slate-600">Try adjusting your search filters to see more results.</p>
        </div>
      )}
    </main>
  );
}
