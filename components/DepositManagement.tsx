import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../hooks/useAuth';
import { 
  Plus, 
  QrCode, 
  Banknote, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Deposit {
  id: string;
  date: string;
  operator: string;
  cashAmount: number;
  qrisAmount: number;
  totalRequired: number;
  status: 'pending' | 'completed' | 'manual_override';
  shift: 'pagi' | 'siang' | 'malam';
  notes?: string;
}

export function DepositManagement() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  
  const [newDeposit, setNewDeposit] = useState({
    cashAmount: '',
    qrisAmount: '',
    shift: 'pagi' as 'pagi' | 'siang' | 'malam',
    notes: ''
  });

  const [manualOverride, setManualOverride] = useState({
    operator: '',
    amount: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Mock data - in real app, this would come from Supabase
  const [deposits] = useState<Deposit[]>([
    {
      id: '1',
      date: '2024-12-19',
      operator: 'Operator A',
      cashAmount: 350000,
      qrisAmount: 150000,
      totalRequired: 500000,
      status: 'completed',
      shift: 'pagi'
    },
    {
      id: '2',
      date: '2024-12-19',
      operator: 'Operator B',
      cashAmount: 200000,
      qrisAmount: 0,
      totalRequired: 300000,
      status: 'pending',
      shift: 'siang',
      notes: 'QRIS bermasalah'
    },
    {
      id: '3',
      date: '2024-12-18',
      operator: 'Operator A',
      cashAmount: 0,
      qrisAmount: 0,
      totalRequired: 450000,
      status: 'manual_override',
      shift: 'malam',
      notes: 'Setor langsung ke owner'
    }
  ]);

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, save to Supabase
    console.log('Submit deposit:', newDeposit);
    // Reset form
    setNewDeposit({
      cashAmount: '',
      qrisAmount: '',
      shift: 'pagi',
      notes: ''
    });
  };

  const handleManualOverride = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, save to Supabase
    console.log('Manual override:', manualOverride);
    // Reset form
    setManualOverride({
      operator: '',
      amount: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getStatusBadge = (status: Deposit['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Selesai</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'manual_override':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><AlertTriangle className="w-3 h-3 mr-1" />Manual</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl text-gray-900">Manajemen Setoran</h2>
          <p className="text-gray-600">Kelola setoran tunai dan QRIS operator</p>
        </div>
      </div>

      <Tabs defaultValue="deposits" className="space-y-6">
        <TabsList>
          <TabsTrigger value="deposits">Riwayat Setoran</TabsTrigger>
          {!isOwner && <TabsTrigger value="new">Setoran Baru</TabsTrigger>}
          {isOwner && <TabsTrigger value="manual">Input Manual</TabsTrigger>}
        </TabsList>

        {/* Deposits List */}
        <TabsContent value="deposits" className="space-y-4">
          <div className="grid gap-4">
            {deposits.map((deposit) => (
              <Card key={deposit.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{deposit.operator}</h3>
                      <p className="text-sm text-gray-600">
                        {deposit.date} - Shift {deposit.shift.charAt(0).toUpperCase() + deposit.shift.slice(1)}
                      </p>
                    </div>
                    {getStatusBadge(deposit.status)}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tunai</p>
                        <p className="font-semibold">{formatCurrency(deposit.cashAmount)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">QRIS</p>
                        <p className="font-semibold">{formatCurrency(deposit.qrisAmount)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Total Wajib</p>
                      <p className="font-semibold">{formatCurrency(deposit.totalRequired)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Selisih</p>
                      <p className={`font-semibold ${
                        (deposit.cashAmount + deposit.qrisAmount) >= deposit.totalRequired 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency((deposit.cashAmount + deposit.qrisAmount) - deposit.totalRequired)}
                      </p>
                    </div>
                  </div>

                  {deposit.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Catatan:</strong> {deposit.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* New Deposit Form (Operator only) */}
        {!isOwner && (
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>Input Setoran Baru</CardTitle>
                <CardDescription>
                  Masukkan jumlah setoran tunai dan QRIS untuk shift hari ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitDeposit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shift">Shift</Label>
                      <Select 
                        value={newDeposit.shift} 
                        onValueChange={(value: 'pagi' | 'siang' | 'malam') => 
                          setNewDeposit({...newDeposit, shift: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pagi">Pagi (06:00 - 14:00)</SelectItem>
                          <SelectItem value="siang">Siang (14:00 - 22:00)</SelectItem>
                          <SelectItem value="malam">Malam (22:00 - 06:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cash">Setoran Tunai</Label>
                      <Input
                        id="cash"
                        type="number"
                        value={newDeposit.cashAmount}
                        onChange={(e) => setNewDeposit({...newDeposit, cashAmount: e.target.value})}
                        placeholder="350000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qris">Top Up QRIS</Label>
                      <Input
                        id="qris"
                        type="number"
                        value={newDeposit.qrisAmount}
                        onChange={(e) => setNewDeposit({...newDeposit, qrisAmount: e.target.value})}
                        placeholder="150000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Catatan (Opsional)</Label>
                      <Input
                        id="notes"
                        value={newDeposit.notes}
                        onChange={(e) => setNewDeposit({...newDeposit, notes: e.target.value})}
                        placeholder="Catatan tambahan..."
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Informasi Setoran</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Total Setoran:</span>
                        <span className="font-semibold ml-2">
                          {formatCurrency((parseInt(newDeposit.cashAmount) || 0) + (parseInt(newDeposit.qrisAmount) || 0))}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700">Status Login Besok:</span>
                        <span className={`font-semibold ml-2 ${
                          ((parseInt(newDeposit.cashAmount) || 0) + (parseInt(newDeposit.qrisAmount) || 0)) > 0 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {((parseInt(newDeposit.cashAmount) || 0) + (parseInt(newDeposit.qrisAmount) || 0)) > 0 ? 'Dapat Login' : 'Tidak Dapat Login'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Simpan Setoran
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Manual Override (Owner only) */}
        {isOwner && (
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Input Manual Setoran</CardTitle>
                <CardDescription>
                  Untuk setoran langsung dari operator ke owner (bypass system)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualOverride} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="manual-operator">Operator</Label>
                      <Select 
                        value={manualOverride.operator} 
                        onValueChange={(value) => setManualOverride({...manualOverride, operator: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operator-a">Operator A</SelectItem>
                          <SelectItem value="operator-b">Operator B</SelectItem>
                          <SelectItem value="operator-c">Operator C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manual-date">Tanggal</Label>
                      <Input
                        id="manual-date"
                        type="date"
                        value={manualOverride.date}
                        onChange={(e) => setManualOverride({...manualOverride, date: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manual-amount">Jumlah Setoran</Label>
                      <Input
                        id="manual-amount"
                        type="number"
                        value={manualOverride.amount}
                        onChange={(e) => setManualOverride({...manualOverride, amount: e.target.value})}
                        placeholder="500000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manual-notes">Keterangan</Label>
                      <Input
                        id="manual-notes"
                        value={manualOverride.notes}
                        onChange={(e) => setManualOverride({...manualOverride, notes: e.target.value})}
                        placeholder="Setor langsung ke owner"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-900">Peringatan</h4>
                    </div>
                    <p className="text-sm text-yellow-800">
                      Input manual akan mengizinkan operator login tanpa melalui sistem setoran otomatis. 
                      Pastikan setoran sudah diterima secara fisik.
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Konfirmasi Input Manual
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}