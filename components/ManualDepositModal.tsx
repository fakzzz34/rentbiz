import React, { useState } from 'react';
import { X, User, DollarSign, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ManualDepositData {
  operatorName: string;
  amount: number;
  paymentMethod: string;
  notes: string;
  date: string;
}

interface ManualDepositModalProps {
  onClose: () => void;
  onSubmit: (data: ManualDepositData) => Promise<void>;
}

export function ManualDepositModal({ onClose, onSubmit }: ManualDepositModalProps) {
  const [formData, setFormData] = useState<ManualDepositData>({
    operatorName: '',
    amount: 0,
    paymentMethod: 'cash',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.operatorName || formData.amount <= 0) {
      alert('Mohon lengkapi nama operator dan jumlah setoran');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Manual deposit error:', error);
      alert('Gagal mencatat setoran manual');
    } finally {
      setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Input Setoran Manual</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Operator Name */}
          <div className="space-y-2">
            <Label htmlFor="operatorName" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Nama Operator
            </Label>
            <Input
              id="operatorName"
              placeholder="Masukkan nama operator"
              value={formData.operatorName}
              onChange={(e) => setFormData(prev => ({ ...prev, operatorName: e.target.value }))}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Jumlah Setoran
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              className="text-right"
              required
            />
            {formData.amount > 0 && (
              <p className="text-sm text-gray-600">
                {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Tanggal
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan jika diperlukan..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Setoran'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}