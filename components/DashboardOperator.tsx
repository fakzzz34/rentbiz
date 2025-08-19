import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  QrCode,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function DashboardOperator() {
  const { user } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in real app this would come from backend
  const operatorStats = {
    todayTarget: 500000,
    todayDeposited: 0,
    lastDeposit: '2024-08-13',
    status: 'blocked', // blocked, active, warning
    currentShift: 'Pagi (06:00 - 14:00)',
    weeklyTarget: 3500000,
    weeklyDeposited: 2100000
  };

  const canLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    return operatorStats.lastDeposit === today && operatorStats.todayDeposited >= operatorStats.todayTarget;
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert(`Deposit sebesar Rp ${parseInt(depositAmount).toLocaleString('id-ID')} telah dikirim dan menunggu konfirmasi owner.`);
      setDepositAmount('');
      setIsSubmitting(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active - Can Login';
      case 'warning': return 'Warning - Deposit Soon';
      case 'blocked': return 'Blocked - Deposit Required';
      default: return 'Unknown Status';
    }
  };

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <Card className={`border-l-4 ${
        operatorStats.status === 'blocked' ? 'border-l-red-500 bg-red-50' :
        operatorStats.status === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
        'border-l-green-500 bg-green-50'
      } card-shadow`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${getStatusColor(operatorStats.status)} flex items-center justify-center`}>
                {operatorStats.status === 'blocked' ? (
                  <AlertCircle className="w-6 h-6 text-white" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {getStatusText(operatorStats.status)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {operatorStats.status === 'blocked' 
                    ? 'Anda perlu melakukan setoran hari ini untuk dapat login besok'
                    : 'Status akun Anda dalam kondisi baik'
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={operatorStats.status === 'blocked' ? 'destructive' : 'default'}
              className="text-sm px-3 py-1"
            >
              {operatorStats.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Target</p>
                <p className="text-2xl font-bold text-foreground">
                  Rp {operatorStats.todayTarget.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Shift: {operatorStats.currentShift}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Deposited</p>
                <p className="text-2xl font-bold text-foreground">
                  Rp {operatorStats.todayDeposited.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-red-500 mt-1">
                  {operatorStats.todayDeposited === 0 ? 'Not deposited yet' : 'Deposited'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {((operatorStats.weeklyDeposited / operatorStats.weeklyTarget) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Rp {operatorStats.weeklyDeposited.toLocaleString('id-ID')} / Rp {operatorStats.weeklyTarget.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Deposit</p>
                <p className="text-2xl font-bold text-foreground">
                  {operatorStats.lastDeposit}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {operatorStats.lastDeposit === new Date().toISOString().split('T')[0] ? 'Today' : 'Past date'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Deposit Form */}
        <Card className="lg:col-span-2 card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Submit Daily Deposit
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Submit your daily deposit to maintain access for tomorrow
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDepositSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Deposit Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in Rupiah"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                  min="1"
                  className="text-lg"
                />
              </div>

              <div className="space-y-4">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      Cash Payment
                      <p className="text-sm text-muted-foreground">Pay directly to owner</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="qris" id="qris" />
                    <QrCode className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="qris" className="flex-1 cursor-pointer">
                      QRIS Payment
                      <p className="text-sm text-muted-foreground">Scan QR code to pay</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={!depositAmount || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Deposit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions & Info */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
              <h4 className="font-medium text-blue-900">Deposit Requirements</h4>
              <p className="text-sm text-blue-700 mt-1">
                You must deposit at least Rp {operatorStats.todayTarget.toLocaleString('id-ID')} daily to maintain access.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
              <h4 className="font-medium text-yellow-900">Payment Methods</h4>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Cash: Pay directly to owner</li>
                <li>• QRIS: Scan and pay digitally</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-l-red-500">
              <h4 className="font-medium text-red-900">Access Rules</h4>
              <p className="text-sm text-red-700 mt-1">
                Late deposits will result in account suspension until payment is confirmed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deposit History Preview */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Recent Deposit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: '2024-08-12', amount: 485000, status: 'confirmed', method: 'QRIS' },
              { date: '2024-08-11', amount: 520000, status: 'confirmed', method: 'Cash' },
              { date: '2024-08-10', amount: 500000, status: 'confirmed', method: 'QRIS' },
            ].map((deposit, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">{deposit.date}</p>
                    <p className="text-sm text-muted-foreground">{deposit.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    Rp {deposit.amount.toLocaleString('id-ID')}
                  </p>
                  <Badge variant="default" className="text-xs">
                    {deposit.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}