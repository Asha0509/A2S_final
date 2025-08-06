import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Truck, CreditCard, Package, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export default function OrderCheckout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    installationDate: '',
    paymentMethod: 'card',
    specialInstructions: ''
  });

  // Mock cart data - in real app this would come from context/state
  const cartItems: CartItem[] = [
    {
      id: 'sofa-l-shaped',
      name: 'L-Shaped Sofa',
      price: 45000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
      category: 'seating'
    },
    {
      id: 'coffee-table',
      name: 'Glass Coffee Table',
      price: 18000,
      quantity: 1,
      image: 'https://vivaninterio.com/wp-content/uploads/2020/05/HTB1vhv8eStYBeNjSspkq6zU8VXap-600x600.jpg',
      category: 'tables'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2500;
  const installationFee = 5000;
  const total = subtotal + deliveryFee + installationFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.installationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Placed Successfully!",
      description: "Your furniture order has been confirmed. You'll receive installation details soon.",
    });

    // Redirect to order success page
    setTimeout(() => {
      setLocation('/order-success');
    }, 1500);
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Minimum 7 days from now
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 45); // Maximum 45 days from now
    return today.toISOString().split('T')[0];
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/design-room">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Design
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
            <p className="text-slate-600">Complete your furniture order</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Asha Jyothi"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="asha@example.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="400001"
                      required
                      data-testid="input-pincode"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Complete address with landmark"
                    required
                    data-testid="input-address"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Mumbai"
                    required
                    data-testid="input-city"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Installation Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="installationDate">Preferred Installation Date *</Label>
                <Input
                  id="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, installationDate: e.target.value }))}
                  min={getMinDate()}
                  max={getMaxDate()}
                  required
                  data-testid="input-installation-date"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Installation available 7-45 days from today
                </p>
              </div>

              <div>
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  placeholder="Any specific installation requirements or notes..."
                  data-testid="input-special-instructions"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger data-testid="select-payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI Payment</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="cod">Cash on Delivery (₹500 extra)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">₹{(item.price / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">₹{(subtotal / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-medium">₹{(deliveryFee / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Installation Fee</span>
                <span className="font-medium">₹{(installationFee / 1000).toFixed(0)}K</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-600">₹{(total / 1000).toFixed(0)}K</span>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            data-testid="button-place-order"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Place Order - ₹{(total / 1000).toFixed(0)}K
          </Button>

          <div className="text-xs text-slate-500 space-y-1">
            <p>• Free delivery for orders above ₹50K</p>
            <p>• Professional installation included</p>
            <p>• 1-year warranty on all furniture</p>
            <p>• 30-day return policy</p>
          </div>
        </div>
      </div>
    </main>
  );
}