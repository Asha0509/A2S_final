import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Undo, 
  Redo, 
  RotateCcw, 
  Save, 
  Expand,
  RotateCw
} from "lucide-react";

export default function DesignStudio() {
  const [selectedColor, setSelectedColor] = useState<string>('white');
  const [selectedFloor, setSelectedFloor] = useState<string>('marble');

  const furnitureCategories = [
    {
      name: 'Living Room',
      items: [
        { id: 'sofa', name: 'Sofa', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=40&fit=crop' },
        { id: 'coffee-table', name: 'Coffee Table', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=60&h=40&fit=crop' },
        { id: 'armchair', name: 'Armchair', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=60&h=40&fit=crop' },
        { id: 'tv-stand', name: 'TV Stand', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=40&fit=crop' },
      ]
    },
    {
      name: 'Bedroom',
      items: [
        { id: 'king-bed', name: 'King Bed', image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=60&h=40&fit=crop' },
        { id: 'nightstand', name: 'Nightstand', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=40&fit=crop' },
        { id: 'wardrobe', name: 'Wardrobe', image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=60&h=40&fit=crop' },
        { id: 'dressing-table', name: 'Dressing Table', image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=60&h=40&fit=crop' },
      ]
    }
  ];

  const wallColors = [
    'white', 'slate-100', 'slate-200', 'slate-800', 
    'teal-500', 'blue-500', 'green-500', 'yellow-500'
  ];

  const floorOptions = ['Marble', 'Hardwood', 'Ceramic Tiles', 'Vinyl'];
  const lightingOptions = ['Ceiling Lights', 'Table Lamps', 'Floor Lamps'];

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    console.log('Dropped item:', itemId);
    // Handle furniture placement logic here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-slate-800">Design Studio</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="text-purple-700 border-purple-200 hover:bg-purple-50">
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button variant="outline" size="sm" className="text-purple-700 border-purple-200 hover:bg-purple-50">
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-1" />
            Save Design
          </Button>
        </div>
      </div>

      <div className="flex h-96">
        {/* Left Panel - Furniture */}
        <div className="w-1/4 border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold text-slate-800 mb-4">Furniture</h4>
            <div className="space-y-4">
              {furnitureCategories.map((category) => (
                <div key={category.name}>
                  <h5 className="text-sm font-medium text-slate-700 mb-2">{category.name}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="furniture-item border border-slate-200 rounded-lg p-2 cursor-move"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-8 object-cover rounded mb-1"
                        />
                        <p className="text-xs text-slate-600">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel - 3D Room View */}
        <div 
          className="flex-1 bg-slate-100 relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="h-full flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=300&fit=crop" 
              alt="3D Room View"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
              <Expand className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Panel - Materials & Colors */}
        <div className="w-1/4 border-l border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold text-slate-800 mb-4">Materials & Colors</h4>
            
            {/* Wall Colors */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-slate-700 mb-2">Wall Colors</h5>
              <div className="grid grid-cols-4 gap-2">
                {wallColors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded cursor-pointer border-2 transition-colors ${
                      selectedColor === color 
                        ? 'border-purple-400' 
                        : 'border-slate-300 hover:border-purple-400'
                    } ${
                      color === 'white' ? 'bg-white' :
                      color === 'slate-100' ? 'bg-slate-100' :
                      color === 'slate-200' ? 'bg-slate-200' :
                      color === 'slate-800' ? 'bg-slate-800' :
                      color === 'teal-500' ? 'bg-teal-500' :
                      color === 'blue-500' ? 'bg-blue-500' :
                      color === 'green-500' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Flooring */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-slate-700 mb-2">Flooring</h5>
              <div className="space-y-2">
                {floorOptions.map((floor) => (
                  <div
                    key={floor}
                    onClick={() => setSelectedFloor(floor.toLowerCase())}
                    className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                      selectedFloor === floor.toLowerCase()
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs text-slate-600">{floor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Lighting</h5>
              <div className="space-y-2">
                {lightingOptions.map((lighting) => (
                  <div
                    key={lighting}
                    className="border border-slate-200 rounded-lg p-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <p className="text-xs text-slate-600">{lighting}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
