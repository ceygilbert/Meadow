import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Layers, 
  Type, 
  Share2, 
  LayoutTemplate, 
  Sparkles,
  Download,
  Upload,
  Info
} from 'lucide-react';
import { 
  FooterConfig, 
  FooterColumn, 
  FooterMenuItem, 
  DEFAULT_FOOTER_CONFIG, 
  getFooterConfig, 
  fetchFooterConfig,
  saveFooterConfigAsync, 
  resetFooterConfig 
} from '../../lib/footerConfig';
import Footer from '../../components/Footer';

const FooterSettingsPage: React.FC = () => {
  const [config, setConfig] = useState<FooterConfig>(() => getFooterConfig());
  const [originalConfig, setOriginalConfig] = useState<FooterConfig>(() => getFooterConfig());
  const [activeTab, setActiveTab] = useState<'menus' | 'content' | 'social'>('menus');
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cached = getFooterConfig();
    setConfig(cached);
    setOriginalConfig(JSON.parse(JSON.stringify(cached)));
    fetchFooterConfig().then((serverConfig) => {
      if (serverConfig) {
        setConfig(serverConfig);
        setOriginalConfig(JSON.parse(JSON.stringify(serverConfig)));
      }
    });
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ok = await saveFooterConfigAsync(config);
      setOriginalConfig(JSON.parse(JSON.stringify(config)));
      setIsDirty(false);
      if (ok) {
        showToast("Footer configuration saved successfully and synced to database across all browsers!", 'success');
      } else {
        showToast("Footer saved locally and queued for database sync.", 'info');
      }
    } catch (err: any) {
      showToast("Error saving footer config: " + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setConfig(JSON.parse(JSON.stringify(originalConfig)));
    setIsDirty(false);
    showToast("Unsaved changes reverted.", 'info');
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all footer menus and texts to default values?")) {
      const def = await resetFooterConfig();
      setConfig(def);
      setIsDirty(false);
      showToast("Footer settings reset to factory defaults across all browsers.", 'info');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meadow_footer_config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Footer settings JSON exported successfully.", 'info');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.columns)) {
          setConfig({
            ...DEFAULT_FOOTER_CONFIG,
            ...parsed
          });
          setIsDirty(true);
          showToast("JSON configuration loaded. Click 'Save Changes' to apply.", 'info');
        } else {
          showToast("Invalid JSON file format.", 'error');
        }
      } catch (err) {
        showToast("Failed to parse JSON file.", 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ----------------------------------------------------
  // Column Handlers
  // ----------------------------------------------------
  const moveColumn = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.columns.length) return;

    const newColumns = [...config.columns];
    const temp = newColumns[index];
    newColumns[index] = newColumns[targetIndex];
    newColumns[targetIndex] = temp;

    setConfig({ ...config, columns: newColumns });
    setIsDirty(true);
  };

  const updateColumnTitle = (colId: string, newTitle: string) => {
    setConfig({
      ...config,
      columns: config.columns.map(col => col.id === colId ? { ...col, title: newTitle } : col)
    });
    setIsDirty(true);
  };

  const toggleColumnVisibility = (colId: string) => {
    setConfig({
      ...config,
      columns: config.columns.map(col => col.id === colId ? { ...col, isVisible: col.isVisible === false ? true : false } : col)
    });
    setIsDirty(true);
  };

  const addColumn = () => {
    const newColId = `col-${Date.now()}`;
    const newCol: FooterColumn = {
      id: newColId,
      title: "New Menu Column",
      isVisible: true,
      items: [
        { id: `item-${Date.now()}-1`, name: "New Link", url: "/", isVisible: true }
      ]
    };
    setConfig({
      ...config,
      columns: [...config.columns, newCol]
    });
    setIsDirty(true);
    showToast("Added new menu column.", 'info');
  };

  const deleteColumn = (colId: string) => {
    if (config.columns.length <= 1) {
      showToast("You must keep at least one footer menu column.", 'error');
      return;
    }
    if (window.confirm("Are you sure you want to delete this menu column and all its links?")) {
      setConfig({
        ...config,
        columns: config.columns.filter(col => col.id !== colId)
      });
      setIsDirty(true);
      showToast("Menu column removed.", 'info');
    }
  };

  // ----------------------------------------------------
  // Menu Item Handlers
  // ----------------------------------------------------
  const moveItem = (colId: string, itemIndex: number, direction: 'up' | 'down') => {
    const colIndex = config.columns.findIndex(c => c.id === colId);
    if (colIndex === -1) return;

    const targetCol = config.columns[colIndex];
    const targetItemIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    if (targetItemIndex < 0 || targetItemIndex >= targetCol.items.length) return;

    const newItems = [...targetCol.items];
    const temp = newItems[itemIndex];
    newItems[itemIndex] = newItems[targetItemIndex];
    newItems[targetItemIndex] = temp;

    const newColumns = [...config.columns];
    newColumns[colIndex] = { ...targetCol, items: newItems };

    setConfig({ ...config, columns: newColumns });
    setIsDirty(true);
  };

  const updateItem = (colId: string, itemId: string, field: keyof FooterMenuItem, value: any) => {
    setConfig({
      ...config,
      columns: config.columns.map(col => {
        if (col.id !== colId) return col;
        return {
          ...col,
          items: col.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
        };
      })
    });
    setIsDirty(true);
  };

  const toggleItemVisibility = (colId: string, itemId: string) => {
    setConfig({
      ...config,
      columns: config.columns.map(col => {
        if (col.id !== colId) return col;
        return {
          ...col,
          items: col.items.map(item => item.id === itemId ? { ...item, isVisible: item.isVisible === false ? true : false } : item)
        };
      })
    });
    setIsDirty(true);
  };

  const addItem = (colId: string) => {
    const newItem: FooterMenuItem = {
      id: `item-${Date.now()}`,
      name: "New Page Link",
      url: "/products",
      isVisible: true,
      openInNewTab: false
    };

    setConfig({
      ...config,
      columns: config.columns.map(col => {
        if (col.id !== colId) return col;
        return {
          ...col,
          items: [...col.items, newItem]
        };
      })
    });
    setIsDirty(true);
  };

  const deleteItem = (colId: string, itemId: string) => {
    setConfig({
      ...config,
      columns: config.columns.map(col => {
        if (col.id !== colId) return col;
        return {
          ...col,
          items: col.items.filter(item => item.id !== itemId)
        };
      })
    });
    setIsDirty(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all animate-in fade-in slide-in-from-top duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-900/95 text-white border-emerald-700' 
            : toast.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : 'bg-slate-900/95 text-white border-slate-700'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
          ) : (
            <Info size={18} className="text-blue-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Footer Settings</h1>
          <p className="text-slate-500 text-xs mt-1">Configure footer columns, links, copyright, and social media channels.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Revert unsaved changes"
          >
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Save size={15} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('menus')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'menus'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers size={16} />
          <span>Footer Menus ({config.columns.length} Columns)</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'content'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Type size={16} />
          <span>Texts &amp; Copyright</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'social'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Share2 size={16} />
          <span>Newsletter &amp; Social Links</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: FOOTER MENUS & COLUMNS (RE-ARRANGE & EDIT)     */}
      {/* ==================================================== */}
      {activeTab === 'menus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Info size={16} className="text-[#c5161d] shrink-0" />
              <span>
                Use the <strong>Left / Right</strong> arrows to re-order columns, and <strong>Up / Down</strong> arrows to re-arrange links inside each menu. You can edit the <strong>display name</strong> and destination link directly.
              </span>
            </div>

            <button
              onClick={addColumn}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus size={14} className="text-[#c5161d]" />
              <span>Add Column</span>
            </button>
          </div>

          {/* Grid of Menu Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.columns.map((column, colIdx) => (
              <div 
                key={column.id} 
                className={`bg-white rounded-2xl border transition-all shadow-sm flex flex-col justify-between ${
                  column.isVisible === false 
                    ? 'border-dashed border-slate-300 opacity-60' 
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Column {colIdx + 1}
                    </span>
                    
                    {/* Re-order Column & Visibility Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveColumn(colIdx, 'left')}
                        disabled={colIdx === 0}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move column left"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <button
                        onClick={() => moveColumn(colIdx, 'right')}
                        disabled={colIdx === config.columns.length - 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move column right"
                      >
                        <ChevronRight size={16} />
                      </button>

                      <button
                        onClick={() => toggleColumnVisibility(column.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          column.isVisible !== false 
                            ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200' 
                            : 'text-amber-600 bg-amber-50'
                        }`}
                        title={column.isVisible !== false ? "Hide Column" : "Show Column"}
                      >
                        {column.isVisible !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>

                      <button
                        onClick={() => deleteColumn(column.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Column"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Editable Column Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Column Title
                    </label>
                    <input
                      type="text"
                      value={column.title}
                      onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                      placeholder="e.g. Company, Shop With Us"
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d]"
                    />
                  </div>
                </div>

                {/* Menu Items List inside this Column */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Menu Items ({column.items.length})
                    </span>
                    <button
                      onClick={() => addItem(column.id)}
                      className="text-[11px] font-bold text-[#c5161d] hover:text-[#a81318] flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Add Item</span>
                    </button>
                  </div>

                  {column.items.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No items in this menu. Click "Add Item" above.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {column.items.map((item, itemIdx) => (
                        <div 
                          key={item.id}
                          className={`p-3 rounded-xl border transition-all text-xs ${
                            item.isVisible === false 
                              ? 'bg-slate-50/60 border-dashed border-slate-200 opacity-60' 
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              #{itemIdx + 1}
                            </span>

                            {/* Item Action Controls */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveItem(column.id, itemIdx, 'up')}
                                disabled={itemIdx === 0}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                                title="Move link up"
                              >
                                <MoveUp size={13} />
                              </button>

                              <button
                                onClick={() => moveItem(column.id, itemIdx, 'down')}
                                disabled={itemIdx === column.items.length - 1}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                                title="Move link down"
                              >
                                <MoveDown size={13} />
                              </button>

                              <button
                                onClick={() => toggleItemVisibility(column.id, item.id)}
                                className={`p-1 rounded transition-colors ${
                                  item.isVisible !== false 
                                    ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
                                    : 'text-amber-600 bg-amber-50'
                                }`}
                                title={item.isVisible !== false ? "Hide Link" : "Show Link"}
                              >
                                {item.isVisible !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                              </button>

                              <button
                                onClick={() => deleteItem(column.id, item.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                title="Delete Link"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Editable Display Name */}
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Display Name <span className="text-[#c5161d]">*</span>
                              </label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(column.id, item.id, 'name', e.target.value)}
                                placeholder="e.g. BUILD YOUR OWN PC"
                                className="w-full h-8 px-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                              />
                            </div>

                            {/* Editable Link URL */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Link URL
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={item.url}
                                  onChange={(e) => updateItem(column.id, item.id, 'url', e.target.value)}
                                  placeholder="e.g. /customised or https://..."
                                  className="w-full h-8 pl-7 pr-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                                />
                                <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              </div>
                              <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                <span className="text-[9px] font-bold text-slate-400">Quick:</span>
                                {[
                                  { name: 'Suppliers', url: '/suppliers' },
                                  { name: 'Our Story', url: '/our-story' },
                                  { name: 'Our Store', url: '/our-stores' },
                                  { name: 'Events', url: '/events' },
                                  { name: 'Contact', url: '/contact' },
                                  { name: 'Track Order', url: '/track-order' }
                                ].map(preset => (
                                  <button
                                    key={preset.url}
                                    type="button"
                                    onClick={() => {
                                      updateItem(column.id, item.id, 'url', preset.url);
                                      if (!item.name || item.name === 'New Page Link') {
                                        updateItem(column.id, item.id, 'name', preset.name);
                                      }
                                    }}
                                    className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[9px] font-medium transition-colors cursor-pointer"
                                  >
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Open in new tab checkbox */}
                            <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!item.openInNewTab}
                                onChange={(e) => updateItem(column.id, item.id, 'openInNewTab', e.target.checked)}
                                className="rounded text-[#c5161d] focus:ring-[#c5161d]"
                              />
                              <span>Open in new window / tab</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                  <button
                    onClick={() => addItem(column.id)}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus size={13} className="text-[#c5161d]" />
                    <span>Add Item to {column.title || 'Column'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: TEXTS & COPYRIGHT                             */}
      {/* ==================================================== */}
      {activeTab === 'content' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Company Description &amp; Titles</h2>
            <p className="text-xs text-slate-500">Edit the description text that appears below the logo and section headings.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Description Text
              </label>
              <textarea
                rows={3}
                value={config.description}
                onChange={(e) => {
                  setConfig({ ...config, description: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="e.g. IT retail, distribution and custom PC solutions..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">Appears underneath the Meadow logo on the left footer column.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Method Title
                </label>
                <input
                  type="text"
                  value={config.paymentTitle}
                  onChange={(e) => {
                    setConfig({ ...config, paymentTitle: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Logistic Services Title
                </label>
                <input
                  type="text"
                  value={config.logisticTitle}
                  onChange={(e) => {
                    setConfig({ ...config, logisticTitle: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Copyright Notice Text
              </label>
              <input
                type="text"
                value={config.copyrightText}
                onChange={(e) => {
                  setConfig({ ...config, copyrightText: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="© {year} MEADOW COMPUTER - ALL RIGHT RESERVED"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: <code className="text-[#c5161d] bg-red-50 px-1 py-0.5 rounded">{'{year}'}</code> will automatically be replaced with the current year ({new Date().getFullYear()}).
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Registration / SSM Number
              </label>
              <input
                type="text"
                value={config.ssmNumber || ''}
                onChange={(e) => {
                  setConfig({ ...config, ssmNumber: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="e.g. 201001037969 [921893-M]"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Appears directly below the copyright line in the footer bottom bar. Leave blank if not applicable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: NEWSLETTER & SOCIAL LINKS                     */}
      {/* ==================================================== */}
      {activeTab === 'social' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Newsletter &amp; Social Channels</h2>
            <p className="text-xs text-slate-500">Configure promotional newsletter text and social profile links.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Newsletter Section Title
              </label>
              <input
                type="text"
                value={config.newsletterTitle}
                onChange={(e) => {
                  setConfig({ ...config, newsletterTitle: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Newsletter Description
              </label>
              <textarea
                rows={2}
                value={config.newsletterText}
                onChange={(e) => {
                  setConfig({ ...config, newsletterText: e.target.value });
                  setIsDirty(true);
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Social Media URLs</h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Facebook Page URL</label>
                <input
                  type="text"
                  value={config.socialLinks?.facebook || ''}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, facebook: e.target.value }
                    });
                    setIsDirty(true);
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={config.socialLinks?.instagram || ''}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, instagram: e.target.value }
                    });
                    setIsDirty(true);
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">TikTok URL</label>
                <input
                  type="text"
                  value={config.socialLinks?.tiktok || ''}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, tiktok: e.target.value }
                    });
                    setIsDirty(true);
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp Chat / Channel URL</label>
                <input
                  type="text"
                  value={config.socialLinks?.whatsapp || ''}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, whatsapp: e.target.value }
                    });
                    setIsDirty(true);
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Xiaohongshu (RED) Profile URL</label>
                <input
                  type="text"
                  value={config.socialLinks?.xiaohongshu || ''}
                  onChange={(e) => {
                    setConfig({
                      ...config,
                      socialLinks: { ...config.socialLinks, xiaohongshu: e.target.value }
                    });
                    setIsDirty(true);
                  }}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FooterSettingsPage;
