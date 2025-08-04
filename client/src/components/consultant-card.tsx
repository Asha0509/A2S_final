import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Eye } from "lucide-react";
import type { Consultant } from "@shared/schema";

interface ConsultantCardProps {
  consultant: Consultant;
  isSelected?: boolean;
  onSelect?: () => void;
  onBookSession?: () => void;
  onViewProfile?: () => void;
}

export default function ConsultantCard({ 
  consultant, 
  isSelected = false,
  onSelect,
  onBookSession,
  onViewProfile
}: ConsultantCardProps) {
  const formatRating = (rating: number) => {
    return (rating / 10).toFixed(1); // Convert from out of 50 to out of 5
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vastu':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'interior':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-slate-600 hover:bg-slate-700';
    }
  };

  const getSpecializationColors = (specialization: string) => {
    const colorMap: { [key: string]: string } = {
      'Residential': 'bg-emerald-100 text-emerald-700',
      'Commercial': 'bg-blue-100 text-blue-700',
      'Land Analysis': 'bg-purple-100 text-purple-700',
      'Apartments': 'bg-emerald-100 text-emerald-700',
      'Remedies': 'bg-orange-100 text-orange-700',
      'Home Office': 'bg-pink-100 text-pink-700',
      'Modern': 'bg-purple-100 text-purple-700',
      'Sustainable': 'bg-green-100 text-green-700',
      'Space Planning': 'bg-blue-100 text-blue-700'
    };
    
    return colorMap[specialization] || 'bg-slate-100 text-slate-700';
  };

  return (
    <Card className={`transition-all duration-200 ${
      isSelected ? 'ring-2 ring-emerald-400 border-emerald-400' : 'hover:shadow-lg'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={consultant.imageUrl || ""} alt={consultant.name} />
            <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-white text-lg font-semibold">
              {consultant.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h4 className="font-semibold text-slate-800">{consultant.name}</h4>
            <p className="text-sm text-slate-600 mb-2">
              {consultant.type === 'vastu' ? 'Vastu Expert' : 'Interior Designer'} • {consultant.experience} years experience
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {formatRating(consultant.rating)} ({consultant.reviewCount} reviews)
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 text-slate-400 mr-1" />
                {consultant.availability}
              </span>
            </div>
            
            {consultant.bio && (
              <p className="text-xs text-slate-600 mb-3">{consultant.bio}</p>
            )}
            
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {consultant.specializations?.map((spec) => (
                <Badge 
                  key={spec} 
                  className={`text-xs ${getSpecializationColors(spec)}`}
                  variant="outline"
                >
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <Button 
            className={`flex-1 text-sm font-medium ${getTypeColor(consultant.type)}`}
            onClick={onBookSession || onSelect}
          >
            Book Session - ₹{consultant.price.toLocaleString()}
          </Button>
          <Button 
            variant="outline" 
            className="text-sm hover:bg-slate-50"
            onClick={onViewProfile}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
