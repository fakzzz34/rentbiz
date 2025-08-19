import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Mail, 
  Send, 
  Search, 
  Filter,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Plus
} from 'lucide-react';

interface Message {
  id: number;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'read' | 'unread';
  priority: 'low' | 'normal' | 'high';
  type: 'deposit' | 'maintenance' | 'general' | 'system';
  starred: boolean;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

export function Messages() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showComposeModal, setShowComposeModal] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'Andi Pratama (Operator)',
      to: 'Owner',
      subject: 'Konfirmasi Deposit Hari Ini',
      content: 'Selamat pagi pak, saya sudah melakukan deposit sebesar Rp 485,000 untuk shift hari ini. Mohon konfirmasinya. Terima kasih.',
      timestamp: '2024-01-15 08:30',
      status: 'unread',
      priority: 'normal',
      type: 'deposit',
      starred: false
    },
    {
      id: 2,
      from: 'System',
      to: 'Owner',
      subject: 'Reminder: Monthly Expense - Sewa Tempat',
      content: 'Reminder otomatis: Pengeluaran bulanan "Sewa Tempat" sebesar Rp 5,000,000 jatuh tempo pada tanggal 20 Januari 2024.',
      timestamp: '2024-01-15 07:00',
      status: 'unread',
      priority: 'high',
      type: 'system',
      starred: true
    },
    {
      id: 3,
      from: 'Sari Dewi (Operator)',
      to: 'Owner',
      subject: 'Maintenance Required - Honda Beat Unit 3',
      content: 'Pak, Honda Beat unit 3 perlu maintenance. Ada masalah pada rem depan. Mohon jadwalkan service segera untuk keamanan penyewa.',
      timestamp: '2024-01-14 16:45',
      status: 'read',
      priority: 'high',
      type: 'maintenance',
      starred: false
    },
    {
      id: 4,
      from: 'Budi Santoso (Operator)',
      to: 'Owner',
      subject: 'Late Deposit Explanation',
      content: 'Mohon maaf pak, deposit kemarin terlambat karena ada kendala dengan aplikasi payment. Sudah saya transfer manual ke rekening.',
      timestamp: '2024-01-14 14:20',
      status: 'read',
      priority: 'normal',
      type: 'general',
      starred: false
    },
    {
      id: 5,
      from: 'System',
      to: 'Owner',
      subject: 'Weekly Report - Rental Performance',
      content: 'Laporan mingguan: Total revenue Rp 12.5M, 145 transaksi berhasil, tingkat okupansi 82%. Detail lengkap terlampir.',
      timestamp: '2024-01-14 09:00',
      status: 'read',
      priority: 'normal',
      type: 'system',
      starred: true
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Deposit Berhasil',
      message: 'Andi Pratama telah melakukan deposit Rp 485,000',
      type: 'success',
      timestamp: '2024-01-15 08:30',
      read: false
    },
    {
      id: 2,
      title: 'Payment Gateway Error',
      message: 'Ada masalah dengan payment gateway, beberapa transaksi tertunda',
      type: 'error',
      timestamp: '2024-01-15 07:45',
      read: false
    },
    {
      id: 3,
      title: 'Maintenance Alert',
      message: 'Honda Beat Unit 3 memerlukan maintenance segera',
      type: 'warning',
      timestamp: '2024-01-14 16:45',
      read: true
    },
    {
      id: 4,
      title: 'Target Tercapai',
      message: 'Target revenue harian telah tercapai 108%',
      type: 'success',
      timestamp: '2024-01-14 15:30',
      read: true
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'normal' as const
  });

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTabMessages = (tab: string) => {
    switch (tab) {
      case 'inbox':
        return filteredMessages;
      case 'sent':
        return filteredMessages.filter(msg => msg.from === 'Owner');
      case 'starred':
        return filteredMessages.filter(msg => msg.starred);
      case 'archive':
        return []; // No archived messages in demo
      default:
        return filteredMessages;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'system':
        return <Bell className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'normal':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-gray-300';
      default:
        return 'border-l-gray-300';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject || !newMessage.content) return;

    const message: Message = {
      id: Date.now(),
      from: 'Owner',
      to: newMessage.to,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toLocaleString('id-ID'),
      status: 'read',
      priority: newMessage.priority,
      type: 'general',
      starred: false
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage({ to: '', subject: '', content: '', priority: 'normal' });
    setShowComposeModal(false);
  };

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, status: 'read' as const })));
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleMarkMessageRead = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    ));
  };

  const handleToggleStarred = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;
  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  const tabs = [
    { id: 'inbox', label: 'Inbox', count: unreadCount },
    { id: 'sent', label: 'Sent', count: 0 },
    { id: 'starred', label: 'Starred', count: messages.filter(m => m.starred).length },
    { id: 'notifications', label: 'Notifications', count: unreadNotifications },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-foreground">Messages & Notifications</h2>
          <p className="text-muted-foreground">Kelola komunikasi dengan operator dan sistem notifikasi</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleMarkAllRead}>
            <Bell className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button onClick={() => setShowComposeModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="card-shadow">
            <CardContent className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari pesan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-sm font-medium">{tab.label}</span>
                    {tab.count > 0 && (
                      <Badge variant={activeTab === tab.id ? "secondary" : "default"} className="text-xs">
                        {tab.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Messages</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unread</span>
                  <span className="font-medium text-primary">{unreadCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">High Priority</span>
                  <span className="font-medium text-red-500">
                    {messages.filter(m => m.priority === 'high').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'notifications' ? (
            /* Notifications View */
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  System Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                        !notification.read ? 'bg-muted/30 border-primary/20' : 'bg-background'
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-foreground">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Messages View */
            <div className="space-y-4">
              {selectedMessage ? (
                /* Message Detail View */
                <Card className="card-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" onClick={() => setSelectedMessage(null)}>
                        ← Back to Inbox
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Reply className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Forward className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xl font-semibold text-foreground">{selectedMessage.subject}</h2>
                          <Badge variant={selectedMessage.priority === 'high' ? 'destructive' : 'secondary'}>
                            {selectedMessage.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>From: {selectedMessage.from}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{selectedMessage.timestamp}</span>
                          </div>
                          {getMessageTypeIcon(selectedMessage.type)}
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-border">
                        <Button className="bg-primary hover:bg-primary/90">
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline">
                          <Forward className="w-4 h-4 mr-2" />
                          Forward
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Messages List View */
                <Card className="card-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        {tabs.find(t => t.id === activeTab)?.label}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getTabMessages(activeTab).map((message) => (
                        <div
                          key={message.id}
                          onClick={() => {
                            setSelectedMessage(message);
                            if (message.status === 'unread') {
                              handleMarkMessageRead(message.id);
                            }
                          }}
                          className={`flex items-center gap-4 p-4 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                            getPriorityColor(message.priority)
                          } ${message.status === 'unread' ? 'bg-muted/30' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            {getMessageTypeIcon(message.type)}
                            {message.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-medium truncate ${
                                  message.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {message.from}
                                </h4>
                                {message.status === 'unread' && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                            </div>
                            <h5 className={`font-medium mb-1 ${
                              message.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {message.subject}
                            </h5>
                            <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStarred(message.id);
                              }}
                              className={message.starred ? 'text-yellow-500' : ''}
                            >
                              <Star className={`w-4 h-4 ${message.starred ? 'fill-current' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <Input
                      value={newMessage.to}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="Pilih penerima..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      value={newMessage.priority}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as any }))}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Subject"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Type your message..."
                    rows={6}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowComposeModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
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