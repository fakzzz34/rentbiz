import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Calculator,
  AlertCircle
} from 'lucide-react';

interface BEPData {
  targetIncome: number;
  monthlyExpenses: number;
  currentIncome: number;
  breakEvenPoint: number;
  daysToBreakEven: number;
  monthlyTarget: number;
}

export function BusinessAnalytics() {
  const [targetSettings, setTargetSettings] = useState({
    monthlyTarget: '15000000',
    fixedExpenses: '5000000',
    variableExpensesPercent: '30'
  });

  // Mock data - in real app, this would come from Supabase
  const bepData: BEPData = {
    targetIncome: parseInt(targetSettings.monthlyTarget),
    monthlyExpenses: parseInt(targetSettings.fixedExpenses),
    currentIncome: 8500000,
    breakEvenPoint: parseInt(targetSettings.fixedExpenses),
    daysToBreakEven: 18,
    monthlyTarget: parseInt(targetSettings.monthlyTarget)
  };

  // Daily income data for chart
  const dailyIncomeData = [
    { day: 1, income: 250000, expense: 167000, cumulative: 250000 },
    { day: 2, income: 380000, expense: 167000, cumulative: 630000 },
    { day: 3, income: 420000, expense: 167000, cumulative: 1050000 },
    { day: 4, income: 310000, expense: 167000, cumulative: 1360000 },
    { day: 5, income: 290000, expense: 167000, cumulative: 1650000 },
    { day: 6, income: 350000, expense: 167000, cumulative: 2000000 },
    { day: 7, income: 400000, expense: 167000, cumulative: 2400000 },
    { day: 8, income: 380000, expense: 167000, cumulative: 2780000 },
    { day: 9, income: 320000, expense: 167000, cumulative: 3100000 },
    { day: 10, income: 410000, expense: 167000, cumulative: 3510000 },
    { day: 11, income: 390000, expense: 167000, cumulative: 3900000 },
    { day: 12, income: 360000, expense: 167000, cumulative: 4260000 },
    { day: 13, income: 340000, expense: 167000, cumulative: 4600000 },
    { day: 14, income: 320000, expense: 167000, cumulative: 4920000 },
    { day: 15, income: 380000, expense: 167000, cumulative: 5300000 },
    { day: 16, income: 400000, expense: 167000, cumulative: 5700000 },
    { day: 17, income: 350000, expense: 167000, cumulative: 6050000 },
    { day: 18, income: 370000, expense: 167000, cumulative: 6420000 },
    { day: 19, income: 390000, expense: 167000, cumulative: 6810000 },
  ];

  // Monthly comparison data
  const monthlyData = [
    { month: 'Jan', income: 12500000, expense: 5200000, profit: 7300000 },
    { month: 'Feb', income: 13200000, expense: 5100000, profit: 8100000 },
    { month: 'Mar', income: 11800000, expense: 5300000, profit: 6500000 },
    { month: 'Apr', income: 14100000, expense: 5000000, profit: 9100000 },
    { month: 'Mei', income: 13900000, expense: 5250000, profit: 8650000 },
    { month: 'Jun', income: 15200000, expense: 4950000, profit: 10250000 },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Rental Motor', value: 60, amount: 9000000, color: '#0088FE' },
    { name: 'Service', value: 25, amount: 3750000, color: '#00C49F' },
    { name: 'Aksesoris', value: 10, amount: 1500000, color: '#FFBB28' },
    { name: 'Lainnya', value: 5, amount: 750000, color: '#FF8042' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateBEP = () => {
    const dailyFixedExpenses = bepData.monthlyExpenses / 30;
    const averageDailyIncome = bepData.currentIncome / 19; // 19 days of data
    const netDailyIncome = averageDailyIncome - dailyFixedExpenses;
    
    if (netDailyIncome <= 0) return { days: Infinity, amount: bepData.monthlyExpenses };
    
    return {
      days: Math.ceil(bepData.monthlyExpenses / netDailyIncome),
      amount: bepData.monthlyExpenses
    };
  };

  const bepCalculation = calculateBEP();
  const progressPercentage = Math.min((bepData.currentIncome / bepData.monthlyExpenses) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl text-gray-900">Analisis Bisnis & BEP</h2>
          <p className="text-gray-600">Monitor break-even point dan proyeksi keuntungan bisnis</p>
        </div>
      </div>

      {/* BEP Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Income Saat Ini</p>
                <p className="text-2xl">{formatCurrency(bepData.currentIncome)}</p>
                <p className="text-xs text-gray-500">19 hari terakhir</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target BEP</p>
                <p className="text-2xl">{formatCurrency(bepData.breakEvenPoint)}</p>
                <p className="text-xs text-gray-500">Per bulan</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proyeksi BEP</p>
                <p className="text-2xl text-blue-600">Hari ke-{bepCalculation.days}</p>
                <p className="text-xs text-gray-500">Bulan ini</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress BEP</p>
                <p className="text-2xl text-yellow-600">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-gray-500">Dari target</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BEP Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Menuju Break-Even Point</CardTitle>
          <CardDescription>
            Target BEP: {formatCurrency(bepData.breakEvenPoint)} | Sisa: {formatCurrency(Math.max(0, bepData.breakEvenPoint - bepData.currentIncome))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progressPercentage} className="w-full h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Pencapaian: {formatCurrency(bepData.currentIncome)}</span>
              <span>Target: {formatCurrency(bepData.breakEvenPoint)}</span>
            </div>
            
            {progressPercentage >= 100 ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Selamat! BEP Tercapai</h4>
                </div>
                <p className="text-sm text-green-800 mt-1">
                  Bisnis Anda sudah mencapai break-even point. Keuntungan bersih bulan ini: 
                  <span className="font-semibold"> {formatCurrency(bepData.currentIncome - bepData.breakEvenPoint)}</span>
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Proyeksi BEP</h4>
                </div>
                <p className="text-sm text-blue-800 mt-1">
                  Berdasarkan trend saat ini, bisnis akan mencapai BEP pada hari ke-{bepCalculation.days} bulan ini.
                  Butuh tambahan <span className="font-semibold">{formatCurrency(bepData.breakEvenPoint - bepData.currentIncome)}</span> untuk mencapai BEP.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Income Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Income Harian</CardTitle>
            <CardDescription>
              Perbandingan income vs expense harian dan akumulasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyIncomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${value/1000}K`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Income Harian"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Kumulatif"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Revenue</CardTitle>
            <CardDescription>
              Sumber pendapatan berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name) => [
                  `${value}%`, 
                  categoryData.find(d => d.name === name)?.amount ? 
                  formatCurrency(categoryData.find(d => d.name === name)!.amount) : ''
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Bulanan</CardTitle>
          <CardDescription>
            Income, expense, dan profit 6 bulan terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value/1000000}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#0088FE" name="Income" />
              <Bar dataKey="expense" fill="#FF8042" name="Expense" />
              <Bar dataKey="profit" fill="#00C49F" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Target Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Target & Proyeksi</CardTitle>
          <CardDescription>
            Atur target bulanan dan parameter untuk perhitungan BEP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-target">Target Income Bulanan</Label>
              <Input
                id="monthly-target"
                type="number"
                value={targetSettings.monthlyTarget}
                onChange={(e) => setTargetSettings({...targetSettings, monthlyTarget: e.target.value})}
                placeholder="15000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixed-expenses">Fixed Expenses Bulanan</Label>
              <Input
                id="fixed-expenses"
                type="number"
                value={targetSettings.fixedExpenses}
                onChange={(e) => setTargetSettings({...targetSettings, fixedExpenses: e.target.value})}
                placeholder="5000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable-percent">Variable Expenses (%)</Label>
              <Input
                id="variable-percent"
                type="number"
                max="100"
                value={targetSettings.variableExpensesPercent}
                onChange={(e) => setTargetSettings({...targetSettings, variableExpensesPercent: e.target.value})}
                placeholder="30"
              />
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Ringkasan Proyeksi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Target Harian</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(parseInt(targetSettings.monthlyTarget) / 30)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">BEP Harian</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(parseInt(targetSettings.fixedExpenses) / 30)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Margin Target</p>
                <p className="font-semibold text-lg text-green-600">
                  {Math.round(((parseInt(targetSettings.monthlyTarget) - parseInt(targetSettings.fixedExpenses)) / parseInt(targetSettings.monthlyTarget)) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <Button className="mt-4">
            Update Pengaturan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}