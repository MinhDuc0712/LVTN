import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Zap,
  Droplets,
  CreditCard,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Building2,
  Receipt,
  DollarSign,
  Clock,
} from 'lucide-react';

export default function TenantSidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({
    bills: false,
    payments: false,
  });

  const navigate = useNavigate();

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const menuItems = [
    {
      id: 'my-rental',
      icon: Building2,
      label: 'Nhà đang thuê',
      path: '/HouseList',
    },
    {
      id: 'contract',
      icon: FileText,
      label: 'Hợp đồng thuê',
      path: '/Contract',
    },
    {
      id: 'bills',
      icon: Receipt,
      label: 'Lịch sử thanh toán',
      expandable: true,
      children: [
        { id: 'Electricity', label: 'Phiếu điện', path: '/Electricity', icon: Zap },
        { id: 'Water', label: 'Phiếu nước', path: '/Water', icon: Droplets },
        { id: 'Rent', label: 'Phiếu tiền nhà', path: '/Rent', icon: DollarSign },
      ],
    },
    {
      id: 'pending-payments',
      icon: Clock,
      label: 'Chưa thanh toán',
      path: '/Unpail',
      badge: 2 ,
    },
  ];

  /* ---------------------------- item renderer ---------------------------- */
  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;
    const isExpanded = expandedSections[item.id];

    /* ---------- mục có con (accordion) ---------- */
    if (item.expandable) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-green-50 text-green-700 border-r-2 border-green-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <Icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => {
                const ChildIcon = child.icon || Clock;
                const childActive = activeItem === child.id;

                return (
                  <button
                    key={child.id}
                    onClick={() => {
                      setActiveItem(child.id);
                      navigate(child.path);               
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      childActive ? 'bg-green-50 text-green-700 border-l-2 border-green-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <ChildIcon className="h-4 w-4 mr-3" />
                      <span>{child.label}</span>
                    </div>
                    {child.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {child.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    /* ---------- mục thường ---------- */
    return (
      <button
        onClick={() => {
          setActiveItem(item.id);
          navigate(item.path);
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
          isActive ? 'bg-green-50 text-green-700 border-r-2 border-green-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-3" />
          <span>{item.label}</span>
        </div>
        {item.badge && (
          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  /* ---------------------------------------------------------------------- */
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Quỳnh Trang</p>
            <p className="text-xs text-gray-500 truncate">Khách thuê</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
