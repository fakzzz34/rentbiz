import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { DepositManagement } from './DepositManagement';
import { OperatorManagement } from './OperatorManagement';
// import { ExpenseTracker } from './ExpenseTracker';

// Temporary inline ExpenseTracker component
function ExpenseComponent() {
  const [expenses, setExpenses] = React.useState([
    { id: 1, name: 'Sewa Tempat', amount: 2000000, category: 'Operasional' },
    { id: 2, name: 'Listrik', amount: 500000, category: 'Utilitas' }
  ]);

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newExpense, setNewExpense] = React.useState({ name: '', amount: '', category: '' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;
    
    const expense = {
      id: Date.now(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category || 'Lainnya'
    };
    
    setExpenses(prev => [...prev, expense]);
    setNewExpense({ name: '', amount: '', category: '' });
    setShowAddForm(false);
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-foreground">Manajemen Pengeluaran</h2>
          <p className="text-muted-foreground">Kelola pengeluaran rutin dan reminder</p>
        </div>
      </div>

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
                <p className="text-sm font-medium text-muted-foreground">Total Item</p>
                <p className="text-2xl font-bold text-primary">{expenses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rata-rata</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h3>Daftar Pengeluaran</h3>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
          Tambah Pengeluaran
        </Button>
      </div>

      {showAddForm && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Tambah Pengeluaran Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Kategori pengeluaran"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                    <h4 className="font-semibold text-foreground">{expense.name}</h4>
                    <p className="text-sm text-muted-foreground">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
import { BEPAnalysis } from './BEPAnalysis';
import { BusinessAnalytics } from './BusinessAnalytics';

export function DashboardOwner() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Revenue',
      value: 'Rp 45,231,000',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Operators',
      value: '12',
      change: '+2',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Daily Deposits',
      value: 'Rp 3,421,000',
      change: '+8.2%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Issues',
      value: '3',
      change: '-2',
      isPositive: true,
      icon: AlertTriangle,
      color: 'bg-orange-500'
    },
  ];

  const recentActivities = [
    {
      id: 1,
      operator: 'Andi Pratama',
      action: 'Deposited',
      amount: 'Rp 485,000',
      time: '2 jam lalu',
      status: 'success'
    },
    {
      id: 2,
      operator: 'Sari Dewi',
      action: 'Deposited',
      amount: 'Rp 520,000',
      time: '3 jam lalu',
      status: 'success'
    },
    {
      id: 3,
      operator: 'Budi Santoso',
      action: 'Failed Deposit',
      amount: 'Rp 300,000',
      time: '5 jam lalu',
      status: 'failed'
    },
    {
      id: 4,
      operator: 'Maya Putri',
      action: 'Deposited',
      amount: 'Rp 650,000',
      time: '6 jam lalu',
      status: 'success'
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deposits', label: 'Deposit Management' },
    { id: 'operators', label: 'Operator Management' },
    { id: 'expenses', label: 'Expense Tracker' },
    { id: 'analytics', label: 'Business Analytics' },
    { id: 'bep', label: 'BEP Analysis' },
  ];

  if (activeTab !== 'overview') {
    return (
      <div>
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'deposits' && <DepositManagement />}
        {activeTab === 'operators' && <OperatorManagement />}
        {activeTab === 'expenses' && <ExpenseComponent />}
        {activeTab === 'analytics' && <BusinessAnalytics />}
        {activeTab === 'bep' && <BEPAnalysis />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setActiveTab('deposits')} 
              className="w-full justify-start bg-primary hover:bg-primary/90"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Manage Deposits
            </Button>
            <Button 
              onClick={() => setActiveTab('operators')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Operators
            </Button>
            <Button 
              onClick={() => setActiveTab('expenses')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Track Expenses
            </Button>
            <Button 
              onClick={() => setActiveTab('analytics')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activities</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-foreground">{activity.operator}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{activity.amount}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'success' ? 'default' : 'destructive'}
                    className="ml-4"
                  >
                    {activity.status === 'success' ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-primary hover:text-primary/80"
              onClick={() => setActiveTab('deposits')}
            >
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">All Systems Operational</h3>
              <p className="text-sm text-muted-foreground mt-1">Deposit system running smoothly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">12/12 Operators Active</h3>
              <p className="text-sm text-muted-foreground mt-1">All operators compliant today</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Target Achievement</h3>
              <p className="text-sm text-muted-foreground mt-1">108% of daily target reached</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}