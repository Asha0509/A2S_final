import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, Phone, Calendar, MapPin, Expand, Compass } from "lucide-react";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, purpose: string) => {
    if (purpose === 'rent') {
      return `₹${(price / 1000).toFixed(0)}K/month`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)}L`;
    }
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  const getActionButtons = (purpose: string) => {
    if (purpose === 'rent') {
      return (
        <>
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            Book Visit
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            <Phone className="w-4 h-4 mr-1" />
            Contact
          </Button>
        </>
      );
    } else if (purpose === 'land') {
      return (
        <>
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            Reserve
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-sm">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            <Phone className="w-4 h-4 mr-1" />
            Contact
          </Button>
        </>
      );
    }
  };

  const getSuggestion = (purpose: string, landPurpose?: string | null) => {
    if (purpose === 'land') {
      if (landPurpose === 'commercial') {
        return {
          text: "Ideal for: Resort, Event Venue, or Commercial Complex",
          className: "bg-amber-50 border-amber-200 text-amber-700"
        };
      } else {
        return {
          text: "Perfect for: Villa Construction or Investment",
          className: "bg-green-50 border-green-200 text-green-700"
        };
      }
    }
    return null;
  };

  const suggestion = getSuggestion(property.purpose, property.landPurpose);

  return (
    <Card className="property-card overflow-hidden">
      <div className="relative">
        <img 
          src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.tags?.map((tag) => (
            <Badge 
              key={tag} 
              className={`text-xs ${
                tag === 'Verified' ? 'bg-green-500' :
                tag === 'New' ? 'bg-blue-500' :
                tag === 'Premium' ? 'bg-purple-500' :
                tag === 'Commercial' ? 'bg-orange-500' :
                'bg-slate-500'
              } text-white`}
            >
              {tag}
            </Badge>
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <Heart className="w-4 h-4 text-slate-600" />
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-slate-800">{property.title}</h3>
            <p className="text-slate-600 text-sm flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {property.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-800">
              {formatPrice(property.price, property.purpose)}
            </p>
            <p className="text-xs text-slate-500">
              {property.purpose === 'rent' ? 'per month' : 'Total Price'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
          {property.facing && (
            <span className="flex items-center">
              <Compass className="w-3 h-3 mr-1" />
              {property.facing} Facing
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center">
              <Expand className="w-3 h-3 mr-1" />
              {property.sqft.toLocaleString()} sqft
            </span>
          )}
          {property.furnishing && (
            <span>{property.furnishing}</span>
          )}
        </div>

        {suggestion && (
          <div className={`border rounded-lg p-2 mb-4 ${suggestion.className}`}>
            <p className="text-xs">{suggestion.text}</p>
          </div>
        )}

        <p className="text-sm text-slate-600 mb-4">
          Posted by <span className="font-medium">{property.ownerName}</span>
        </p>

        <div className="flex space-x-2">
          {getActionButtons(property.purpose)}
        </div>
      </CardContent>
    </Card>
  );
}
