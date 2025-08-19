import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { BEPAnalysis } from './BEPAnalysis';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Trash2,
  Download
} from 'lucide-react';

export function Financial() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Sewa Tempat', amount: 5000000, category: 'Operasional', date: '2024-01-01', recurring: true },
    { id: 2, name: 'Listrik', amount: 750000, category: 'Utilitas', date: '2024-01-01', recurring: true },
    { id: 3, name: 'Internet', amount: 500000, category: 'Utilitas', date: '2024-01-01', recurring: true },
    { id: 4, name: 'Maintenance Kendaraan', amount: 1200000, category: 'Maintenance', date: '2024-01-15', recurring: false },
    { id: 5, name: 'Insurance', amount: 800000, category: 'Asuransi', date: '2024-01-01', recurring: true },
  ]);

  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: '',
    description: '',
    recurring: false
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyRecurring = expenses.filter(exp => exp.recurring).reduce((sum, exp) => sum + exp.amount, 0);
  const oneTimeExpenses = expenses.filter(exp => !exp.recurring).reduce((sum, exp) => sum + exp.amount, 0);

  // Mock revenue data - in real app this would come from your rental transactions
  const monthlyRevenue = 45200000;
  const grossProfit = monthlyRevenue - totalExpenses;
  const profitMargin = ((grossProfit / monthlyRevenue) * 100);

  const financialStats = [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(monthlyRevenue),
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      change: '+3.2%',
      isPositive: false,
      icon: TrendingDown,
      color: 'bg-red-500'
    },
    {
      title: 'Gross Profit',
      value: formatCurrency(grossProfit),
      change: '+15.8%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      change: '+2.3%',
      isPositive: true,
      icon: Target,
      color: 'bg-purple-500'
    }
  ];

  const expenseCategories = [
    { name: 'Operasional', amount: 5000000, color: '#4f46e5', percentage: 62.5 },
    { name: 'Maintenance', amount: 1200000, color: '#06b6d4', percentage: 15.0 },
    { name: 'Asuransi', amount: 800000, color: '#10b981', percentage: 10.0 },
    { name: 'Utilitas', amount: 1250000, color: '#f59e0b', percentage: 15.6 },
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 42000000, expenses: 8000000, profit: 34000000 },
    { month: 'Feb', revenue: 44000000, expenses: 8200000, profit: 35800000 },
    { month: 'Mar', revenue: 41000000, expenses: 8500000, profit: 32500000 },
    { month: 'Apr', revenue: 46000000, expenses: 8000000, profit: 38000000 },
    { month: 'May', revenue: 48000000, expenses: 8300000, profit: 39700000 },
    { month: 'Jun', revenue: 45200000, expenses: 8250000, profit: 36950000 }
  ];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount || !newExpense.category) return;

    const expense = {
      id: Date.now(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0],
      recurring: newExpense.recurring
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({ name: '', amount: '', category: '', description: '', recurring: false });
    setShowAddExpenseModal(false);
  };

  const tabs = [
    { id: 'overview', label: 'Financial Overview' },
    { id: 'expenses', label: 'Expense Management' },
    { id: 'bep', label: 'BEP Analysis' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
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

      {/* Financial Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialStats.map((stat, index) => (
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
                        <span className="text-sm text-muted-foreground ml-1">vs last month</span>
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

          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Breakdown Pengeluaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(category.amount)}</p>
                        <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Recurring Monthly</span>
                    <span className="font-bold text-primary">{formatCurrency(monthlyRecurring)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">One-time Expenses</span>
                    <span className="font-bold text-orange-600">{formatCurrency(oneTimeExpenses)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Analysis */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Cash Flow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">Cash Inflow</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(monthlyRevenue)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">Cash Outflow</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Net Cash Flow</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(grossProfit)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Burn Rate (Monthly)</span>
                    <span className="font-medium">{formatCurrency(monthlyRecurring)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Runway (Months)</span>
                    <span className="font-medium">
                      {Math.floor(grossProfit / monthlyRecurring)} bulan
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Health Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Profit Margin Sehat</h3>
                  <p className="text-2xl font-bold text-green-600 mt-2">{profitMargin.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Di atas target 15%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Growth Rate</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-2">+12.5%</p>
                  <p className="text-sm text-muted-foreground mt-1">Month over month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Expense Ratio</h3>
                  <p className="text-2xl font-bold text-orange-600 mt-2">
                    {((totalExpenses / monthlyRevenue) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">dari total revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Expense Management Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-foreground">Manajemen Pengeluaran</h3>
              <p className="text-muted-foreground">Kelola semua pengeluaran bisnis dan reminder bulanan</p>
            </div>
            <Button onClick={() => setShowAddExpenseModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengeluaran
            </Button>
          </div>

          {/* Expense Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recurring Monthly</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(monthlyRecurring)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold text-green-600">{expenses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expenses List */}
          <div className="grid gap-4">
            {expenses.map((expense) => (
              <Card key={expense.id} className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{expense.name}</h4>
                          {expense.recurring && (
                            <Badge variant="secondary" className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{expense.category} • {expense.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(expense.amount)}
                        </p>
                        {expense.recurring && (
                          <p className="text-xs text-muted-foreground">per bulan</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* BEP Analysis Tab */}
      {activeTab === 'bep' && (
        <BEPAnalysis />
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-foreground">Financial Reports</h3>
              <p className="text-muted-foreground">Generate dan download laporan keuangan</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Profit & Loss Statement', description: 'Laporan laba rugi bulanan', type: 'P&L' },
              { title: 'Cash Flow Report', description: 'Analisis arus kas masuk dan keluar', type: 'Cash Flow' },
              { title: 'Expense Report', description: 'Detail semua pengeluaran', type: 'Expenses' },
              { title: 'Revenue Analysis', description: 'Analisis pendapatan per kategori', type: 'Revenue' },
              { title: 'BEP Analysis Report', description: 'Analisis titik impas bisnis', type: 'BEP' },
              { title: 'Tax Summary', description: 'Ringkasan untuk keperluan pajak', type: 'Tax' }
            ].map((report, index) => (
              <Card key={index} className="card-shadow hover:card-shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>Tambah Pengeluaran Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-name">Nama Pengeluaran</Label>
                  <Input
                    id="expense-name"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama pengeluaran"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Jumlah</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Kategori</Label>
                    <Input
                      id="expense-category"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Kategori"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-description">Deskripsi</Label>
                  <Textarea
                    id="expense-description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi pengeluaran (opsional)"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newExpense.recurring}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, recurring: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="recurring">Pengeluaran berulang setiap bulan</Label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddExpenseModal(false)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}