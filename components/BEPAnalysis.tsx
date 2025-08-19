import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface BEPAnalysisProps {
  monthlyRevenue: number;
  monthlyExpenses: number;
  dailyTarget: number;
}

interface BEPData {
  breakEvenPoint: number;
  currentProfit: number;
  daysToBreakEven: number;
  projectedAnnualProfit: number;
  roi: number;
}

export function BEPAnalysis({ monthlyRevenue = 8500000, monthlyExpenses = 5000000, dailyTarget = 500000 }: Partial<BEPAnalysisProps> = {}) {
  const [bepData, setBepData] = useState<BEPData>({
    breakEvenPoint: 0,
    currentProfit: 0,
    daysToBreakEven: 0,
    projectedAnnualProfit: 0,
    roi: 0
  });

  const [customInputs, setCustomInputs] = useState({
    targetRevenue: dailyTarget.toString(),
    fixedCosts: monthlyExpenses.toString(),
    variableCostPercentage: '30'
  });

  const [showCustomAnalysis, setShowCustomAnalysis] = useState(false);

  useEffect(() => {
    calculateBEP();
  }, [monthlyRevenue, monthlyExpenses, dailyTarget]);

  const calculateBEP = () => {
    const dailyRevenue = monthlyRevenue / 30; // Rata-rata per hari
    const dailyExpenses = monthlyExpenses / 30;
    const currentProfit = monthlyRevenue - monthlyExpenses;
    
    // Break Even Point calculation
    const breakEvenPoint = monthlyExpenses; // Revenue needed to break even
    const daysToBreakEven = breakEvenPoint / (dailyRevenue > 0 ? dailyRevenue : 1);
    
    // Annual projections
    const projectedAnnualRevenue = monthlyRevenue * 12;
    const projectedAnnualExpenses = monthlyExpenses * 12;
    const projectedAnnualProfit = projectedAnnualRevenue - projectedAnnualExpenses;
    
    // ROI calculation (assuming initial investment)
    const estimatedInitialInvestment = monthlyExpenses * 6; // 6 months of expenses
    const roi = estimatedInitialInvestment > 0 ? (projectedAnnualProfit / estimatedInitialInvestment) * 100 : 0;

    setBepData({
      breakEvenPoint,
      currentProfit,
      daysToBreakEven: Math.ceil(daysToBreakEven),
      projectedAnnualProfit,
      roi
    });
  };

  const calculateCustomBEP = () => {
    const targetRevenue = parseFloat(customInputs.targetRevenue) || 0;
    const fixedCosts = parseFloat(customInputs.fixedCosts) || 0;
    const variableCostPercentage = parseFloat(customInputs.variableCostPercentage) || 0;
    
    const dailyVariableCost = (targetRevenue * variableCostPercentage) / 100;
    const dailyFixedCost = fixedCosts / 30;
    const dailyProfit = targetRevenue - dailyVariableCost - dailyFixedCost;
    
    const monthlyProfit = dailyProfit * 30;
    const breakEvenDays = fixedCosts / (targetRevenue - dailyVariableCost);
    
    return {
      dailyProfit,
      monthlyProfit,
      breakEvenDays: Math.ceil(breakEvenDays),
      annualProfit: monthlyProfit * 12
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const customAnalysis = showCustomAnalysis ? calculateCustomBEP() : null;

  return (
    <div className="space-y-6">
      {/* Current Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">BEP Bulanan</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(bepData.breakEvenPoint)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Saat Ini</p>
                <p className={`text-xl font-bold ${bepData.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(bepData.currentProfit)}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bepData.currentProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`w-5 h-5 ${bepData.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">BEP Tercapai</p>
                <p className="text-xl font-bold text-purple-600">{bepData.daysToBreakEven} hari</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ROI Tahunan</p>
                <p className={`text-xl font-bold ${bepData.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {bepData.roi.toFixed(1)}%
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Analisis Performa Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendapatan Bulanan</span>
                <span className="font-semibold">{formatCurrency(monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pengeluaran Bulanan</span>
                <span className="font-semibold text-red-600">{formatCurrency(monthlyExpenses)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Profit/Loss</span>
                  <span className={`font-bold ${bepData.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(bepData.currentProfit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Proyeksi Tahunan</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Profit Tahunan</span>
                  <span className={bepData.projectedAnnualProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(bepData.projectedAnnualProfit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ROI</span>
                  <span className={bepData.roi >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {bepData.roi.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Status Bisnis</h4>
              {bepData.currentProfit >= 0 ? (
                <Badge className="bg-green-100 text-green-800">
                  ✅ Bisnis sudah profitable
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  ⚠️ Bisnis belum profitable
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Custom Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Simulasi Target
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCustomAnalysis(!showCustomAnalysis)}
              >
                {showCustomAnalysis ? 'Sembunyikan' : 'Tampilkan'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showCustomAnalysis ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Klik "Tampilkan" untuk melakukan simulasi dengan target custom</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="targetRevenue">Target Pendapatan Harian</Label>
                    <Input
                      id="targetRevenue"
                      type="number"
                      value={customInputs.targetRevenue}
                      onChange={(e) => setCustomInputs(prev => ({ ...prev, targetRevenue: e.target.value }))}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fixedCosts">Biaya Tetap Bulanan</Label>
                    <Input
                      id="fixedCosts"
                      type="number"
                      value={customInputs.fixedCosts}
                      onChange={(e) => setCustomInputs(prev => ({ ...prev, fixedCosts: e.target.value }))}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variableCost">Biaya Variabel (%)</Label>
                    <Input
                      id="variableCost"
                      type="number"
                      value={customInputs.variableCostPercentage}
                      onChange={(e) => setCustomInputs(prev => ({ ...prev, variableCostPercentage: e.target.value }))}
                      className="text-right"
                    />
                  </div>
                </div>

                {customAnalysis && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-3">Hasil Simulasi</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Profit Harian</span>
                        <span className={customAnalysis.dailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(customAnalysis.dailyProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit Bulanan</span>
                        <span className={customAnalysis.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(customAnalysis.monthlyProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>BEP Tercapai</span>
                        <span className="text-blue-600">
                          {isFinite(customAnalysis.breakEvenDays) ? `${customAnalysis.breakEvenDays} hari` : 'Tidak tercapai'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit Tahunan</span>
                        <span className={customAnalysis.annualProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(customAnalysis.annualProfit)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Bisnis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bepData.currentProfit < 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  <strong>Prioritas Tinggi:</strong> Bisnis Anda saat ini merugi. Pertimbangkan untuk mengurangi biaya operasional atau meningkatkan pendapatan.
                </p>
              </div>
            )}
            
            {bepData.roi < 20 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">
                  <strong>Perhatian:</strong> ROI Anda di bawah 20%. Pertimbangkan strategi untuk meningkatkan efisiensi atau memperluas market.
                </p>
              </div>
            )}
            
            {bepData.daysToBreakEven > 30 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Saran:</strong> BEP tercapai dalam {bepData.daysToBreakEven} hari. Fokus pada peningkatan penjualan harian.
                </p>
              </div>
            )}
            
            {bepData.currentProfit >= 0 && bepData.roi >= 20 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  <strong>Bagus!</strong> Bisnis Anda profitable dengan ROI yang sehat. Pertimbangkan ekspansi atau diversifikasi.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}