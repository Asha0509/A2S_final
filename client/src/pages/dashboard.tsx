import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Palette, 
  Bot, 
  Calendar,
  ArrowRight,
  Edit
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  // Mock user ID for demo
  const userId = "user-1";

  const { data: savedProperties } = useQuery({
    queryKey: ["/api/saved-properties", { userId }],
  });

  const { data: roomDesigns } = useQuery({
    queryKey: ["/api/room-designs", { userId }],
  });

  const { data: chats } = useQuery({
    queryKey: ["/api/ai-chats", { userId }],
  });

  const { data: bookings } = useQuery({
    queryKey: ["/api/bookings", { userId }],
  });

  const stats = [
    {
      title: "Properties Saved",
      value: savedProperties?.length || 0,
      icon: Home,
      color: "bg-teal-100 text-teal-600",
    },
    {
      title: "Room Designs",
      value: roomDesigns?.length || 0,
      icon: Palette,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "AI Conversations",
      value: chats?.length || 0,
      icon: Bot,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Consultations",
      value: bookings?.length || 0,
      icon: Calendar,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  const recentProperties = [
    {
      id: "1",
      title: "3BHK in HSR Layout",
      price: "₹85L",
      location: "East Facing",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=64&h=48&fit=crop",
    },
    {
      id: "2",
      title: "Villa in Goa",
      price: "₹1.2Cr",
      location: "West Facing",
      image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=64&h=48&fit=crop",
    },
    {
      id: "3",
      title: "Commercial Land - Vizag",
      price: "₹45L",
      location: "6000 sqft",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=64&h=48&fit=crop",
    },
  ];

  const recentDesigns = [
    {
      id: "1",
      title: "Modern Living Room",
      theme: "Teal & Wood Theme",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=64&h=48&fit=crop",
    },
    {
      id: "2",
      title: "Cozy Bedroom",
      theme: "Warm & Minimal",
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=64&h=48&fit=crop",
    },
    {
      id: "3",
      title: "Modern Kitchen",
      theme: "Sleek & Functional",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=64&h=48&fit=crop",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, John!</h2>
        <p className="text-slate-600">Here's what's happening with your properties and designs.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Recently Saved Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{property.title}</p>
                    <p className="text-sm text-slate-600">{property.price} • {property.location}</p>
                  </div>
                  <Link href="/search">
                    <Button size="sm" variant="ghost" className="text-teal-600 hover:text-teal-700">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Designs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Recent Room Designs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDesigns.map((design) => (
                <div key={design.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                  <img 
                    src={design.image} 
                    alt={design.title}
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{design.title}</p>
                    <p className="text-sm text-slate-600">{design.theme}</p>
                  </div>
                  <Link href="/design">
                    <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
