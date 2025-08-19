import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Video,
  Send,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Zap,
  Shield,
  DollarSign,
  Users
} from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export function HelpSupport() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as const
  });

  const categories = [
    { id: 'all', name: 'Semua', icon: BookOpen },
    { id: 'setup', name: 'Setup & Installation', icon: Zap },
    { id: 'deposit', name: 'Deposit Management', icon: DollarSign },
    { id: 'operators', name: 'Operator Management', icon: Users },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: HelpCircle }
  ];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'Bagaimana cara menambahkan operator baru?',
      answer: 'Untuk menambahkan operator baru: 1) Masuk ke menu Operator Management, 2) Klik tombol "Add Operator", 3) Isi form dengan data lengkap operator, 4) Set password sementara, 5) Operator akan menerima kredensial login via email/SMS.',
      category: 'operators',
      helpful: 23
    },
    {
      id: 2,
      question: 'Apa yang harus dilakukan jika operator tidak bisa login?',
      answer: 'Jika operator tidak bisa login: 1) Pastikan operator sudah melakukan deposit untuk hari ini, 2) Cek status operator di dashboard (aktif/suspended), 3) Reset password jika diperlukan, 4) Verifikasi bahwa deposit sudah dikonfirmasi oleh sistem.',
      category: 'troubleshooting',
      helpful: 18
    },
    {
      id: 3,
      question: 'Bagaimana sistem deposit harian bekerja?',
      answer: 'Sistem deposit harian: Setiap operator wajib melakukan deposit sebelum shift dimulai. Tanpa deposit yang valid, operator tidak bisa akses sistem. Deposit dapat dilakukan via transfer bank, QRIS, atau cash manual oleh owner. Sistem akan otomatis memblokir akses jika tidak ada deposit.',
      category: 'deposit',
      helpful: 31
    },
    {
      id: 4,
      question: 'Bagaimana cara setup aplikasi pertama kali?',
      answer: 'Setup awal: 1) Install aplikasi di device, 2) Setup akun owner, 3) Konfigurasi payment gateway (opsional), 4) Tambahkan operator pertama, 5) Setup kategori rental dan item, 6) Konfigurasi notifikasi dan reminder.',
      category: 'setup',
      helpful: 15
    },
    {
      id: 5,
      question: 'Apa fitur keamanan yang tersedia?',
      answer: 'Fitur keamanan meliputi: Two-factor authentication, session timeout otomatis, enkripsi data, audit trail untuk semua transaksi, backup otomatis, dan kontrol akses berbasis role.',
      category: 'security',
      helpful: 12
    }
  ];

  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: 1,
      subject: 'Masalah dengan payment gateway',
      message: 'Payment gateway sering error saat operator melakukan deposit via QRIS...',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      subject: 'Pertanyaan tentang backup data',
      message: 'Apakah ada cara untuk backup data secara manual?',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-14'
    }
  ]);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.message) return;

    // In real app, this would submit to backend
    console.log('New support ticket:', newTicket);
    setNewTicket({ subject: '', message: '', priority: 'medium' });
    // Show success message
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact Support' },
    { id: 'tickets', label: 'My Tickets' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-foreground">Help & Support</h2>
          <p className="text-muted-foreground">Bantuan, dokumentasi, dan dukungan teknis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Video Tutorials
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Knowledge Base</p>
                <p className="text-2xl font-bold text-foreground">{faqs.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-orange-600">
                  {supportTickets.filter(t => t.status !== 'resolved').length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-green-600">2h</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold text-purple-600">98%</p>
              </div>
              <HelpCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

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

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-sm">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <Card className="card-shadow">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Cari FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="card-shadow">
                  <CardContent className="p-0">
                    <button
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <h3 className="font-medium text-foreground pr-4">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground mb-4">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              👍 Helpful ({faq.helpful})
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 Not helpful
                            </Button>
                          </div>
                          <Badge variant="secondary">
                            {categories.find(c => c.id === faq.category)?.name}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Submit Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Describe your issue briefly"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select 
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Other Contact Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@rentbiz.com</p>
                  <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+62 21 1234 5678</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 6 PM WIB</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Start Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* My Tickets Tab */}
      {activeTab === 'tickets' && (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>My Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">#{ticket.id} - {ticket.subject}</h4>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ticket.message}</p>
                    <p className="text-xs text-muted-foreground">Created: {ticket.createdAt}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'User Manual',
              description: 'Panduan lengkap penggunaan aplikasi',
              icon: BookOpen,
              color: 'bg-blue-500'
            },
            {
              title: 'Video Tutorials',
              description: 'Tutorial video step-by-step',
              icon: Video,
              color: 'bg-green-500'
            },
            {
              title: 'API Documentation',
              description: 'Dokumentasi API untuk developer',
              icon: FileText,
              color: 'bg-purple-500'
            },
            {
              title: 'Best Practices',
              description: 'Tips dan best practices',
              icon: Zap,
              color: 'bg-orange-500'
            },
            {
              title: 'Security Guide',
              description: 'Panduan keamanan aplikasi',
              icon: Shield,
              color: 'bg-red-500'
            },
            {
              title: 'Release Notes',
              description: 'Update dan fitur terbaru',
              icon: FileText,
              color: 'bg-indigo-500'
            }
          ].map((resource, index) => (
            <Card key={index} className="card-shadow hover:card-shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center`}>
                    <resource.icon className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}