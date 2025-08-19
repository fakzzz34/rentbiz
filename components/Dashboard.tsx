import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DashboardOwner } from './DashboardOwner';
import { DashboardOperator } from './DashboardOperator';
import { RentalManagement } from './RentalManagement';
import { Analytics } from './Analytics';
import { Financial } from './Financial';
import { Messages } from './Messages';
import { CalendarView } from './CalendarView';
import { Settings } from './Settings';
import { HelpSupport } from './HelpSupport';
import { 
  LayoutDashboard, 
  Car, 
  TrendingUp, 
  DollarSign, 
  Mail, 
  Calendar, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Moon, 
  LogOut,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type MenuId = 'dashboard' | 'rental' | 'analytics' | 'financial' | 'messages' | 'calendar' | 'settings' | 'help' | 'darkMode';

interface MenuItem {
  id: MenuId;
  icon: any;
  label: string;
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuId>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const sidebarItems: MenuItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'rental', icon: Car, label: 'Rental Management' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'financial', icon: DollarSign, label: 'Financial' },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ];

  const preferenceItems: MenuItem[] = [
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
    { id: 'darkMode', icon: Moon, label: 'Dark Mode' },
  ];

  const handleMenuClick = (menuId: MenuId) => {
    if (menuId === 'darkMode') {
      setIsDarkMode(!isDarkMode);
      // Toggle dark mode class on document
      document.documentElement.classList.toggle('dark', !isDarkMode);
    } else {
      setActiveMenu(menuId);
    }
  };

  const getPageTitle = (): string => {
    const menuTitles: Record<MenuId, string> = {
      dashboard: 'Dashboard',
      rental: 'Rental Management',
      analytics: 'Analytics',
      financial: 'Financial',
      messages: 'Messages',
      calendar: 'Calendar',
      settings: 'Settings',
      help: 'Help & Support',
      darkMode: 'Dashboard'
    };
    return menuTitles[activeMenu];
  };

  const getPageDescription = (): string => {
    const descriptions: Record<MenuId, string> = {
      dashboard: `Selamat datang kembali, ${user?.name || 'User'}`,
      rental: 'Kelola semua kategori rental dan item yang tersedia',
      analytics: 'Analisis performa bisnis dan tren penjualan',
      financial: 'Kelola keuangan, laporan, dan analisis BEP',
      messages: 'Kelola komunikasi dan notifikasi',
      calendar: 'Jadwal dan reservasi rental',
      settings: 'Pengaturan aplikasi dan profil',
      help: 'Bantuan dan dukungan teknis',
      darkMode: `Selamat datang kembali, ${user?.name || 'User'}`
    };
    return descriptions[activeMenu];
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return user?.role === 'owner' ? <DashboardOwner /> : <DashboardOperator />;
      case 'rental':
        return <RentalManagement />;
      case 'analytics':
        return <Analytics />;
      case 'financial':
        return <Financial />;
      case 'messages':
        return <Messages />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpSupport />;
      default:
        return user?.role === 'owner' ? <DashboardOwner /> : <DashboardOperator />;
    }
  };

  return (
    <div className={`min-h-screen bg-background flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Modern Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-primary">RENTBIZ</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
              MAIN MENU
            </p>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Preferences */}
          <div className="mt-8 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
              PREFERENCES
            </p>
            {preferenceItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeMenu === item.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${item.id === 'darkMode' && isDarkMode ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'darkMode' && (
                  <div className={`ml-auto w-2 h-2 rounded-full ${isDarkMode ? 'bg-primary' : 'bg-muted-foreground'}`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-8 w-8 p-0 hover:bg-sidebar-border"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {getPageDescription()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 bg-accent rounded-full"
                  onClick={() => handleMenuClick('messages')}
                >
                  <Mail className="w-4 h-4 text-accent-foreground" />
                </Button>
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-3 h-3 p-0 text-xs rounded-full"
                >
                  3
                </Badge>
              </div>
              <div className="relative" ref={profileMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 bg-primary rounded-full"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <User className="w-4 h-4 text-primary-foreground" />
                </Button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => {
                        handleMenuClick('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        handleMenuClick('help');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </button>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted text-destructive flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}