import React from 'react';
import { useState } from 'react';
import { Plus, DollarSign, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type ExpenseItem = {
  id: number;
  name: string;
  amount: number;
  category: string;
  dueDate: string;
};

export function ExpenseTracker() {
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>([
    {
      id: 1,
      name: 'Sewa Tempat',
      amount: 2000000,
      category: 'Operasional',
      dueDate: '2024-12-25'
    },
    {
      id: 2,
      name: 'Listrik',
      amount: 500000,
      category: 'Utilitas',
      dueDate: '2024-12-30'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    dueDate: ''
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const newExpense: ExpenseItem = {
      id: Date.now(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category || 'Lainnya',
      dueDate: formData.dueDate
    };

    setExpenseList(prev => [...prev, newExpense]);
    setFormData({ name: '', amount: '', category: '', dueDate: '' });
    setShowForm(false);
  };

  const totalExpenses = expenseList.reduce((sum, item) => sum + item.amount, 0);

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
                <p className="text-2xl font-bold text-destructive">{formatRupiah(totalExpenses)}</p>
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
                <p className="text-2xl font-bold text-primary">{expenseList.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
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
                  {formatRupiah(expenseList.length > 0 ? totalExpenses / expenseList.length : 0)}
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
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengeluaran
        </Button>
      </div>

      {showForm && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Tambah Pengeluaran Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-name">Nama Pengeluaran</Label>
                  <Input
                    id="expense-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama pengeluaran"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-amount">Jumlah</Label>
                  <Input
                    id="expense-amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-category">Kategori</Label>
                  <Input
                    id="expense-category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Kategori pengeluaran"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense-date">Tanggal Jatuh Tempo</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
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
        {expenseList.map((expense) => (
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
                    {expense.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        Jatuh tempo: {expense.dueDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {formatRupiah(expense.amount)}
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