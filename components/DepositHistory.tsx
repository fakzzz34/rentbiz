import React, { useState } from 'react';
import { Calendar, Search, Filter, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DepositRecord {
  id: number;
  date: string;
  operator: string;
  cashAmount: number;
  qrisAmount: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'rejected';
  type: 'auto' | 'manual';
  notes?: string;
  confirmationTime?: string;
}

export function DepositHistory() {
  const [deposits] = useState<DepositRecord[]>([
    {
      id: 1,
      date: '2024-01-15',
      operator: 'Ahmad Rizki',
      cashAmount: 100000,
      qrisAmount: 50000,
      totalAmount: 150000,
      status: 'confirmed',
      type: 'auto',
      confirmationTime: '2024-01-15 14:30'
    },
    {
      id: 2,
      date: '2024-01-15',
      operator: 'Siti Nurhaliza',
      cashAmount: 0,
      qrisAmount: 100000,
      totalAmount: 100000,
      status: 'confirmed',
      type: 'auto',
      confirmationTime: '2024-01-15 13:15'
    },
    {
      id: 3,
      date: '2024-01-15',
      operator: 'Budi Santoso',
      cashAmount: 75000,
      qrisAmount: 0,
      totalAmount: 75000,
      status: 'pending',
      type: 'auto'
    },
    {
      id: 4,
      date: '2024-01-14',
      operator: 'Ahmad Rizki',
      cashAmount: 120000,
      qrisAmount: 30000,
      totalAmount: 150000,
      status: 'confirmed',
      type: 'manual',
      notes: 'Setoran manual oleh owner',
      confirmationTime: '2024-01-14 18:00'
    },
    {
      id: 5,
      date: '2024-01-14',
      operator: 'Dewi Sartika',
      cashAmount: 80000,
      qrisAmount: 20000,
      totalAmount: 100000,
      status: 'rejected',
      type: 'auto',
      notes: 'Jumlah tidak sesuai dengan laporan'
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Dikonfirmasi
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type === 'auto' ? 'Otomatis' : 'Manual'}
      </Badge>
    );
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = filters.search === '' || 
      deposit.operator.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || deposit.status === filters.status;
    const matchesType = filters.type === 'all' || deposit.type === filters.type;
    
    const matchesDateFrom = filters.dateFrom === '' || deposit.date >= filters.dateFrom;
    const matchesDateTo = filters.dateTo === '' || deposit.date <= filters.dateTo;

    return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
  });

  const totalDeposits = filteredDeposits.reduce((sum, deposit) => sum + deposit.totalAmount, 0);
  const confirmedDeposits = filteredDeposits
    .filter(deposit => deposit.status === 'confirmed')
    .reduce((sum, deposit) => sum + deposit.totalAmount, 0);

  const exportToCSV = () => {
    const headers = ['Tanggal', 'Operator', 'Tunai', 'QRIS', 'Total', 'Status', 'Tipe', 'Catatan'];
    const csvContent = [
      headers.join(','),
      ...filteredDeposits.map(deposit => [
        deposit.date,
        deposit.operator,
        deposit.cashAmount,
        deposit.qrisAmount,
        deposit.totalAmount,
        deposit.status,
        deposit.type,
        deposit.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `deposit-history-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Setoran</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDeposits)}</p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredDeposits.length} transaksi
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terkonfirmasi</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(confirmedDeposits)}</p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredDeposits.filter(d => d.status === 'confirmed').length} transaksi
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(filteredDeposits.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.totalAmount, 0))}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {filteredDeposits.filter(d => d.status === 'pending').length} transaksi
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter & Pencarian
            </span>
            <Button onClick={exportToCSV} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cari Operator</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nama operator..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe</label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="auto">Otomatis</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Dari</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Sampai</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposit History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Setoran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDeposits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada data setoran yang sesuai dengan filter</p>
              </div>
            ) : (
              filteredDeposits.map((deposit) => (
                <div key={deposit.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{deposit.operator}</h4>
                        <p className="text-sm text-gray-600">{deposit.date}</p>
                        {deposit.confirmationTime && (
                          <p className="text-xs text-gray-500">
                            Dikonfirmasi: {deposit.confirmationTime}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(deposit.totalAmount)}</p>
                      <div className="flex items-center space-x-2 mt-1 justify-end">
                        {getTypeBadge(deposit.type)}
                        {getStatusBadge(deposit.status)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tunai: </span>
                        <span className="font-medium">{formatCurrency(deposit.cashAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">QRIS: </span>
                        <span className="font-medium">{formatCurrency(deposit.qrisAmount)}</span>
                      </div>
                    </div>
                    
                    {deposit.notes && (
                      <div className="mt-2">
                        <span className="text-gray-600 text-sm">Catatan: </span>
                        <span className="text-sm">{deposit.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}