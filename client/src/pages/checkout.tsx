import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart, CreditCard, MapPin, Calendar, Truck, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

type CartItem = {
  id: string;
  furnitureId: string;
  quantity: number;
  position: { x: number; y: number };
  furniture?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    installationTime: string;
    dimensions: string;
    material: string;
    color: string;
  };
};

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    installationDate: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID for demo
  const userId = "demo-user";

  // Fetch cart items
  const { data: cartItems = [], isLoading: isCartLoading } = useQuery({
    queryKey: ['/api/cart', userId],
    queryFn: () => apiRequest('GET', `/api/cart/${userId}`).then(res => res.json()),
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) =>
      apiRequest('POST', '/api/orders', orderData).then(res => res.json()),
    onSuccess: (order) => {
      setOrderDetails(order);
      setOrderPlaced(true);
      queryClient.invalidateQueries({ queryKey: ['/api/cart', userId] });
      toast({
        title: "Order Placed Successfully!",
        description: "Your furniture will be delivered and installed soon."
      });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const calculateSubtotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => 
      total + (item.furniture?.price || 0) * item.quantity, 0
    );
  };

  const calculateTax = (subtotal: number) => {
    return Math.round(subtotal * 0.18); // 18% GST
  };

  const calculateDelivery = () => {
    return cartItems.length > 0 ? 2000 : 0; // Flat delivery charge
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const delivery = calculateDelivery();
    return subtotal + tax + delivery;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      userId,
      roomDesignId: null,
      items: cartItems.map((item: CartItem) => ({
        furnitureId: item.furnitureId,
        name: item.furniture?.name,
        price: item.furniture?.price,
        quantity: item.quantity,
        imageUrl: item.furniture?.imageUrl
      })),
      totalAmount: calculateTotal(),
      installationDate: shippingInfo.installationDate,
      paymentMethod: "COD", // Cash on Delivery for demo
      paymentStatus: "pending",
      orderStatus: "processing"
    };

    createOrderMutation.mutate(orderData);
  };

  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Order ID:</p>
                    <p className="text-gray-600">{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Amount:</p>
                    <p className="text-gray-600 font-semibold">
                      {formatPrice(orderDetails.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Delivery Date:</p>
                    <p className="text-gray-600">
                      {orderDetails.installationDate || "Within 7-10 days"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Payment:</p>
                    <p className="text-gray-600">Cash on Delivery</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button variant="outline">
                    View Orders
                  </Button>
                </Link>
                <Link href="/design-room">
                  <Button>
                    Design Another Room
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-8">
              <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-6">
                Add some furniture to your room design to proceed with checkout.
              </p>
              <Link href="/design-room">
                <Button size="lg">
                  Start Designing
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Your Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.furniture?.imageUrl}
                        alt={item.furniture?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.furniture?.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {item.furniture?.dimensions} • {item.furniture?.material}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.furniture?.installationTime}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatPrice((item.furniture?.price || 0) * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.furniture?.price || 0)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={shippingInfo.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Enter PIN code"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete delivery address"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="installationDate">Preferred Installation Date</Label>
                  <Input
                    id="installationDate"
                    type="date"
                    value={shippingInfo.installationDate}
                    onChange={(e) => handleInputChange('installationDate', e.target.value)}
                    min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>{formatPrice(calculateTax(calculateSubtotal()))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Delivery & Installation
                    </span>
                    <span>{formatPrice(calculateDelivery())}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Delivery Timeline</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Free delivery and professional installation within 7-10 working days
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700 font-medium mb-1">
                    💳 Cash on Delivery Available
                  </p>
                  <p className="text-xs text-green-600">
                    Pay when your furniture is delivered and installed
                  </p>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={createOrderMutation.isPending}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>

                <Link href="/design-room">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}