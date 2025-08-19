import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeMetric, setActiveMetric] = useState('revenue');

  const revenueData = [
    { name: 'Jan', revenue: 4500000, target: 5000000, items: 45 },
    { name: 'Feb', revenue: 5200000, target: 5000000, items: 52 },
    { name: 'Mar', revenue: 4800000, target: 5000000, items: 48 },
    { name: 'Apr', revenue: 5800000, target: 5500000, items: 58 },
    { name: 'May', revenue: 6200000, target: 5500000, items: 62 },
    { name: 'Jun', revenue: 5500000, target: 6000000, items: 55 },
    { name: 'Jul', revenue: 7200000, target: 6000000, items: 72 }
  ];

  const categoryData = [
    { name: 'Kendaraan', value: 35, color: '#4f46e5' },
    { name: 'Gaming', value: 25, color: '#06b6d4' },
    { name: 'Salon & Spa', value: 15, color: '#10b981' },
    { name: 'Fotografi', value: 12, color: '#f59e0b' },
    { name: 'Olahraga', value: 8, color: '#ef4444' },
    { name: 'Elektronik', value: 5, color: '#8b5cf6' }
  ];

  const hourlyData = [
    { hour: '00:00', rentals: 2 },
    { hour: '03:00', rentals: 1 },
    { hour: '06:00', rentals: 8 },
    { hour: '09:00', rentals: 25 },
    { hour: '12:00', rentals: 45 },
    { hour: '15:00', rentals: 38 },
    { hour: '18:00', rentals: 52 },
    { hour: '21:00', rentals: 28 }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: 'Rp 45.2M',
      change: '+12.5%',
      isPositive: true,
      description: 'vs bulan lalu',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Transaksi',
      value: '1,247',
      change: '+8.2%',
      isPositive: true,
      description: 'transaksi berhasil',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      title: 'Rata-rata per Hari',
      value: 'Rp 1.5M',
      change: '+5.1%',
      isPositive: true,
      description: 'pendapatan harian',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Tingkat Okupansi',
      value: '78%',
      change: '+3.2%',
      isPositive: true,
      description: 'item tersewa',
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

  const topItems = [
    { name: 'PlayStation 5', revenue: 12500000, rentals: 125, category: 'Gaming' },
    { name: 'Honda Beat 2020', revenue: 9800000, rentals: 98, category: 'Kendaraan' },
    { name: 'Canon EOS R6', revenue: 8500000, rentals: 45, category: 'Fotografi' },
    { name: 'Hair Dryer Pro', revenue: 6200000, rentals: 124, category: 'Salon & Spa' },
    { name: 'Mountain Bike', revenue: 4800000, rentals: 67, category: 'Olahraga' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header & Time Range */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Analisis performa bisnis rental Anda</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
              <SelectItem value="1y">1 Tahun</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-shadow hover:card-shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${
                      stat.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">{stat.description}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                Tren Pendapatan
              </CardTitle>
              <Select value={activeMetric} onValueChange={setActiveMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="items">Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => [
                      activeMetric === 'revenue' ? formatCurrency(Number(value)) : value,
                      activeMetric === 'revenue' ? 'Revenue' : 'Items Rented'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={activeMetric} 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  />
                  {activeMetric === 'revenue' && (
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                    />
                  )}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Distribusi Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    dataKey="value"
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-muted-foreground">{category.name}</span>
                  <span className="text-sm font-medium">{category.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Aktivitas per Jam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="rentals" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Items */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Item Terbaik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                      {index < 3 && (
                        <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className="text-xs">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.rentals} rental</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatCurrency(item.revenue)}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Performa Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Target Revenue</span>
                <span className="font-medium">Rp 50M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Actual Revenue</span>
                <span className="font-medium text-green-600">Rp 45.2M</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '90.4%' }} />
              </div>
              <p className="text-xs text-muted-foreground">90.4% dari target tercapai</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Efisiensi Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tingkat Okupansi</span>
                <span className="font-medium text-blue-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Durasi Rata-rata</span>
                <span className="font-medium">4.2 jam</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Revenue per Item</span>
                <span className="font-medium">Rp 125K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Proyeksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Proyeksi Bulan Ini</span>
                <span className="font-medium text-green-600">Rp 52M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <span className="font-medium">+8.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimasi Transaksi</span>
                <span className="font-medium">1,380</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}