
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Sparkles,
  Loader2,
  AlertCircle,
  AlertTriangle,
  ImageIcon,
  Banknote,
  Package,
  Settings2,
  Percent,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Info,
  Ruler,
  Layers,
  Cpu,
  Monitor,
  HardDrive,
  Shield,
  Laptop,
  Wifi,
  Camera,
  Keyboard,
  Plug,
  Gift,
  FileText,
  Sliders,
  Eye,
  SlidersHorizontal,
  ArrowDownAZ,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateProductDescription } from '../../services/geminiService';
import { Product, Category, Brand, Unit, SubCategory } from '../../types';
import { supabase } from '../../lib/supabase';
import { AdminTablePagination } from '../../components/AdminTablePagination';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Table pagination and filter states matching reference screenshot
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'out_of_stock'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [showDetailsPreview, setShowDetailsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category_id: '',
    subcategory_id: '',
    brand_id: '',
    unit_id: '',
    price: 0,
    discount_type: 'none',
    discount_value: 0,
    stock: 0,
    description: '',
    additional_details: '',
    image_url: '',
    ddr_type: '',
    is_custom_build: false,
    is_customised: false
  });

  const insertSampleDetails = () => {
    const productName = formData.name || 'ASUS ExpertBook P1';
    const sample = `The ${productName} combines high-performance processing, a crisp anti-glare display, expandable high-speed memory, and business-class security in a reliable device built for professionals and hybrid work.

**Business Grade Performance** - Powered by multi-core processing architecture delivering responsive performance for office productivity, multitasking, video conferencing, and daily computing.

**15.6-inch Full HD Anti-Glare Display** - Features 300 nits brightness, wide viewing angles, and high screen-to-body ratio for comfortable viewing throughout the workday.

**16GB DDR5 Memory & 512GB PCIe® 4.0 SSD** - High-speed memory and fast NVMe SSD storage provide smooth multitasking, rapid boot times, and ample storage for files.

**Business Security & Comprehensive Connectivity** - Includes dual USB-C with DisplayPort™ and Power Delivery, HDMI, RJ-45 LAN, Wi-Fi 6E, Bluetooth® 5.4, TPM 2.0, fingerprint sensor, and webcam privacy shutter.

![Product Highlight Graphic](https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000)`;

    setFormData(prev => ({
      ...prev,
      additional_details: sample
    }));
  };

  const insertFeatureLine = () => {
    const line = `\n**Feature Title** - Enter description of the feature or spec highlight here.`;
    setFormData(prev => ({
      ...prev,
      additional_details: (prev.additional_details || '') + line
    }));
  };

  const insertImageTemplate = () => {
    const imgUrl = prompt('Enter Image URL (or paste external image link):', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000');
    if (imgUrl && imgUrl.trim()) {
      const markdown = `\n![Product Illustration](${imgUrl.trim()})\n`;
      setFormData(prev => ({
        ...prev,
        additional_details: (prev.additional_details || '') + markdown
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, subRes, brandRes, unitRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        supabase.from('units').select('*').order('name')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;
      if (subRes.error) throw subRes.error;
      if (brandRes.error) throw brandRes.error;
      if (unitRes.error) throw unitRes.error;

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setSubCategories(subRes.data || []);
      setBrands(brandRes.data || []);
      setUnits((unitRes.data || []).filter(u => !u.name.startsWith('HOMEPAGE_SETTINGS:') && !u.name.startsWith('OUR_STORY_SETTINGS:') && u.id !== '00000000-0000-0000-0000-000000000001' && u.id !== '00000000-0000-0000-0000-000000000002'));
      
      if (!editingId && catRes.data?.[0]) {
        setFormData(prev => ({ 
          ...prev, 
          category_id: prev.category_id || catRes.data[0].id,
          brand_id: prev.brand_id || (brandRes.data?.[0]?.id || ''),
          unit_id: prev.unit_id || (unitRes.data?.[0]?.id || '')
        }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.name) return alert('Please enter product name first');
    setIsGenerating(true);
    try {
      const catName = categories.find(c => c.id === formData.category_id)?.name || 'IT Component';
      const brandName = brands.find(b => b.id === formData.brand_id)?.name || 'Generic';
      const description = await generateProductDescription(formData.name || '', catName, brandName);
      setFormData(prev => ({ ...prev, description }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setModalError(null);
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const specsWithExtra = {
      ...(formData.specs || {}),
      additional_details: formData.additional_details || '',
      ddr_type: formData.ddr_type || '',
    };

    const fullPayload: any = {
      ...formData,
      slug,
      specs: specsWithExtra,
      additional_details: formData.additional_details || '',
      ddr_type: formData.ddr_type || '',
    };

    const saveToSupabase = async (payloadToSave: any) => {
      if (editingId) {
        const { stock, id, created_at, ...updatePayload } = payloadToSave;
        const { error: updateError } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([payloadToSave]);
        if (insertError) throw insertError;
      }
    };

    try {
      try {
        await saveToSupabase(fullPayload);
      } catch (firstErr: any) {
        const errMsg = firstErr?.message || '';
        // If Supabase schema cache does not have additional_details or ddr_type column yet, fallback gracefully
        if (errMsg.includes('additional_details') || errMsg.includes('ddr_type') || errMsg.includes('schema cache')) {
          console.warn("Retrying save without optional root columns (data safely stored in specs)...", errMsg);
          const safePayload = { ...fullPayload };
          delete safePayload.additional_details;
          delete safePayload.ddr_type;
          
          await saveToSupabase(safePayload);
        } else {
          throw firstErr;
        }
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error("Error saving product:", err);
      setModalError(err.message || "Failed to save product. Please check connection or database schema.");
    }
  };

  const resetForm = () => {
    setModalError(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      subcategory_id: '',
      brand_id: brands[0]?.id || '',
      unit_id: units[0]?.id || '',
      price: 0,
      discount_type: 'none',
      discount_value: 0,
      stock: 0,
      description: '',
      additional_details: '',
      image_url: '',
      ddr_type: '',
      specs: {},
      is_custom_build: false,
      is_customised: false
    });
  };

  const handleEdit = (product: Product) => {
    setModalError(null);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id || '',
      brand_id: product.brand_id,
      unit_id: product.unit_id || '',
      price: product.price,
      discount_type: product.discount_type || 'none',
      discount_value: product.discount_value || 0,
      stock: product.stock,
      description: product.description,
      additional_details: (product as any).additional_details || '',
      image_url: product.image_url,
      ddr_type: product.ddr_type || '',
      specs: product.specs || {},
      is_custom_build: product.is_custom_build,
      is_customised: product.is_customised
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    const id = itemToDelete.id;
    setIsDeleting(id);
    try {
      const { error: delError } = await supabase.from('products').delete().eq('id', id);
      if (delError) throw delError;
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert("Error deleting product: " + err.message);
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const calculateDiscountedPrice = (price: number, type: string, value: number) => {
    if (type === 'percentage') return price * (1 - value / 100);
    if (type === 'fixed') return Math.max(0, price - value);
    return price;
  };

  // Filter, sort and pagination calculations matching reference pattern
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(c => c.id === p.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'published') return p.stock > 0;
    if (statusFilter === 'out_of_stock') return p.stock === 0;
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const availableSubCategories = subCategories.filter(s => s.category_id === formData.category_id);
  const selectedSubCategory = subCategories.find(s => s.id === formData.subcategory_id);
  const selectedCategory = categories.find(c => c.id === formData.category_id);
  const showDDRDropdown = selectedSubCategory && ['ram', 'motherboard', 'processor'].includes(selectedSubCategory.name.toLowerCase());

  const isDesktopOrLaptopCategory = React.useMemo(() => {
    const catName = (selectedCategory?.name || '').toLowerCase();
    const subName = (selectedSubCategory?.name || '').toLowerCase();
    const prodName = (formData.name || '').toLowerCase();

    const targetCategories = ['laptop', 'laptops', 'desktop', 'desktops', 'prebuilt', 'pc', 'gaming pc', 'rig', 'workstation', 'all-in-one'];
    const isCatMatch = targetCategories.some(tc => catName.includes(tc) || subName.includes(tc));
    const isNameMatch = prodName.includes('laptop') || prodName.includes('desktop');

    return isCatMatch || isNameMatch;
  }, [selectedCategory, selectedSubCategory, formData.name]);

  const getSpecValue = (key: string) => {
    return formData.specs?.[key] || '';
  };

  const updateSpecField = (key: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...(prev.specs || {}),
        [key]: val
      }
    }));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header Row Matching Screenshot */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            resetForm();
            setIsModalOpen(true);
          }} 
          className="bg-slate-950 text-white rounded-full px-5 py-2.5 text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter & Search Bar Row Matching Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Pill Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-xs transition-all font-medium"
          />
        </div>

        {/* Filter & Sort Pills */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          {/* Status Filter Pill */}
          <div className="relative">
            <button
              onClick={() => {
                const nextFilter = statusFilter === 'all' ? 'published' : statusFilter === 'published' ? 'out_of_stock' : 'all';
                setStatusFilter(nextFilter);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <SlidersHorizontal size={14} className="text-slate-500" />
              <span>{statusFilter === 'all' ? 'Show All Products' : statusFilter === 'published' ? 'Published Only' : 'Out of Stock'}</span>
            </button>
          </div>

          {/* Sort Pill */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <ArrowDownAZ size={14} className="text-slate-500" />
            <span>Sort by name {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="animate-spin text-slate-800" size={36} />
          <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Loading Products...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100 shadow-xs">
          <AlertCircle className="mx-auto mb-3" size={32} />
          <h3 className="text-sm font-bold mb-1">Error Loading Products</h3>
          <p className="text-xs font-medium opacity-80 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold">Retry</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 pl-6 pr-3 w-10">
                      <input 
                        type="checkbox"
                        checked={paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Product</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Status</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Price</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Inventory</th>
                    <th className="py-4 pr-6 pl-4 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedProducts.map((p) => {
                    const brand = brands.find(b => b.id === p.brand_id);
                    const unit = units.find(u => u.id === p.unit_id);
                    const finalPrice = calculateDiscountedPrice(p.price, p.discount_type, p.discount_value);
                    const isSelected = selectedIds.includes(p.id);
                    const isOutOfStock = p.stock === 0;

                    return (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-slate-50/50' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 pr-3">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(p.id)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Product Thumbnail + Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5 min-w-[220px]">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/70 flex items-center justify-center shrink-0">
                              {p.image_url ? (
                                <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                              ) : (
                                <ImageIcon className="text-slate-300" size={20} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-slate-900 truncate">
                                {p.name}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400">
                                {brand?.name || 'Standard'} {p.is_customised ? '• Custom' : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Pill Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isOutOfStock ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/40">
                              Sold out
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/40">
                              Published
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-slate-900">
                            RM{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </td>

                        {/* Inventory */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-slate-600">
                            {p.stock} stock for 1 variants
                          </span>
                        </td>

                        {/* Actions (••• button with dropdown) */}
                        <td className="py-4 pr-6 pl-4 text-right relative">
                          <div className="flex items-center justify-end">
                            <button 
                              onClick={() => setActionDropdownId(actionDropdownId === p.id ? null : p.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                              title="Options"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </div>

                          {actionDropdownId === p.id && (
                            <div className="absolute right-6 top-12 w-32 bg-white border border-slate-200/90 rounded-2xl shadow-lg py-1.5 z-20 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => {
                                  setActionDropdownId(null);
                                  handleEdit(p);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                              >
                                <Edit2 size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActionDropdownId(null);
                                  setItemToDelete(p);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-xs font-medium text-slate-400">
                        No products found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pagination Bar */}
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredProducts.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Product?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                You are about to remove <span className="font-bold text-slate-900">"{itemToDelete.name}"</span>. This action is permanent.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 uppercase tracking-widest text-[10px]">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting !== null} className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {editingId ? 'Edit Product' : 'Register New Hardware'}
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-[0.2em]">Active Inventory Management</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white hover:text-slate-900 rounded-full transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10">
              {modalError && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-in fade-in slide-in-from-top-4 duration-300">
                  <AlertCircle size={24} className="shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-sm uppercase tracking-wider">Critical Fault Detected</p>
                    <p className="text-xs opacity-80 font-medium">{modalError}</p>
                    {modalError.includes('column') && (
                      <p className="text-[10px] mt-2 font-black uppercase text-rose-400">Action Required: Add 'ddr_type' column to 'products' table in Supabase.</p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
                {/* Basic Info */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Hardware Name</label>
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 placeholder:text-slate-300 transition-all" 
                      required 
                      value={formData.name || ''} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. ASUS ROG Strix Laptop"
                    />
                  </div>

                  <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Layers size={14} /> Classification
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Main Category</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.category_id || ''}
                          onChange={e => setFormData({...formData, category_id: e.target.value, subcategory_id: ''})}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Sub-category</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all disabled:opacity-50"
                          value={formData.subcategory_id || ''}
                          onChange={e => {
                            const subId = e.target.value;
                            const sub = subCategories.find(s => s.id === subId);
                            const isDDRCategory = sub && ['ram', 'motherboard', 'processor'].includes(sub.name.toLowerCase());
                            setFormData({
                              ...formData, 
                              subcategory_id: subId,
                              ddr_type: isDDRCategory ? formData.ddr_type : ''
                            });
                          }}
                          disabled={!formData.category_id || availableSubCategories.length === 0}
                        >
                          <option value="">No Sub-category</option>
                          {availableSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {!formData.category_id ? (
                           <p className="text-[9px] text-slate-400 mt-2 font-medium italic">Select a category first</p>
                        ) : availableSubCategories.length === 0 ? (
                           <p className="text-[9px] text-slate-400 mt-2 font-medium italic">No sub-categories for this group</p>
                        ) : null}
                      </div>
                    </div>

                    {showDDRDropdown && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Memory Standard (DDR)</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.ddr_type || ''}
                          onChange={e => setFormData({...formData, ddr_type: e.target.value as any})}
                          required
                        >
                          <option value="">Select DDR Type</option>
                          <option value="DDR4">DDR4</option>
                          <option value="DDR5">DDR5</option>
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Manufacturer</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.brand_id || ''}
                          onChange={e => setFormData({...formData, brand_id: e.target.value})}
                          required
                        >
                          <option value="">Brand</option>
                          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Stock Unit</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.unit_id || ''}
                          onChange={e => setFormData({...formData, unit_id: e.target.value})}
                          required
                        >
                          <option value="">Select Unit</option>
                          {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pricing & Stock</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Base Price (RM)</label>
                        <div className="relative">
                           <Banknote size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input 
                            type="number" 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" 
                            required 
                            value={formData.price || 0} 
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Initial Stock</label>
                        <div className="relative">
                          <Package size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${editingId ? 'text-slate-300' : 'text-slate-400'}`} />
                          <input 
                            type="number" 
                            disabled={!!editingId}
                            className={`w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${editingId ? 'text-slate-400 bg-slate-50/50 cursor-not-allowed border-slate-200' : 'text-slate-900'}`} 
                            required 
                            value={formData.stock || 0} 
                            onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                          />
                        </div>
                        {editingId && (
                          <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                            <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-blue-600 font-bold leading-tight uppercase tracking-tight">
                              Stock edits disabled. Use the <Link to="/admin/stock-take" className="underline hover:text-blue-800 flex items-center gap-1 inline-flex">Stock Take Module <ArrowRight size={8}/></Link> for adjustments.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Discount Type</label>
                        <select 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                          value={formData.discount_type || 'none'}
                          onChange={e => setFormData({...formData, discount_type: e.target.value as any})}
                        >
                          <option value="none">No Discount</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (RM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Discount Value</label>
                        <div className="relative">
                          {formData.discount_type === 'percentage' ? (
                            <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          ) : (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">RM</span>
                          )}
                          <input 
                            type="number" 
                            disabled={formData.discount_type === 'none'}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" 
                            value={formData.discount_value || 0} 
                            onChange={e => setFormData({...formData, discount_value: parseFloat(e.target.value)})} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-4">
                     <label className="flex items-center justify-between p-5 bg-indigo-50/30 border border-indigo-100 rounded-3xl cursor-pointer group hover:bg-indigo-50/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Settings2 size={20} />
                          </div>
                          <div>
                            <span className="block font-bold text-indigo-900 text-sm">Allow Customised Options</span>
                            <span className="text-[10px] text-indigo-500 font-medium uppercase tracking-widest">Enable unique hardware variations</span>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, is_customised: !formData.is_customised})}
                        >
                          {formData.is_customised ? <ToggleRight size={32} className="text-indigo-600" /> : <ToggleLeft size={32} className="text-slate-300" />}
                        </button>
                     </label>
                  </div>
                </div>

                {/* Media & AI */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Media</label>
                    <div className="aspect-video w-full rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group transition-all hover:border-blue-400">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full h-full object-contain p-4" alt="Preview" />
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-2xl">Change Visual</button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} strokeWidth={1} />
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Drop assets here</p>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-6 px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">Upload File</button>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                          <Loader2 className="animate-spin text-blue-600" size={32} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Description</label>
                      <button 
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !formData.name}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 transition-all"
                      >
                        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Auto-Generate
                      </button>
                    </div>
                    <textarea 
                      rows={6}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600 text-sm leading-relaxed"
                      placeholder="Hardware specs, capabilities, and highlights..."
                      value={formData.description || ''}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} className="text-blue-600" /> Additional Details (Text & Images)
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button 
                          type="button"
                          onClick={insertSampleDetails}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg transition-all border border-blue-200/60"
                          title="Populate sample format matching layout"
                        >
                          + Sample Format
                        </button>
                        <button 
                          type="button"
                          onClick={insertFeatureLine}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-all"
                          title="Add bold feature title line"
                        >
                          + Bold Feature
                        </button>
                        <button 
                          type="button"
                          onClick={insertImageTemplate}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-all"
                          title="Insert image markdown"
                        >
                          + Add Image
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowDetailsPreview(!showDetailsPreview)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                            showDetailsPreview ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <Eye size={12} /> {showDetailsPreview ? 'Edit Text' : 'Live Preview'}
                        </button>
                      </div>
                    </div>

                    {showDetailsPreview ? (
                      <div className="p-6 bg-white border border-slate-200 rounded-2xl min-h-[180px] space-y-4 shadow-sm">
                        <div className="text-[10px] font-black uppercase text-blue-600 tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>Live Preview (Product Page Rendering)</span>
                          <span className="text-slate-400 font-normal">Switch to Edit Text to make changes</span>
                        </div>
                        {formData.additional_details ? (
                          <div className="space-y-3.5 text-sm text-slate-800 leading-relaxed font-sans">
                            {formData.additional_details.split('\n').map((line, idx) => {
                              const lineTrim = line.trim();
                              if (!lineTrim) return null;

                              const imgMatch = lineTrim.match(/^!\[(.*?)\]\((.*?)\)$/) || lineTrim.match(/^\[image:\s*(.*?)\]$/i);
                              const isDirectImg = /^https?:\/\/.*\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i.test(lineTrim);
                              const url = imgMatch ? (imgMatch[2] || imgMatch[1]) : (isDirectImg ? lineTrim : '');

                              if (url) {
                                return (
                                  <div key={idx} className="my-3 p-2 bg-slate-50 border border-slate-200 rounded-xl flex justify-center">
                                    <img src={url} alt="Preview" className="max-h-56 object-contain rounded-lg" />
                                  </div>
                                );
                              }

                              if (lineTrim.includes('**')) {
                                const parts = lineTrim.split(/(\*\*.*?\*\*)/g);
                                return (
                                  <p key={idx}>
                                    {parts.map((p, pI) => p.startsWith('**') && p.endsWith('**') ? (
                                      <strong key={pI} className="font-extrabold text-slate-900">{p.slice(2, -2)}</strong>
                                    ) : p)}
                                  </p>
                                );
                              }

                              if (lineTrim.includes(' - ')) {
                                const dIdx = lineTrim.indexOf(' - ');
                                return (
                                  <p key={idx}>
                                    <strong className="font-extrabold text-slate-900">{lineTrim.slice(0, dIdx)}</strong>
                                    {lineTrim.slice(dIdx)}
                                  </p>
                                );
                              }

                              if (lineTrim.includes(':')) {
                                const cIdx = lineTrim.indexOf(':');
                                return (
                                  <p key={idx}>
                                    <strong className="font-extrabold text-slate-900">{lineTrim.slice(0, cIdx)}</strong>
                                    {lineTrim.slice(cIdx)}
                                  </p>
                                );
                              }

                              return <p key={idx}>{lineTrim}</p>;
                            })}
                          </div>
                        ) : (
                          <p className="text-slate-400 text-xs italic">No additional details entered yet. Click "+ Sample Format" above to test!</p>
                        )}
                      </div>
                    ) : (
                      <textarea 
                        rows={8}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600 text-sm leading-relaxed"
                        placeholder="Enter plain text paragraphs, bold feature headings (e.g. **Title** - description), or image URLs / markdown ![Alt](https://...)"
                        value={formData.additional_details || ''}
                        onChange={e => setFormData({...formData, additional_details: e.target.value})}
                      />
                    )}

                    <p className="text-[11px] text-slate-400 font-bold mt-2 flex items-center justify-between">
                      <span>Supports plain text paragraphs, <code>**Bold Title** - Description</code>, and image links <code>![Image](https://...)</code></span>
                      <span className="text-blue-600">Renders on Product Details Page</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Laptop & Desktop Specifications Section */}
              {isDesktopOrLaptopCategory && (
                <div className="space-y-8 bg-slate-50/80 p-6 md:p-8 rounded-[2.5rem] border border-slate-200/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-8 bg-red-600 rounded-full inline-block"></span>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Laptop & Desktop Specification Fields</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Parameters stored in database & shown on single product page</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-200">
                      System Specs Enabled
                    </span>
                  </div>

                  {/* 1. System Specifications */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={16} /> 1. System Specification
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Processor (CPU)</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. AMD Ryzen™ 5 7535HS Processor"
                          value={getSpecValue('Processor')}
                          onChange={e => updateSpecField('Processor', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Graphics (GPU)</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. AMD Radeon™ 660M"
                          value={getSpecValue('Graphics')}
                          onChange={e => updateSpecField('Graphics', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Display / Screen</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 15.6-inch, FHD (1920x1080) 144Hz"
                          value={getSpecValue('Display')}
                          onChange={e => updateSpecField('Display', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Memory (RAM)</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 16GB DDR5 SO-DIMM, Max 64GB"
                          value={getSpecValue('Memory')}
                          onChange={e => updateSpecField('Memory', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Storage (SSD / HDD)</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 512GB M.2 NVMe PCIe 4.0 SSD"
                          value={getSpecValue('Storage')}
                          onChange={e => updateSpecField('Storage', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Security</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Firmware TPM, Fingerprint"
                          value={getSpecValue('Security')}
                          onChange={e => updateSpecField('Security', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Additional Information */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h5 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={16} /> 2. Additional Information
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Operating System</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Windows 11 Home"
                          value={getSpecValue('Operating System')}
                          onChange={e => updateSpecField('Operating System', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Color</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Misty Grey / Eclipse Gray"
                          value={getSpecValue('Color')}
                          onChange={e => updateSpecField('Color', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Included Software</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Microsoft Office Home 2024"
                          value={getSpecValue('Included Software')}
                          onChange={e => updateSpecField('Included Software', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">What's Included?</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Backpack, 65W Power Adapter"
                          value={getSpecValue('Whats Included')}
                          onChange={e => updateSpecField('Whats Included', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Feature Specifications */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h5 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={16} /> 3. Additional Specification / Feature Specification
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Total Weight</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 1.60 kg"
                          value={getSpecValue('Total Weight')}
                          onChange={e => updateSpecField('Total Weight', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Battery & Charging</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 50WHrs, 3-cell Li-ion"
                          value={getSpecValue('Battery & Charging')}
                          onChange={e => updateSpecField('Battery & Charging', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Ports & Slots</label>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 2x USB Type-C, 1x HDMI, 1x RJ45"
                          value={getSpecValue('Ports & Slots')}
                          onChange={e => updateSpecField('Ports & Slots', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Web Camera</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. 720p HD camera with privacy shutter"
                          value={getSpecValue('Web Camera')}
                          onChange={e => updateSpecField('Web Camera', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Keyboard</label>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Backlit Chiclet Keyboard with Num-key"
                          value={getSpecValue('Keyboard')}
                          onChange={e => updateSpecField('Keyboard', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Wireless Connectivity</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                          placeholder="e.g. Wi-Fi 6 (802.11ax) + Bluetooth 5.2"
                          value={getSpecValue('Wireless Connectivity')}
                          onChange={e => updateSpecField('Wireless Connectivity', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="sm:flex-1 py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-[11px]">
                  Cancel
                </button>
                <button type="submit" className="sm:flex-[2] py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                  {editingId ? 'Push Live Update' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
