import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Car,
  Gamepad2,
  Scissors,
  Camera,
  Bike,
  Laptop,
  MoreHorizontal,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Palette,
  Bike as BikeIcon,
  Car as CarIcon,
  Gamepad2 as Gamepad2Icon,
  Scissors as ScissorsIcon,
  Camera as CameraIcon,
  Laptop as LaptopIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
} from 'lucide-react';

interface RentalItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  status: 'available' | 'rented' | 'maintenance';
  image: string;
  totalUnits: number;
  availableUnits: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export function RentalManagement() {
  const [activeTab, setActiveTab] = useState('items');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data statis untuk ikon dan warna
  const categoryIcons: { [key: string]: any } = {
    'car': CarIcon,
    'gaming': Gamepad2Icon,
    'scissors': ScissorsIcon,
    'camera': CameraIcon,
    'bike': BikeIcon,
    'laptop': LaptopIcon,
    'other': CircleIcon,
  };

  const categoryColors = [
    { id: 'bg-blue-500', name: 'Biru' },
    { id: 'bg-purple-500', name: 'Ungu' },
    { id: 'bg-yellow-500', name: 'Kuning' },
    { id: 'bg-green-500', name: 'Hijau' },
    { id: 'bg-cyan-500', name: 'Cyan' },
    { id: 'bg-red-500', name: 'Merah' },
  ];

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      return { id: 'unknown', name: 'Tidak Diketahui', icon: XCircle, color: 'bg-gray-500', description: '' };
    }
    return {
      ...category,
      icon: categoryIcons[category.icon] || XCircle,
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rented':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // State untuk form tambah item
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    description: '',
    pricePerHour: '',
    pricePerDay: '',
    totalUnits: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // State untuk form tambah kategori
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '',
    color: '',
    description: '',
  });

  // Effect untuk mengambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      const token = 'YOUR_AUTH_TOKEN_HERE'; // Ganti dengan token otentikasi nyata
      
      try {
        // Ambil data categories
        const categoriesRes = await fetch('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories);

        // Ambil data items
        const mockItems: RentalItem[] = [
          {
            id: 'item-1',
            name: 'Kamera DSLR Canon',
            category: 'photography',
            description: 'Kamera profesional untuk hasil maksimal.',
            pricePerHour: 50000,
            pricePerDay: 300000,
            status: 'available', // Tipe literal string yang benar
            image: 'https://placehold.co/300x200/cccccc/333333?text=Kamera',
            totalUnits: 5,
            availableUnits: 3,
          },
          {
            id: 'item-2',
            name: 'PlayStation 5',
            category: 'gaming',
            description: 'Konsol game generasi terbaru dengan grafis memukau.',
            pricePerHour: 40000,
            pricePerDay: 250000,
            status: 'rented', // Tipe literal string yang benar
            image: 'https://placehold.co/300x200/444444/ffffff?text=PS5',
            totalUnits: 3,
            availableUnits: 0,
          },
        ];
        setRentalItems(mockItems);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.pricePerHour) return;

    setIsUploading(true);
    setError(null);
    const token = 'YOUR_AUTH_TOKEN_HERE';
    let imageUrl = 'https://placehold.co/300x200/cccccc/333333?text=No+Image';

    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        // Contoh: Mengirim ke API upload (seperti yang dibuat sebelumnya)
        // Anda harus mengaktifkan kode ini di lingkungan produksi
        // const uploadRes = await fetch('/api/upload', {
        //   method: 'POST',
        //   headers: { Authorization: `Bearer ${token}` },
        //   body: formData,
        // });
        // if (!uploadRes.ok) throw new Error('Failed to upload image');
        // const uploadResult = await uploadRes.json();
        // imageUrl = uploadResult.url;
      }

      // Simulasi penambahan item
      const newItemWithImage: RentalItem = {
        id: `item-${Date.now()}`,
        ...newItem,
        pricePerHour: parseFloat(newItem.pricePerHour),
        pricePerDay: parseFloat(newItem.pricePerDay) || 0,
        totalUnits: parseInt(newItem.totalUnits) || 1,
        availableUnits: parseInt(newItem.totalUnits) || 1,
        image: imageUrl,
        status: 'available',
      };
      setRentalItems(prev => [...prev, newItemWithImage]);


      // Reset form dan modal
      setNewItem({ name: '', category: '', description: '', pricePerHour: '', pricePerDay: '', totalUnits: '' });
      setSelectedImage(null);
      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      setError('Gagal menambahkan item: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.icon || !newCategory.color) return;

    setIsUploading(true);
    setError(null);
    const token = 'YOUR_AUTH_TOKEN_HERE';

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCategory),
      });

      if (!res.ok) throw new Error('Failed to add category');
      
      const result = await res.json();
      setCategories(prev => [...prev, result.category]);

      // Reset form dan modal
      setNewCategory({ name: '', icon: '', color: '', description: '' });
      setShowCategoryModal(false);
    } catch (err: any) {
      console.error(err);
      setError('Gagal menambahkan kategori: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredItems = rentalItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    {
      title: 'Total Item',
      value: rentalItems.length.toString(),
      subtitle: `${categories.length} kategori`,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Tersedia',
      value: rentalItems.filter(item => item.status === 'available').length.toString(),
      subtitle: 'Siap disewa',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Disewakan',
      value: rentalItems.filter(item => item.status === 'rented').length.toString(),
      subtitle: 'Sedang aktif',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Maintenance',
      value: rentalItems.filter(item => item.status === 'maintenance').length.toString(),
      subtitle: 'Perlu perbaikan',
      icon: AlertCircle,
      color: 'bg-red-500'
    }
  ];

  if (isLoading) {
    return <div className="text-center py-12 text-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'items', label: 'Daftar Item' },
            { id: 'categories', label: 'Kategori' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'items' && (
        <>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari item rental..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item
            </Button>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const categoryInfo = getCategoryInfo(item.category);
              return (
                <Card key={item.id} className="card-shadow hover:card-shadow-lg transition-all">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {React.createElement(categoryInfo.icon, { className: "w-3 h-3 mr-1" })}
                        {categoryInfo.name}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <span className="text-xs capitalize text-muted-foreground">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Per jam:</span>
                        <span className="font-medium">{formatCurrency(item.pricePerHour)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Per hari:</span>
                        <span className="font-medium">{formatCurrency(item.pricePerDay)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tersedia:</span>
                        <span className="font-medium">{item.availableUnits}/{item.totalUnits} unit</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada item ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter pencarian atau tambah item baru</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-foreground">Kategori Rental</h3>
              <p className="text-muted-foreground">Kelola kategori untuk mengorganisir item rental</p>
            </div>
            <Button onClick={() => setShowCategoryModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const itemCount = rentalItems.filter(item => item.category === category.id).length;
              const { icon: CategoryIcon } = getCategoryInfo(category.id);
              return (
                <Card key={category.id} className="card-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                        {React.createElement(CategoryIcon, { className: "w-6 h-6 text-white" })}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {itemCount} item
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Item Terpopuler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rentalItems.slice(0, 5).map((item, index) => {
                  const categoryInfo = getCategoryInfo(item.category);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        {React.createElement(categoryInfo.icon, { className: "w-5 h-5 text-muted-foreground" })}
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{categoryInfo.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{formatCurrency(item.pricePerDay)}</p>
                        <p className="text-xs text-muted-foreground">per hari</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Kategori Terpopuler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.slice(0, 5).map((category, index) => {
                  const itemCount = rentalItems.filter(item => item.category === category.id).length;
                  const { icon: CategoryIcon } = getCategoryInfo(category.id);
                  return (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                          {React.createElement(CategoryIcon, { className: "w-4 h-4 text-white" })}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{itemCount}</p>
                        <p className="text-xs text-muted-foreground">item</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Tambah Item Rental Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Nama Item</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masukkan nama item"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-category">Kategori</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              {React.createElement(getCategoryInfo(category.id).icon, { className: "w-4 h-4" })}
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-hour">Harga per Jam</Label>
                    <Input
                      id="price-hour"
                      type="number"
                      value={newItem.pricePerHour}
                      onChange={(e) => setNewItem(prev => ({ ...prev, pricePerHour: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-day">Harga per Hari</Label>
                    <Input
                      id="price-day"
                      type="number"
                      value={newItem.pricePerDay}
                      onChange={(e) => setNewItem(prev => ({ ...prev, pricePerDay: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total-units">Total Unit</Label>
                    <Input
                      id="total-units"
                      type="number"
                      value={newItem.totalUnits}
                      onChange={(e) => setNewItem(prev => ({ ...prev, totalUnits: e.target.value }))}
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-image">Gambar Item</Label>
                  <Input
                    id="item-image"
                    type="file"
                    onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
                  />
                  {selectedImage && (
                    <p className="text-sm text-muted-foreground mt-1">File dipilih: {selectedImage.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-description">Deskripsi</Label>
                  <Textarea
                    id="item-description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Masukkan deskripsi item"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} disabled={isUploading}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isUploading}>
                    {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengunggah...</> : 'Simpan Item'}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-xl mx-4">
            <CardHeader>
              <CardTitle>Tambah Kategori Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Nama Kategori</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Fotografi, Kendaraan"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-icon">Ikon</Label>
                    <Select value={newCategory.icon} onValueChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ikon" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryIcons).map(([key, Icon]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {React.createElement(Icon, { className: "w-4 h-4" })}
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category-color">Warna</Label>
                    <Select value={newCategory.color} onValueChange={(value) => setNewCategory(prev => ({ ...prev, color: value }))} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih warna" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryColors.map(color => (
                          <SelectItem key={color.id} value={color.id}>
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full ${color.id}`}></span>
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi singkat tentang kategori"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCategoryModal(false)} disabled={isUploading}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isUploading}>
                    {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Kategori'}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
