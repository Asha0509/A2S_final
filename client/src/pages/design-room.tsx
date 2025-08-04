import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Palette, Home, Lightbulb, Sofa, ShoppingCart, Sparkles, Plus, Minus, X, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

type FurnitureItem = {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  description: string;
  dimensions: string;
  material: string;
  color: string;
  imageUrl: string;
  installationTime: string;
  roomTypes: string[];
};

type CartItem = {
  id: string;
  furnitureId: string;
  quantity: number;
  position: { x: number; y: number };
  furniture?: FurnitureItem;
};

export default function DesignRoom() {
  const [selectedRoom, setSelectedRoom] = useState<string>("living_room");
  const [selectedDesign, setSelectedDesign] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [placedFurniture, setPlacedFurniture] = useState<CartItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<FurnitureItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID for demo
  const userId = "demo-user";

  const roomTypes = [
    { id: "living_room", name: "Living Room", icon: Home },
    { id: "bedroom", name: "Bedroom", icon: Home },
    { id: "kitchen", name: "Kitchen", icon: Home },
    { id: "dining", name: "Dining Room", icon: Home },
  ];

  const designTypes = [
    { id: "empty", name: "Empty Space", description: "Start from scratch" },
    { id: "semi", name: "Semi-Furnished", description: "Basic furniture included" },
    { id: "renovate", name: "Renovate", description: "Update existing room" },
  ];

  const themes = [
    { id: "modern", name: "Modern", colors: ["#2563eb", "#64748b"] },
    { id: "traditional", name: "Traditional", colors: ["#92400e", "#451a03"] },
    { id: "minimalist", name: "Minimalist", colors: ["#ffffff", "#374151"] },
    { id: "bohemian", name: "Bohemian", colors: ["#dc2626", "#f59e0b"] }
  ];

  // Fetch furniture based on selected room
  const { data: furniture = [], isLoading: isFurnitureLoading } = useQuery({
    queryKey: ['/api/furniture', selectedRoom],
    queryFn: () => apiRequest('GET', `/api/furniture?roomType=${selectedRoom}`).then(res => res.json()),
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ['/api/cart', userId],
    queryFn: () => apiRequest('GET', `/api/cart/${userId}`).then(res => res.json()),
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (item: { furnitureId: string; quantity: number; position: { x: number; y: number } }) =>
      apiRequest('POST', '/api/cart', {
        userId,
        furnitureId: item.furnitureId,
        quantity: item.quantity,
        position: item.position,
        roomDesignId: null
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] });
      toast({
        title: "Added to Cart",
        description: "Furniture item added to your cart successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle drag and drop for furniture placement
  const handleDragStart = (item: FurnitureItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add to cart with position
    addToCartMutation.mutate({
      furnitureId: draggedItem.id,
      quantity: 1,
      position: { x, y }
    });

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: any) => 
      total + (item.furniture?.price || 0) * item.quantity, 0
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            2.5D Room Design Studio
          </h1>
          <p className="text-gray-600">
            Create stunning room designs with our interactive furniture placement tool
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Room Configuration Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Room Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {roomTypes.map((room) => (
                  <Button
                    key={room.id}
                    variant={selectedRoom === room.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <room.icon className="w-4 h-4 mr-2" />
                    {room.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={selectedTheme === theme.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {theme.name}
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Cart Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {cartItems.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          <img 
                            src={item.furniture?.imageUrl} 
                            alt={item.furniture?.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium truncate">{item.furniture?.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{cartItems.length - 3} more items
                        </p>
                      )}
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                    <Link href="/checkout">
                      <Button className="w-full" size="sm">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Checkout
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items in cart</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Design Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Design Canvas
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full p-0">
                <div 
                  className="w-full h-full bg-gradient-to-br from-white to-gray-50 relative border-2 border-dashed border-gray-200 rounded-lg overflow-hidden"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {/* Room Background Pattern */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }} />
                  
                  {/* Placed furniture items */}
                  {cartItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="absolute bg-white border-2 border-blue-200 rounded-lg p-2 shadow-md"
                      style={{
                        left: `${item.position?.x || 50}px`,
                        top: `${item.position?.y || 50}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <img 
                        src={item.furniture?.imageUrl} 
                        alt={item.furniture?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <p className="text-xs text-center mt-1 font-medium">
                        {item.furniture?.name}
                      </p>
                    </div>
                  ))}

                  {cartItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Sofa className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg font-medium">Drag furniture here to place</p>
                        <p className="text-sm">Select items from the furniture panel</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Furniture Panel */}
          <div className="lg:col-span-1">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sofa className="w-5 h-5" />
                  Furniture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-full overflow-y-auto p-4">
                  {isFurnitureLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-200 h-20 rounded mb-2"></div>
                          <div className="bg-gray-200 h-4 rounded mb-1"></div>
                          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {furniture.map((item: FurnitureItem) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow bg-white"
                          draggable
                          onDragStart={() => handleDragStart(item)}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{item.dimensions}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-blue-600">
                              {formatPrice(item.price)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {item.installationTime}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.material} • {item.color}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4">
            <Link href="/book-consultation">
              <Button variant="outline" size="lg">
                Book Designer
              </Button>
            </Link>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="lg">
              Save Design
            </Button>
            {cartItems.length > 0 && (
              <Link href="/checkout">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Proceed to Cart ({cartItems.length})
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}