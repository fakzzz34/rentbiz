import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Clock,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  canLogin: boolean;
  shift: 'pagi' | 'siang' | 'malam' | 'flexible';
  joinDate: string;
  lastDeposit: string;
  totalDeposits: number;
  lastLogin: string;
  permissions: string[];
}

export function OperatorManagement() {
  const [newOperator, setNewOperator] = useState({
    name: '',
    email: '',
    phone: '',
    shift: 'pagi' as 'pagi' | 'siang' | 'malam' | 'flexible'
  });

  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  // Mock data - in real app, this would come from Supabase
  const [operators] = useState<Operator[]>([
    {
      id: '1',
      name: 'Ahmad Operator A',
      email: 'ahmad@email.com',
      phone: '081234567890',
      status: 'active',
      canLogin: true,
      shift: 'pagi',
      joinDate: '2024-01-15',
      lastDeposit: '2024-12-19',
      totalDeposits: 45000000,
      lastLogin: '2024-12-19 08:30',
      permissions: ['deposit', 'view_reports']
    },
    {
      id: '2',
      name: 'Siti Operator B',
      email: 'siti@email.com',
      phone: '081234567891',
      status: 'active',
      canLogin: false,
      shift: 'siang',
      joinDate: '2024-02-20',
      lastDeposit: '2024-12-18',
      totalDeposits: 38500000,
      lastLogin: '2024-12-18 14:15',
      permissions: ['deposit']
    },
    {
      id: '3',
      name: 'Budi Operator C',
      email: 'budi@email.com',
      phone: '081234567892',
      status: 'suspended',
      canLogin: false,
      shift: 'malam',
      joinDate: '2024-03-10',
      lastDeposit: '2024-12-15',
      totalDeposits: 25000000,
      lastLogin: '2024-12-15 22:00',
      permissions: ['deposit']
    }
  ]);

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, save to Supabase
    console.log('Add operator:', newOperator);
    // Reset form
    setNewOperator({
      name: '',
      email: '',
      phone: '',
      shift: 'pagi'
    });
  };

  const getStatusBadge = (status: Operator['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Tidak Aktif</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getShiftBadge = (shift: Operator['shift']) => {
    const colors = {
      pagi: 'bg-blue-100 text-blue-800 border-blue-200',
      siang: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      malam: 'bg-purple-100 text-purple-800 border-purple-200',
      flexible: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      pagi: 'Pagi (06:00-14:00)',
      siang: 'Siang (14:00-22:00)',
      malam: 'Malam (22:00-06:00)',
      flexible: 'Flexible'
    };

    return (
      <Badge className={colors[shift]}>
        {labels[shift]}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-foreground">Manajemen Operator</h2>
          <p className="text-muted-foreground">Kelola operator, akses login, dan monitor performa</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Operator</p>
                <p className="text-2xl font-bold text-foreground">{operators.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {operators.filter(op => op.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dapat Login</p>
                <p className="text-2xl font-bold text-primary">
                  {operators.filter(op => op.canLogin).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-destructive">
                  {operators.filter(op => op.status === 'suspended').length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operator List */}
        <div className="lg:col-span-2">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Daftar Operator</CardTitle>
              <CardDescription>
                Kelola status dan akses operator bisnis Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operators.map((operator) => (
                  <div
                    key={operator.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOperator === operator.id 
                        ? 'border-primary bg-accent' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setSelectedOperator(
                      selectedOperator === operator.id ? null : operator.id
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{operator.name}</h4>
                        <p className="text-sm text-muted-foreground">{operator.email}</p>
                        <p className="text-sm text-muted-foreground">{operator.phone}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(operator.status)}
                        {getShiftBadge(operator.shift)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Bergabung</p>
                        <p className="font-medium text-foreground">{formatDate(operator.joinDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Setoran</p>
                        <p className="font-medium text-foreground">{formatCurrency(operator.totalDeposits)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Login Terakhir</p>
                        <p className="font-medium text-foreground">{formatDateTime(operator.lastLogin)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status Login</p>
                        <p className={`font-medium ${operator.canLogin ? 'text-green-600' : 'text-destructive'}`}>
                          {operator.canLogin ? 'Dapat Login' : 'Tidak Dapat Login'}
                        </p>
                      </div>
                    </div>

                    {selectedOperator === operator.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={operator.canLogin}
                              onCheckedChange={() => {}}
                            />
                            <Label className="text-sm">Izinkan Login</Label>
                          </div>
                          
                          <Select defaultValue={operator.status}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="inactive">Tidak Aktif</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                            Reset Login
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive border-red-200">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </Button>
                        </div>

                        {!operator.canLogin && (
                          <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              <p className="text-sm text-yellow-800">
                                Operator tidak dapat login karena belum menyelesaikan setoran kemarin.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Operator */}
        <div>
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Tambah Operator Baru</CardTitle>
              <CardDescription>
                Daftarkan operator baru untuk bisnis Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddOperator} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="op-name">Nama Lengkap</Label>
                  <Input
                    id="op-name"
                    value={newOperator.name}
                    onChange={(e) => setNewOperator({...newOperator, name: e.target.value})}
                    placeholder="Ahmad Operator"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="op-email">Email</Label>
                  <Input
                    id="op-email"
                    type="email"
                    value={newOperator.email}
                    onChange={(e) => setNewOperator({...newOperator, email: e.target.value})}
                    placeholder="ahmad@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="op-phone">No. HP</Label>
                  <Input
                    id="op-phone"
                    value={newOperator.phone}
                    onChange={(e) => setNewOperator({...newOperator, phone: e.target.value})}
                    placeholder="081234567890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="op-shift">Shift Kerja</Label>
                  <Select 
                    value={newOperator.shift} 
                    onValueChange={(value: 'pagi' | 'siang' | 'malam' | 'flexible') => 
                      setNewOperator({...newOperator, shift: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagi">Pagi (06:00-14:00)</SelectItem>
                      <SelectItem value="siang">Siang (14:00-22:00)</SelectItem>
                      <SelectItem value="malam">Malam (22:00-06:00)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-accent p-4 rounded-lg border border-border">
                  <h4 className="font-semibold text-accent-foreground mb-2">Info Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Password default akan dikirim ke email operator. 
                    Operator wajib mengubah password saat login pertama.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Operator
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Operator Permissions */}
          <Card className="mt-6 card-shadow">
            <CardHeader>
              <CardTitle>Pengaturan Akses</CardTitle>
              <CardDescription>
                Atur hak akses operator secara global
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-suspend setelah 3 hari tidak setor</Label>
                    <p className="text-sm text-muted-foreground">Otomatis suspend operator yang tidak setor</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Notifikasi reminder setoran</Label>
                    <p className="text-sm text-muted-foreground">Kirim reminder setiap hari jam 6 pagi</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Izinkan akses laporan</Label>
                    <p className="text-sm text-muted-foreground">Operator dapat melihat laporan pribadi</p>
                  </div>
                  <Switch />
                </div>

                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                    <Shield className="w-4 h-4" />
                    Keamanan Sistem
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Login hanya diizinkan setelah setoran kemarin diselesaikan</li>
                    <li>• Sistem bypass manual hanya dapat dilakukan oleh owner</li>
                    <li>• Log aktivitas semua operator tersimpan secara otomatis</li>
                    <li>• Notifikasi real-time untuk setiap transaksi operator</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}