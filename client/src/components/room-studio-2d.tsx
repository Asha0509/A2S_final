import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, Video, RotateCcw, ZoomIn, ZoomOut, Save, RotateCw, 
  Sparkles, Eye, UserCheck, Download, Home, Sofa, Armchair, 
  Tv, Bed, Utensils, AirVent, Lightbulb, Palette, Layers,
  Grid, Move, AlertTriangle, CheckCircle, ShoppingCart, Phone,
  Package, Calendar, ArrowLeft
} from "lucide-react";
import emptyRoomImage from "@assets/Leerer-weisser-Raum_620x417px_1754411499692.jpg";

type FurnitureItem = {
  id: string;
  name: string;
  category: string;
  icon: any;
  price: number;
  image: string;
  dimensions: string;
};

type PlacedItem = {
  id: string;
  furnitureId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

export default function RoomStudio2D() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');
  const [selectedRoom, setSelectedRoom] = useState<string>('living_room');
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedWallColor, setSelectedWallColor] = useState('#ffffff');
  const [selectedFloorType, setSelectedFloorType] = useState('marble');
  const [roomRotation, setRoomRotation] = useState(0);
  const [roomZoom, setRoomZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [collisionAlert, setCollisionAlert] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const roomTypes = [
    { id: 'living_room', name: 'Living Room', icon: Home, description: 'Sofa, TV unit, coffee table' },
    { id: 'bedroom', name: 'Bedroom', icon: Bed, description: 'Bed, wardrobe, nightstand' },
    { id: 'kitchen', name: 'Kitchen', icon: Utensils, description: 'Cabinets, appliances, island' },
    { id: 'dining', name: 'Dining Room', icon: Utensils, description: 'Dining table, chairs, cabinet' },
    { id: 'office', name: 'Home Office', icon: Home, description: 'Desk, chair, bookshelf' },
  ];

  const allFurniture = {
    living_room: {
      seating: [
        { id: 'sofa-l-shaped', name: 'L-Shaped Sofa', category: 'seating', icon: Sofa, price: 45000, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop', dimensions: '240x160cm', roomTypes: ['living_room'] },
        { id: 'accent-chair', name: 'Accent Chair', category: 'seating', icon: Armchair, price: 15000, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop', dimensions: '70x80cm', roomTypes: ['living_room', 'bedroom'] },
        { id: 'recliner-leather', name: 'Leather Recliner', category: 'seating', icon: Armchair, price: 25000, image: 'https://www.royaloakindia.com/media/catalog/product/s/f/sf7912-1_1_.jpg', dimensions: '85x95cm', roomTypes: ['living_room'] },
        { id: 'coffee-table', name: 'Glass Coffee Table', category: 'tables', icon: Home, price: 18000, image: 'https://vivaninterio.com/wp-content/uploads/2020/05/HTB1vhv8eStYBeNjSspkq6zU8VXap-600x600.jpg', dimensions: '120x60cm', roomTypes: ['living_room'] },
      ],
      storage: [
        { id: 'tv-unit-modern', name: 'Modern TV Unit', category: 'storage', icon: Tv, price: 32000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE4wuL82nu76B1eixE4hQD6o8JbFD9sx_VSg&s', dimensions: '180x40cm', roomTypes: ['living_room'] },
        { id: 'bookshelf-tall', name: 'Tall0&fit=crop Bookshelf', category: 'storage', icon: Home, price: 28000, image: 'https://m.media-amazon.com/images/I/61ewEvPy2wL._UF894,1000_QL80_.jpg', dimensions: '80x200cm', roomTypes: ['living_room', 'office'] },
      ],
      appliances: [
        { id: 'smart-tv-55', name: '55" Smart TV', category: 'appliances', icon: Tv, price: 65000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop', dimensions: '122x70cm', roomTypes: ['living_room', 'bedroom'] },
        { id: 'ac-split-1-5', name: '1.5 Ton Split AC', category: 'appliances', icon: AirVent, price: 35000, image: 'https://static.wixstatic.com/media/4af009_50b99ed648a4405980138b37e56d3abb~mv2.jpg/v1/fill/w_980,h_569,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4af009_50b99ed648a4405980138b37e56d3abb~mv2.jpg', dimensions: '80x30cm', roomTypes: ['living_room', 'bedroom'] },
      ]
    },
    bedroom: {
      beds: [
        { id: 'king-bed-wooden', name: 'King Size Wooden Bed', category: 'beds', icon: Bed, price: 38000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVi001QauSDAvNYpy10wPRi153364DdkQDoQ&s', dimensions: '180x200cm', roomTypes: ['bedroom'] },
        { id: 'queen-bed-upholstered', name: 'Queen Upholstered Bed', category: 'beds', icon: Bed, price: 32000, image: 'https://store.ashleyfurniture.in/cdn/shop/files/WhatsAppImage2024-10-17at11.57.39AM.jpg?v=1729147390', dimensions: '160x200cm', roomTypes: ['bedroom'] },
        { id: 'single-bed', name: 'Single Platform Bed', category: 'beds', icon: Bed, price: 22000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ50u4J3BLrmOBFjISPK5z5Z-otlHlp7W1VaQ&s', dimensions: '90x200cm', roomTypes: ['bedroom'] },
      ],
      storage: [
        { id: 'wardrobe-3-door', name: '3-Door Wardrobe', category: 'storage', icon: Home, price: 55000, image: 'https://www.hometown.in/cdn/shop/files/1_7504be7d-bc30-4ac1-8785-adb268c353cf.jpg?v=1747204836', dimensions: '180x60cm', roomTypes: ['bedroom'] },
        { id: 'nightstand-pair', name: 'Nightstand (Pair)', category: 'storage', icon: Home, price: 12000, image: 'https://assets.wfcdn.com/im/60381983/resize-h755-w755%5Ecompr-r85/1995/199508970/Aizlyn%20Nightstand.jpg', dimensions: '45x35cm each', roomTypes: ['bedroom'] },
        { id: 'dressing-table', name: 'Dressing Table with Mirror', category: 'storage', icon: Home, price: 25000, image: 'https://m.media-amazon.com/images/I/51l+PpSMCmL.jpg', dimensions: '120x45cm', roomTypes: ['bedroom'] },
      ],
      seating: [
        { id: 'bedroom-chair', name: 'Bedroom Accent Chair', category: 'seating', icon: Armchair, price: 12000, image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100&h=100&fit=crop', dimensions: '60x70cm', roomTypes: ['bedroom'] },
      ]
    },
    kitchen: {
      appliances: [
        { id: 'refrigerator-double', name: 'Double Door Refrigerator', category: 'appliances', icon: Home, price: 85000, image: 'https://www.lg.com/content/dam/channel/wcms/in/images/refrigerators/gl-i292rpzx_bpzzebn_eail_in_c/GL-I292RPZX-Refrigerators-Front-View-450.jpg', dimensions: '70x180cm', roomTypes: ['kitchen'] },
        { id: 'microwave-convection', name: 'Convection Microwave', category: 'appliances', icon: Home, price: 25000, image: 'https://www.lg.com/content/dam/channel/wcms/in/images/microwave-ovens/mc2146bv_dbkqiln_eail_in_c/gallery/MC2146BV-Microwave-ovens-Front-view-DZ-01.jpg', dimensions: '45x35cm', roomTypes: ['kitchen'] },
        { id: 'dishwasher', name: 'Built-in Dishwasher', category: 'appliances', icon: Home, price: 45000, image: 'https://mahajanelectronics.com/cdn/shop/files/23548829_SMV6HMX01I_PGA1_def.webp?v=1741456292&width=3840', dimensions: '60x85cm', roomTypes: ['kitchen'] },
      ],
      storage: [
        { id: 'kitchen-cabinet-upper', name: 'Upper Kitchen Cabinets', category: 'storage', icon: Home, price: 35000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_JXTmKsrY4SZT09579lbvxCgxVoP4DCw0XA&s', dimensions: '200x40cm', roomTypes: ['kitchen'] },
        { id: 'kitchen-cabinet-base', name: 'Base Kitchen Cabinets', category: 'storage', icon: Home, price: 45000, image: 'https://decorcabinets.com/wp-content/uploads/2024/08/kitchen-base-cabinets-3-scaled.jpg', dimensions: '200x60cm', roomTypes: ['kitchen'] },
        { id: 'kitchen-island', name: 'Kitchen Island', category: 'storage', icon: Home, price: 65000, image: 'https://cdn.prod.website-files.com/6296aec5884dc4c8a90970a6/644a64a660908bcdc4b83360_abc41c86.jpeg', dimensions: '150x80cm', roomTypes: ['kitchen'] },
      ]
    },
    dining: {
      tables: [
        { id: 'dining-table-6', name: '6-Seater Dining Table', category: 'tables', icon: Home, price: 42000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS051pXByjdvQ1uqwsyvdMEFjS89PwJXHzShg&s', dimensions: '180x90cm', roomTypes: ['dining'] },
        { id: 'dining-table-4', name: '4-Seater Dining Table', category: 'tables', icon: Home, price: 28000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo1gIfUJuyasNi5GrUeH1JJRIh3Bj1_ZpMcw&s', dimensions: '120x80cm', roomTypes: ['dining'] },
      ],
      seating: [
        { id: 'dining-chairs-6', name: 'Dining Chairs (Set of 6)', category: 'seating', icon: Armchair, price: 24000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS051pXByjdvQ1uqwsyvdMEFjS89PwJXHzShg&s', dimensions: '45x50cm each', roomTypes: ['dining'] },
        { id: 'dining-chairs-4', name: 'Dining Chairs (Set of 4)', category: 'seating', icon: Armchair, price: 16000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo1gIfUJuyasNi5GrUeH1JJRIh3Bj1_ZpMcw&s', dimensions: '45x50cm each', roomTypes: ['dining'] },
      ],
      storage: [
        { id: 'dining-cabinet', name: 'Dining Room Cabinet', category: 'storage', icon: Home, price: 38000, image: 'https://media.designcafe.com/wp-content/uploads/2019/12/20235011/dining-room-cabinets-for-your-home.jpg', dimensions: '160x85cm', roomTypes: ['dining'] },
      ]
    },
    office: {
      tables: [
        { id: 'office-desk-l', name: 'L-Shaped Office Desk', category: 'tables', icon: Home, price: 35000, image: 'https://images-cdn.ubuy.co.in/66e22ac7db5ca11b8d7b8155-tribesigns-71-inch-executive-desk-l.jpg', dimensions: '160x120cm', roomTypes: ['office'] },
        { id: 'office-desk-simple', name: 'Simple Office Desk', category: 'tables', icon: Home, price: 18000, image: 'https://stepearly.com/cdn/shop/products/falcon_desking.jpg?v=1623402473', dimensions: '120x60cm', roomTypes: ['office'] },
      ],
      seating: [
        { id: 'office-chair-executive', name: 'Executive Office Chair', category: 'seating', icon: Armchair, price: 22000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4C-eJIM9e1TsrWDij35pXx7sW18oXhzhhXQ&s', dimensions: '70x70cm', roomTypes: ['office'] },
        { id: 'office-chair-ergonomic', name: 'Ergonomic Desk Chair', category: 'seating', icon: Armchair, price: 15000, image: 'https://cdn.shopify.com/s/files/1/0044/1208/0217/files/MTRENVIHBSLTAN_900x.jpg?v=1747893311', dimensions: '65x65cm', roomTypes: ['office'] },
      ],
      storage: [
        { id: 'bookshelf-office', name: 'Office Bookshelf', category: 'storage', icon: Home, price: 28000, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBY0O0tpwTQmBOwn9k5yOLfbSFnfXRWIc2HhEIKEv1pezmbjdhi1OSemZ6b2BuCXn35VJ2Qz5iF4rgxEKtisEc1L6D60SojNoRfeFh6g33AcD1IQNaT_1Iw_d9S4ORKE2uMNvELEPM5r8/s1600/IMG_5382.jpg', dimensions: '80x200cm', roomTypes: ['office'] },
        { id: 'filing-cabinet', name: 'Filing Cabinet', category: 'storage', icon: Home, price: 15000, image: 'https://images-cdn.ubuy.co.in/6624136193df020e455782a6-space-solutions-18-deep-2-drawer-letter.jpg', dimensions: '40x80cm', roomTypes: ['office'] },
      ]
    }
  };

  // Get furniture for selected room
  const getCurrentRoomFurniture = () => {
    return allFurniture[selectedRoom as keyof typeof allFurniture] || {};
  };

  const wallColors = [
    { name: 'Pure White', color: '#ffffff' },
    { name: 'Warm White', color: '#f8f6f0' },
    { name: 'Light Gray', color: '#f1f5f9' },
    { name: 'Sage Green', color: '#87a96b' },
    { name: 'Soft Blue', color: '#bfdbfe' },
    { name: 'Beige', color: '#f5f5dc' },
    { name: 'Cream', color: '#fefcf3' },
    { name: 'Light Peach', color: '#ffeaa7' },
  ];

  const floorTypes = [
    { id: 'marble', name: 'Italian Marble', image: 'https://images.jdmagicbox.com/quickquotes/images_main/italian-beige-marble-slabs-2219807568-8ezklc32.jpg' },
    { id: 'hardwood', name: 'Oak Hardwood', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRpLpiEwjdKBg6lXaTYRN81bhGm_Wcs7pt9A&s' },
    { id: 'ceramic', name: 'Ceramic Tiles', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJVzwlIa14Me20E2qh7vJt8gwSD15i9kHn4w&s' },
    { id: 'granite', name: 'Granite Stone', image: 'https://img.edilportale.com/product-thumbs/h_prodotti-74318-rel4c4b538bcdbf401086bdc2ec720d8163.jpg' },
  ];

  const ceilingStyles = [
    { id: 'false-ceiling', name: 'False Ceiling', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ji0vihQFofPSIPflZ10yiiq5g0gMQ89BNQ&s' },
    { id: 'recessed-lights', name: 'Recessed Lighting', image: 'https://www.thespruce.com/thmb/sm5CZ1bbTFhXj0nI_MmQZvmWcKs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/before-you-buy-recessed-lights-2175005-1-4135a493ef234f048ba54a17b828cde1.jpg' },
    { id: 'exposed-beam', name: 'Exposed Beams', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsGGU593nh5JZXk7QnSpP15hEvJEaeutuuJQ&s' },
  ];

  const handleVideoUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid File",
        description: "Please upload a video file.",
        variant: "destructive"
      });
      return;
    }

    setUploadState('uploading');
    
    // Simulate upload
    setTimeout(() => {
      setUploadState('processing');
      
      // Simulate AI processing
      setTimeout(() => {
        setUploadState('complete');
        toast({
          title: "Room Analysis Complete",
          description: "Your room has been converted to a 2.5D model!"
        });
      }, 3000);
    }, 2000);
  }, [toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoUpload(file);
    }
  }, [handleVideoUpload]);

  const handleDragStart = (furniture: FurnitureItem) => {
    setSelectedFurniture(furniture.id);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedFurniture) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check for collisions (simplified logic)
    const isNearDoor = x > 45 && x < 55 && y > 90;
    if (isNearDoor) {
      setCollisionAlert("Cannot place furniture near door path!");
      setTimeout(() => setCollisionAlert(null), 3000);
      return;
    }

    const newItem: PlacedItem = {
      id: `${selectedFurniture}-${Date.now()}`,
      furnitureId: selectedFurniture,
      x,
      y,
      rotation: 0,
      scale: 1
    };

    setPlacedItems(prev => [...prev, newItem]);
    setSelectedFurniture(null);
    
    toast({
      title: "Furniture Placed",
      description: "Item added to your room design!"
    });
  };

  const removeItem = (itemId: string) => {
    setPlacedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getFurnitureById = (id: string) => {
    for (const roomFurniture of Object.values(allFurniture)) {
      for (const category of Object.values(roomFurniture)) {
        const found = category.find(item => item.id === id);
        if (found) return found;
      }
    }
    return null;
  };

  const getCartItems = () => {
    return placedItems.map(item => {
      const furniture = getFurnitureById(item.furnitureId);
      return {
        ...item,
        furniture: furniture
      };
    }).filter(item => item.furniture);
  };

  const calculateCartTotal = () => {
    return getCartItems().reduce((total, item) => total + (item.furniture?.price || 0), 0);
  };

  const hasFurnitureOnly = () => {
    const cartItems = getCartItems();
    return cartItems.every(item => 
      item.furniture?.category === 'seating' || 
      item.furniture?.category === 'storage' || 
      item.furniture?.category === 'beds' ||
      item.furniture?.category === 'tables'
    );
  };

  const hasNonFurnitureItems = () => {
    const cartItems = getCartItems();
    return cartItems.some(item => 
      item.furniture?.category === 'appliances' ||
      item.furniture?.category === 'paint' ||
      item.furniture?.category === 'utilities'
    );
  };

  const handleCheckout = () => {
    if (placedItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add some furniture to your room before checkout.",
        variant: "destructive",
      });
      return;
    }

    // Generate mock order ID
    const orderId = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    
    toast({
      title: "Processing Payment...",
      description: "Redirecting to payment gateway.",
    });

    // Mock payment process - redirect to success page after 2 seconds
    setTimeout(() => {
      // Store order details in localStorage for the success page
      const orderDetails = {
        orderId,
        items: getCartItems(),
        total: calculateCartTotal(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      
      toast({
        title: "Payment Successful!",
        description: `Order ${orderId} has been confirmed.`,
      });
      
      // Redirect to order success page
      window.location.href = '/order-success';
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4">
        {/* First Row - Dashboard Button and Room Studio 2.5D Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <h2 className="text-xl font-bold text-slate-800">Room Studio 2.5D</h2>
          </div>
        </div>

        {/* Second Row - Room Type Selector */}
        <div className="flex items-center gap-3 mb-4">
          <Label className="text-sm font-medium text-slate-700 whitespace-nowrap">Room Type:</Label>
          <div className="flex gap-2">
            {roomTypes.map(room => (
              <Button
                key={room.id}
                variant={selectedRoom === room.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedRoom(room.id);
                  setPlacedItems([]); // Clear placed items when changing room
                  toast({
                    title: `Switched to ${room.name}`,
                    description: room.description
                  });
                }}
                className={`${selectedRoom === room.id ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                data-testid={`button-room-${room.id}`}
              >
                <room.icon className="w-4 h-4 mr-2" />
                {room.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Third Row - 5 Small Icons */}
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRoomRotation(prev => prev - 15)}
            data-testid="button-rotate-left"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRoomRotation(prev => prev + 15)}
            data-testid="button-rotate-right"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRoomZoom(prev => Math.min(prev + 0.1, 2))}
            data-testid="button-zoom-in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRoomZoom(prev => Math.max(prev - 0.1, 0.5))}
            data-testid="button-zoom-out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? "bg-teal-50 border-teal-200" : ""}
            data-testid="button-toggle-grid"
          >
            <Grid className="w-4 h-4" />
          </Button>
        </div>

        {/* Fourth Row - Buttons with Checkout */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-save-design">
              <Save className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Save Design</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button variant="outline" size="sm" data-testid="button-reset-layout">
              <RotateCcw className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Reset Layout</span>
              <span className="sm:hidden">Reset</span>
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white" size="sm" data-testid="button-auto-design">
              <Sparkles className="w-4 h-4 mr-1" />
              <span className="hidden lg:inline">Smart Auto-Design</span>
              <span className="lg:hidden">Auto-Design</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/book-consultation'} data-testid="button-book-designer">
              <UserCheck className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Book Designer</span>
              <span className="sm:hidden">Book</span>
            </Button>
            <Button variant="outline" size="sm" data-testid="button-export-preview">
              <Download className="w-4 h-4 mr-1" />
              <span className="hidden lg:inline">Export Preview</span>
              <span className="lg:hidden">Export</span>
            </Button>
          </div>
          
          {/* Checkout Buttons */}
          {placedItems.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{placedItems.length} items</span>
                <span className="font-bold text-emerald-600">
                  ₹{(calculateCartTotal() / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCart(!showCart)}
                  data-testid="button-view-details"
                >
                  {showCart ? 'Hide Details' : 'View Details'}
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                  onClick={handleCheckout}
                  data-testid="button-checkout-top"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Checkout & Install
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Furniture */}
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">
                {roomTypes.find(r => r.id === selectedRoom)?.name} Furniture
              </h3>
              <Badge variant="outline" className="text-xs">
                {Object.values(getCurrentRoomFurniture()).reduce((total, category) => total + category.length, 0)} items
              </Badge>
            </div>
            
            {Object.keys(getCurrentRoomFurniture()).length > 0 ? (
              <Tabs defaultValue={Object.keys(getCurrentRoomFurniture())[0]}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  {Object.keys(getCurrentRoomFurniture()).slice(0, 2).map(category => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(getCurrentRoomFurniture()).map(([category, items]) => (
                  <TabsContent key={category} value={category}>
                    <div className="space-y-3">
                      {items.map((item: FurnitureItem) => (
                        <Card 
                          key={item.id} 
                          className={`cursor-pointer transition-all hover:shadow-md ${selectedFurniture === item.id ? 'ring-2 ring-teal-500' : ''}`}
                          onClick={() => handleDragStart(item)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <p className="text-xs text-slate-500">{item.dimensions}</p>
                                <p className="text-sm font-semibold text-teal-600">₹{(item.price / 1000).toFixed(0)}K</p>
                              </div>
                              <item.icon className="w-5 h-5 text-slate-400" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
                
                {/* Additional categories if more than 2 */}
                {Object.keys(getCurrentRoomFurniture()).length > 2 && (
                  <div className="mt-6">
                    {Object.entries(getCurrentRoomFurniture()).slice(2).map(([category, items]) => (
                      <div key={category} className="mb-4">
                        <h4 className="font-semibold text-slate-800 mb-3 capitalize">{category}</h4>
                        <div className="space-y-3">
                          {items.map((item: FurnitureItem) => (
                            <Card 
                              key={item.id} 
                              className={`cursor-pointer transition-all hover:shadow-md ${selectedFurniture === item.id ? 'ring-2 ring-teal-500' : ''}`}
                              onClick={() => handleDragStart(item)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center space-x-3">
                                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{item.name}</h4>
                                    <p className="text-xs text-slate-500">{item.dimensions}</p>
                                    <p className="text-sm font-semibold text-teal-600">₹{(item.price / 1000).toFixed(0)}K</p>
                                  </div>
                                  <item.icon className="w-5 h-5 text-slate-400" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tabs>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Home className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No furniture available for this room type</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - 2.5D Room View */}
        <div className="flex-1 relative">
          {/* Video Upload State */}
          {uploadState === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-lg p-12 cursor-pointer hover:border-teal-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload Room Video</h3>
                  <p className="text-slate-500 mb-4">Upload a video of your room to generate a 2.5D model</p>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Video File
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {uploadState === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Uploading Video...</h3>
                <p className="text-slate-500">Please wait while we process your file</p>
              </div>
            </div>
          )}

          {uploadState === 'processing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <div className="animate-pulse bg-gradient-to-r from-purple-400 to-pink-400 h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">AI Processing Room...</h3>
                <p className="text-slate-500">Converting to 2.5D model and analyzing space</p>
                <div className="w-64 bg-slate-200 rounded-full h-2 mx-auto mt-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          )}

          {uploadState === 'complete' && (
            <div 
              ref={canvasRef}
              className="h-full relative overflow-hidden cursor-crosshair"
              onClick={handleCanvasClick}
              style={{
                backgroundImage: `url(${emptyRoomImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `rotate(${roomRotation}deg) scale(${roomZoom})`,
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Placed Furniture Items */}
              {placedItems.map(item => {
                const furniture = getFurnitureById(item.furnitureId);
                if (!furniture) return null;

                return (
                  <div
                    key={item.id}
                    className="absolute w-16 h-16 bg-white bg-opacity-90 rounded-lg shadow-lg border-2 border-teal-400 flex items-center justify-center cursor-move group"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                    }}
                  >
                    <img 
                      src={furniture.image} 
                      alt={furniture.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <button
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}

              {/* Collision Alert */}
              {collisionAlert && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 animate-bounce">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{collisionAlert}</span>
                </div>
              )}

              {/* Selection Hint */}
              {selectedFurniture && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Move className="w-4 h-4" />
                  <span className="text-sm">Click anywhere to place {getFurnitureById(selectedFurniture)?.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Walls & Utilities */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 mb-4">Walls & Utilities</h3>
            
            <Tabs defaultValue="walls">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="walls">Walls</TabsTrigger>
                <TabsTrigger value="utilities">Utilities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="walls">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">Wall Paint Colors</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {wallColors.map(color => (
                        <div
                          key={color.color}
                          className={`w-12 h-12 rounded-lg cursor-pointer border-2 transition-all ${
                            selectedWallColor === color.color ? 'border-teal-500 ring-2 ring-teal-200' : 'border-slate-200 hover:border-slate-300'
                          }`}
                          style={{ backgroundColor: color.color }}
                          onClick={() => setSelectedWallColor(color.color)}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Selected: {wallColors.find(c => c.color === selectedWallColor)?.name}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">Wallpaper Textures</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Brick', 'Wood', 'Marble', 'Fabric'].map(texture => (
                        <Button key={texture} variant="outline" size="sm" className="h-auto p-2">
                          <div className="text-center">
                            <Palette className="w-4 h-4 mx-auto mb-1" />
                            <span className="text-xs">{texture}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="utilities">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-3 block">Switches & Sockets</Label>
                    <div className="space-y-2">
                      {['Light Switch', 'Power Socket', 'USB Socket', 'Fan Regulator'].map(item => (
                        <Button key={item} variant="outline" size="sm" className="w-full justify-start">
                          <Layers className="w-4 h-4 mr-2" />
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Cart Details (Simplified) */}
      {placedItems.length > 0 && showCart && (
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-800 flex items-center mb-3">
              <ShoppingCart className="w-5 h-5 mr-2 text-emerald-600" />
              Cart Details ({placedItems.length} items)
            </h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCart(false)}
              data-testid="button-hide-cart"
              className="mb-3"
            >
              Hide Details
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-40 overflow-y-auto">
            {getCartItems().map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <img 
                  src={item.furniture?.image} 
                  alt={item.furniture?.name} 
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{item.furniture?.name}</h5>
                  <p className="text-xs text-slate-500">{item.furniture?.dimensions}</p>
                  <p className="text-sm font-semibold text-emerald-600">
                    ₹{((item.furniture?.price || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  data-testid={`button-remove-${item.id}`}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Flooring Panel - Only show when no cart items */}
      {placedItems.length === 0 && (
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex space-x-8">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 mb-3">Flooring Options</h4>
              <div className="flex space-x-4">
                {floorTypes.map(floor => (
                  <div
                    key={floor.id}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      selectedFloorType === floor.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedFloorType(floor.id)}
                    data-testid={`button-floor-${floor.id}`}
                  >
                    <img src={floor.image} alt={floor.name} className="w-16 h-16 object-cover rounded mb-2" />
                    <p className="text-sm font-medium text-center">{floor.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 mb-3">Ceiling Styles</h4>
              <div className="flex space-x-4">
                {ceilingStyles.map(ceiling => (
                  <div
                    key={ceiling.id}
                    className="cursor-pointer p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all"
                    data-testid={`button-ceiling-${ceiling.id}`}
                  >
                    <img src={ceiling.image} alt={ceiling.name} className="w-16 h-16 object-cover rounded mb-2" />
                    <p className="text-sm font-medium text-center">{ceiling.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}