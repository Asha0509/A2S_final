import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Phone, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BookingSuccess() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-600">Your consultation has been successfully booked.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Booking Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Consultation Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium">Interior Design Consultation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-medium">Jan 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-medium">02:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">60 minutes</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Consultant Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Name:</span>
                  <span className="font-medium">Dr. Rajesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Experience:</span>
                  <span className="font-medium">12 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Specialization:</span>
                  <span className="font-medium">Modern Interior Design</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fee:</span>
                  <span className="font-medium text-emerald-600">₹3,500</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>What's Next?</span>
          </h3>
          <div className="space-y-3 text-slate-600">
            <p>• You'll receive a confirmation email with all the details shortly</p>
            <p>• Our consultant will call you 30 minutes before the session</p>
            <p>• Please have your property photos and requirements ready</p>
            <p>• You can reschedule or cancel up to 24 hours before the appointment</p>
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
        <Link href="/book-consultation">
          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
            Book Another Consultation
          </Button>
        </Link>
      </div>
    </main>
  );
}