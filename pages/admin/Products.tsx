
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Upload,
  CloudUpload,
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-slate-50 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-6 md:px-8 py-5 bg-white border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between shrink-0">
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors text-sm">
                  Discard
                </button>
                <button type="submit" form="product-form" className="px-8 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all text-sm">
                  {editingId ? 'Save Changes' : 'Save'}
                </button>
              </div>
            </div>
            
            <form id="product-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8">
              {modalError && (
                <div className="mb-6 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-in fade-in slide-in-from-top-4 duration-300">
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  
                  {/* Product */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900">Product</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                      <input 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all" 
                        required 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter title"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <button 
                          type="button"
                          onClick={handleGenerateAI}
                          disabled={isGenerating || !formData.name}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-medium transition-all"
                        >
                          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          Auto-Generate
                        </button>
                      </div>
                      <textarea 
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-600 text-sm leading-relaxed"
                        placeholder="Product description..."
                        value={formData.description || ''}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <label className="text-sm font-medium text-slate-700">
                          Additional Details (Text & Images)
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button type="button" onClick={insertSampleDetails} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-all border border-slate-200">+ Sample</button>
                          <button type="button" onClick={insertFeatureLine} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-all border border-slate-200">+ Bold</button>
                          <button type="button" onClick={insertImageTemplate} className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition-all border border-slate-200">+ Image</button>
                          <button type="button" onClick={() => setShowDetailsPreview(!showDetailsPreview)} className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 border border-slate-200 ${showDetailsPreview ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                            <Eye size={12} /> {showDetailsPreview ? 'Edit Text' : 'Preview'}
                          </button>
                        </div>
                      </div>

                      {showDetailsPreview ? (
                        <div className="p-4 bg-white border border-slate-200 rounded-xl min-h-[180px] space-y-4">
                          <div className="text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">Live Preview</div>
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
                                      {parts.map((p, pI) => p.startsWith('**') && p.endsWith('**') ? <strong key={pI} className="font-bold text-slate-900">{p.slice(2, -2)}</strong> : p)}
                                    </p>
                                  );
                                }
                                if (lineTrim.includes(' - ')) {
                                  const dIdx = lineTrim.indexOf(' - ');
                                  return (
                                    <p key={idx}>
                                      <strong className="font-bold text-slate-900">{lineTrim.slice(0, dIdx)}</strong>
                                      {lineTrim.slice(dIdx)}
                                    </p>
                                  );
                                }
                                if (lineTrim.includes(':')) {
                                  const cIdx = lineTrim.indexOf(':');
                                  return (
                                    <p key={idx}>
                                      <strong className="font-bold text-slate-900">{lineTrim.slice(0, cIdx)}</strong>
                                      {lineTrim.slice(cIdx)}
                                    </p>
                                  );
                                }
                                return <p key={idx}>{lineTrim}</p>;
                              })}
                            </div>
                          ) : (
                            <p className="text-slate-400 text-xs italic">No details entered.</p>
                          )}
                        </div>
                      ) : (
                        <textarea 
                          rows={8}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-600 text-sm leading-relaxed"
                          placeholder="Supports **Bold Title** - Description or ![Image](https://...)"
                          value={formData.additional_details || ''}
                          onChange={e => setFormData({...formData, additional_details: e.target.value})}
                        />
                      )}
                    </div>
                  </div>

                  {/* Media */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900">Media</h4>
                    <div className="w-full rounded-2xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center p-10 relative overflow-hidden group transition-all hover:border-slate-400">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full max-h-64 object-contain p-2" alt="Preview" />
                          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                            <CloudUpload size={32} className="text-slate-400 mb-3" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium text-sm shadow-sm hover:bg-slate-50">Browse File</button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center flex flex-col items-center">
                          <CloudUpload className="text-slate-900 mb-4" size={32} />
                          <p className="text-sm text-slate-900 font-medium mb-1">Choose a file or drag & drop it here</p>
                          <p className="text-xs text-slate-400 mb-6">JPG or PNG formats, up to 5MB</p>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium text-sm shadow-sm hover:bg-slate-50 transition-all">Browse File</button>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                          <Loader2 className="animate-spin text-slate-900" size={24} />
                          <span className="text-sm font-medium text-slate-900">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>

                  {/* Pricing */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900">Pricing</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Base Price</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all" 
                          required 
                          value={formData.price || 0} 
                          onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type</label>
                        <select 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                          value={formData.discount_type || 'none'}
                          onChange={e => setFormData({...formData, discount_type: e.target.value as any})}
                        >
                          <option value="none">No Discount</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                      {formData.discount_type !== 'none' && (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Discount Value</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all" 
                            value={formData.discount_value || 0} 
                            onChange={e => setFormData({...formData, discount_value: parseFloat(e.target.value)})} 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Variation */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900">Variation</h4>
                    
                    <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div>
                        <span className="block font-medium text-slate-900 text-sm">Allow Customised Options</span>
                        <span className="text-xs text-slate-500">Enable unique hardware variations</span>
                      </div>
                      <button type="button" onClick={() => setFormData({...formData, is_customised: !formData.is_customised})}>
                        {formData.is_customised ? <ToggleRight size={28} className="text-slate-900" /> : <ToggleLeft size={28} className="text-slate-300" />}
                      </button>
                    </label>

                    {isDesktopOrLaptopCategory && (
                      <div className="pt-6 border-t border-slate-100 space-y-6 mt-6">
                        <h4 className="text-sm font-semibold text-slate-900 mb-6">1. SYSTEM SPECIFICATION</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[
                            {l: 'PROCESSOR (CPU)', k: 'Processor', placeholder: 'e.g. AMD Ryzen™ 5 7535HS Processor'},
                            {l: 'GRAPHICS (GPU)', k: 'Graphics', placeholder: 'e.g. AMD Radeon™ 660M'},
                            {l: 'DISPLAY / SCREEN', k: 'Display', placeholder: 'e.g. 15.6-inch, FHD (1920x1080) 144Hz'},
                            {l: 'MEMORY (RAM)', k: 'Memory', placeholder: 'e.g. 16GB DDR5 SO-DIMM, Max 64GB'},
                            {l: 'STORAGE (SSD / HDD)', k: 'Storage', placeholder: 'e.g. 512GB M.2 NVMe PCIe 4.0 SSD'},
                            {l: 'SECURITY', k: 'Security', placeholder: 'e.g. Firmware TPM, Fingerprint'}
                          ].map(spec => (
                            <div key={spec.k}>
                              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{spec.l}</label>
                              <input 
                                type="text"
                                placeholder={spec.placeholder}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-900 transition-all placeholder:text-slate-400"
                                value={getSpecValue(spec.k)}
                                onChange={e => updateSpecField(spec.k, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="my-8 border-t border-slate-100"></div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
                          <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          2. ADDITIONAL INFORMATION
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {[
                            {l: 'OPERATING SYSTEM', k: 'Operating System', placeholder: 'e.g. Windows 11 Home'},
                            {l: 'COLOR', k: 'Color', placeholder: 'e.g. Misty Grey / Eclipse Gray'},
                            {l: 'INCLUDED SOFTWARE', k: 'Included Software', placeholder: 'e.g. Microsoft Office Home 2024'},
                            {l: "WHAT'S INCLUDED?", k: 'Included Items', placeholder: 'e.g. Backpack, 65W Power Adapter'}
                          ].map(spec => (
                            <div key={spec.k}>
                              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{spec.l}</label>
                              <input 
                                type="text"
                                placeholder={spec.placeholder}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-900 transition-all placeholder:text-slate-400"
                                value={getSpecValue(spec.k)}
                                onChange={e => updateSpecField(spec.k, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="my-8 border-t border-slate-100"></div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
                          <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                          3. ADDITIONAL SPECIFICATION / FEATURE SPECIFICATION
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            {l: 'TOTAL WEIGHT', k: 'Total Weight', placeholder: 'e.g. 1.60 kg'},
                            {l: 'BATTERY & CHARGING', k: 'Battery', placeholder: 'e.g. 50WHrs, 3-cell Li-ion'},
                            {l: 'PORTS & SLOTS', k: 'Ports', placeholder: 'e.g. 2x USB Type-C, 1x HDMI, 1x RJ45'},
                            {l: 'WEB CAMERA', k: 'Web Camera', placeholder: 'e.g. 720P HD camera'},
                            {l: 'KEYBOARD', k: 'Keyboard', placeholder: 'e.g. Backlit Chiclet Keyboard'},
                            {l: 'WIRELESS CONNECTIVITY', k: 'Wireless', placeholder: 'e.g. Wi-Fi 6E(802.11ax) (Dual band) 2*2 + Bluetooth® 5.3'}
                          ].map(spec => (
                            <div key={spec.k}>
                              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{spec.l}</label>
                              {spec.k === 'Ports' || spec.k === 'Wireless' ? (
                                <textarea 
                                  rows={2}
                                  placeholder={spec.placeholder}
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-900 transition-all placeholder:text-slate-400"
                                  value={getSpecValue(spec.k)}
                                  onChange={e => updateSpecField(spec.k, e.target.value)}
                                />
                              ) : (
                                <input 
                                  type="text"
                                  placeholder={spec.placeholder}
                                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-900 transition-all placeholder:text-slate-400"
                                  value={getSpecValue(spec.k)}
                                  onChange={e => updateSpecField(spec.k, e.target.value)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 md:space-y-8">
                  {/* Organization */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900">Organization</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Main Category</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all appearance-none"
                        value={formData.category_id || ''}
                        onChange={e => setFormData({...formData, category_id: e.target.value, subcategory_id: ''})}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Sub-category</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturer</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all appearance-none"
                        value={formData.brand_id || ''}
                        onChange={e => setFormData({...formData, brand_id: e.target.value})}
                        required
                      >
                        <option value="">Brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Inventory & Tags */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h4 className="text-lg font-semibold text-slate-900">Inventory</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Initial Stock</label>
                      <input 
                        type="number" 
                        disabled={!!editingId}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all disabled:bg-slate-50 disabled:text-slate-400" 
                        required 
                        value={formData.stock || 0} 
                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                      />
                      {editingId && (
                        <p className="text-xs text-slate-500 mt-2">
                          Use the Stock Take Module to adjust inventory.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Stock Unit</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all appearance-none"
                        value={formData.unit_id || ''}
                        onChange={e => setFormData({...formData, unit_id: e.target.value})}
                        required
                      >
                        <option value="">Select Unit</option>
                        {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                    </div>

                    {showDDRDropdown && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Memory Standard (DDR)</label>
                        <select 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all appearance-none"
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
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
