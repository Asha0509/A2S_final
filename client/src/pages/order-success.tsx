import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Calendar, ArrowLeft, Phone } from "lucide-react";
import { Link } from "wouter";

export default function OrderSuccess() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed!</h1>
        <p className="text-slate-600">Your furniture order has been successfully placed.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Order Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order ID:</span>
                  <span className="font-medium">#ORD-2025-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Items:</span>
                  <span className="font-medium">2 furniture pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-medium text-emerald-600">₹70K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Status:</span>
                  <span className="font-medium text-emerald-600">Confirmed</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Installation Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Scheduled Date:</span>
                  <span className="font-medium">Jan 22, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Time Slot:</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Installation Fee:</span>
                  <span className="font-medium">₹5K (Included)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimated Duration:</span>
                  <span className="font-medium">3-4 hours</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>What's Next?</span>
          </h3>
          <div className="space-y-3 text-slate-600">
            <p>• You'll receive order confirmation via email and SMS</p>
            <p>• Our team will call you 24 hours before installation</p>
            <p>• Please ensure someone is available at the delivery address</p>
            <p>• Installation team will handle assembly and placement</p>
            <p>• Quality check will be done before completion</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>Need Help?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-600 mb-2">Customer Support</p>
              <p className="font-medium">📞 1800-123-4567</p>
              <p className="text-sm text-slate-500">Mon-Sat, 9 AM - 8 PM</p>
            </div>
            <div>
              <p className="text-slate-600 mb-2">Installation Support</p>
              <p className="font-medium">📞 1800-567-8901</p>
              <p className="text-sm text-slate-500">Available 24/7</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/design-room">
          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
            Design Another Room
          </Button>
        </Link>
      </div>
    </main>
  );
}