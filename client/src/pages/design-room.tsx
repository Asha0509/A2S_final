import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Wand2, 
  CloudUpload, 
  Save, 
  RotateCcw, 
  RotateCw,
  Expand,
  RotateCw as Reset,
  Download,
  UserCheck
} from "lucide-react";
import DesignStudio from "@/components/design-studio";

export default function DesignRoom() {
  const [selectedDesignType, setSelectedDesignType] = useState<'empty' | 'semi' | 'renovate' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const designTypes = [
    {
      id: 'empty' as const,
      title: 'Empty Room',
      description: 'Start from scratch with a blank canvas',
      icon: Plus,
      color: 'border-purple-200 hover:border-purple-400',
      activeColor: 'border-purple-400 bg-purple-50'
    },
    {
      id: 'semi' as const,
      title: 'Semi-Furnished',
      description: 'Customize existing furniture layouts',
      icon: Edit,
      color: 'border-slate-200 hover:border-purple-400',
      activeColor: 'border-purple-400 bg-purple-50'
    },
    {
      id: 'renovate' as const,
      title: 'Renovate',
      description: 'Redesign your existing room',
      icon: Wand2,
      color: 'border-slate-200 hover:border-purple-400',
      activeColor: 'border-purple-400 bg-purple-50'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Design Your Dream Space</h2>
        <p className="text-slate-600">Create stunning room designs with our AI-powered 2.5D studio</p>
      </div>

      {/* Design Type Selection */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Choose Your Design Approach</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {designTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedDesignType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedDesignType(type.id)}
                  className={`design-type-card border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    isSelected ? type.activeColor : type.color
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      isSelected ? 'bg-purple-100' : 'bg-slate-100'
                    }`}>
                      <Icon className={`text-2xl ${
                        isSelected ? 'text-purple-600' : 'text-slate-600'
                      }`} />
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">{type.title}</h4>
                    <p className="text-sm text-slate-600">{type.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Your Room</h3>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <CloudUpload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-2">Drag and drop your room image or video here</p>
            <p className="text-sm text-slate-500 mb-4">Supports JPG, PNG, MP4 up to 10MB</p>
            <div className="relative">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">
                <CloudUpload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
            {uploadedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">✓ Uploaded: {uploadedFile.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Design Studio Interface */}
      <DesignStudio />

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button variant="outline" className="px-6 py-3">
          <Wand2 className="w-4 h-4 mr-2" />
          Auto-Design
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-3">
          <UserCheck className="w-4 h-4 mr-2" />
          Book Designer
        </Button>
        <Button className="bg-teal-600 hover:bg-teal-700 px-6 py-3">
          <Download className="w-4 h-4 mr-2" />
          Export Preview
        </Button>
      </div>
    </main>
  );
}
