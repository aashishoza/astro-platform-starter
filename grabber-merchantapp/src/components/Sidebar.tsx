import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Store, 
  Package, 
  Tag, 
  Users, 
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
  MessageSquare,
  X,
  Crown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'merchant' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();

  const merchantMenuItems = [
    { path: '/merchant/dashboard', label: 'Dashboard', icon: Home },
    { path: '/merchant/subscription', label: 'Subscription', icon: Crown, highlight: true },
    { path: '/merchant/store', label: 'Store Management', icon: Store },
    { path: '/merchant/products', label: 'Products', icon: Package },
    { path: '/merchant/offers', label: 'Offers & Discounts', icon: Tag },
    { path: '/merchant/customers', label: 'Customer Interaction', icon: Users },
    { path: '/merchant/transactions', label: 'Transactions', icon: CreditCard },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/merchants', label: 'Merchant Management', icon: Store },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/reports', label: 'User Reports', icon: MessageSquare },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : merchantMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Grab<span className="text-blue-600">berr</span>
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 relative
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${item.highlight ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10' : ''}
                `}
                onClick={onClose}
              >
                <Icon size={20} className={`mr-3 ${item.highlight ? 'text-yellow-600 dark:text-yellow-400' : ''}`} />
                {item.label}
                {item.highlight && (
                  <span className="ml-auto bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 px-2 py-0.5 rounded-full text-xs font-medium">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">
              {userRole === 'admin' ? 'Admin Panel' : 'Merchant Panel'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              v1.0.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;