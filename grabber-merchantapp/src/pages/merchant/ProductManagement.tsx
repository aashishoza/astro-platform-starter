import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Upload, Package } from 'lucide-react';
import Layout from '../../components/Layout';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useSubscription } from '../../hooks/useSubscription';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discount: number;
  color: string;
  stock: number;
  image: string | null;
  status: 'active' | 'inactive';
}

const ProductManagement: React.FC = () => {
  const { hasFeatureAccess, subscription } = useSubscription();
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      category: 'Smartphones',
      price: 129900,
      discount: 5,
      color: 'Natural Titanium',
      stock: 15,
      image: null,
      status: 'active'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      brand: 'Samsung',
      category: 'Smartphones',
      price: 89999,
      discount: 10,
      color: 'Phantom Black',
      stock: 22,
      image: null,
      status: 'active'
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      brand: 'Apple',
      category: 'Laptops',
      price: 134900,
      discount: 0,
      color: 'Midnight',
      stock: 8,
      image: null,
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    brand: '',
    category: '',
    price: 0,
    discount: 0,
    color: '',
    stock: 0,
    image: null,
    status: 'active'
  });

  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Smart Watches'];

  // Check product limits based on subscription
  const getProductLimit = () => {
    if (hasFeatureAccess('premium')) return Infinity;
    if (hasFeatureAccess('basic')) return 50;
    return 10; // Free tier
  };

  const canAddMoreProducts = products.length < getProductLimit();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!canAddMoreProducts) {
      toast.error(`Product limit reached. Upgrade to add more products.`);
      return;
    }

    if (!newProduct.name || !newProduct.brand || !newProduct.category || newProduct.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: Product = {
      ...newProduct,
      id: Date.now().toString()
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      price: 0,
      discount: 0,
      color: '',
      stock: 0,
      image: null,
      status: 'active'
    });
    setShowAddModal(false);
    toast.success('Product added successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully!');
  };

  const ProductModal = ({ isEdit = false }: { isEdit?: boolean }) => {
    const product = isEdit ? editingProduct : newProduct;
    const setProduct = isEdit ? setEditingProduct : setNewProduct;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={product?.name || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  value={product?.brand || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={product?.category || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={product?.color || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, color: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter color"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  value={product?.price || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={product?.discount || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, discount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Discount percentage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={product?.stock || ''}
                  onChange={(e) => setProduct(prev => ({ ...prev!, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Stock quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={product?.status || 'active'}
                  onChange={(e) => setProduct(prev => ({ ...prev!, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload product image</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={isEdit ? () => {
                // Handle edit logic here
                setEditingProduct(null);
                toast.success('Product updated successfully!');
              } : handleAddProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your product inventory ({products.length}/{getProductLimit() === Infinity ? '∞' : getProductLimit()} products)
            </p>
          </div>
          <button
            onClick={() => canAddMoreProducts ? setShowAddModal(true) : toast.error('Product limit reached. Upgrade your plan.')}
            disabled={!canAddMoreProducts}
            className={`mt-4 sm:mt-0 inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${
              canAddMoreProducts 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>

        {/* Subscription Notice */}
        {!hasFeatureAccess('premium') && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300">Limited Product Access</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  You can add up to {getProductLimit()} products with your current plan. Upgrade to Premium for unlimited products.
                </p>
              </div>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Package size={48} className="text-gray-400" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {product.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.brand} • {product.category}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{(product.price * (1 - product.discount / 100)).toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 text-xs font-medium rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span>Stock: {product.stock}</span>
                  <span>{product.color}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first product'
              }
            </p>
          </div>
        )}

        {/* Modals */}
        {showAddModal && <ProductModal />}
        {editingProduct && <ProductModal isEdit />}
      </div>
    </Layout>
  );
};

export default ProductManagement;