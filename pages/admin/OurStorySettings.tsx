import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Award, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { OurStorySettings, AwardCardItem } from '../../types';
import { fetchOurStorySettings, saveOurStorySettings, DEFAULT_OUR_STORY_SETTINGS } from '../../services/ourStoryService';

const OurStorySettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<OurStorySettings>(DEFAULT_OUR_STORY_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal / Editing state for Award Cards
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [cardFormData, setCardFormData] = useState<AwardCardItem>({
    id: '',
    company: '',
    type: '',
    logo_url: '',
    awards: [''],
    duration: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchOurStorySettings();
      setSettings(data);
    } catch (err: any) {
      showToast('error', 'Failed to load Our Story settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveOurStorySettings(settings);
      showToast('success', res.message || 'Our Story settings saved successfully!');
    } catch (err: any) {
      showToast('error', 'Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset Our Story settings back to system defaults?')) {
      setSettings(DEFAULT_OUR_STORY_SETTINGS);
      showToast('success', 'Reset to defaults. Click "Save Changes" to persist.');
    }
  };

  // Award Card Handlers
  const openAddCardModal = () => {
    setEditingCardIndex(-1);
    setCardFormData({
      id: 'card_' + Date.now(),
      company: '',
      type: 'Computer Hardware Company',
      logo_url: '',
      awards: [''],
      duration: 'Award Winner'
    });
  };

  const openEditCardModal = (index: number) => {
    setEditingCardIndex(index);
    setCardFormData({
      ...settings.award_cards[index],
      awards: [...(settings.award_cards[index].awards || [''])]
    });
  };

  const handleSaveCard = () => {
    if (!cardFormData.company.trim()) {
      alert('Please enter a company name.');
      return;
    }

    const filteredAwards = cardFormData.awards.filter(a => a.trim() !== '');

    const updatedCard: AwardCardItem = {
      ...cardFormData,
      awards: filteredAwards.length > 0 ? filteredAwards : ['Award Winner']
    };

    const newCards = [...(settings.award_cards || [])];
    if (editingCardIndex === -1) {
      newCards.push(updatedCard);
    } else if (editingCardIndex !== null && editingCardIndex >= 0) {
      newCards[editingCardIndex] = updatedCard;
    }

    setSettings({ ...settings, award_cards: newCards });
    setEditingCardIndex(null);
  };

  const handleDeleteCard = (index: number) => {
    if (window.confirm('Delete this award card?')) {
      const newCards = settings.award_cards.filter((_, i) => i !== index);
      setSettings({ ...settings, award_cards: newCards });
    }
  };

  const handleAddAwardBullet = () => {
    setCardFormData({
      ...cardFormData,
      awards: [...cardFormData.awards, '']
    });
  };

  const handleAwardBulletChange = (index: number, val: string) => {
    const updated = [...cardFormData.awards];
    updated[index] = val;
    setCardFormData({ ...cardFormData, awards: updated });
  };

  const handleRemoveAwardBullet = (index: number) => {
    if (cardFormData.awards.length <= 1) return;
    const updated = cardFormData.awards.filter((_, i) => i !== index);
    setCardFormData({ ...cardFormData, awards: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading Our Story Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-xs font-bold uppercase tracking-wider ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Our Story Module</h1>
            <p className="text-xs text-slate-400 font-medium">Customize copy, section text, and images for the /our-story page</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw size={16} />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Section 1: Hero Banner */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Sparkles className="text-amber-500" size={20} />
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">1. Hero Section</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Eyebrow Label</label>
              <input
                type="text"
                value={settings.hero_eyebrow || ''}
                onChange={(e) => setSettings({ ...settings, hero_eyebrow: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                placeholder="e.g. Our Story"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Main Headline</label>
              <textarea
                rows={2}
                value={settings.hero_title || ''}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                placeholder="e.g. 30 Years as Johor Leading Retailers and Distributors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Paragraph 1</label>
              <textarea
                rows={3}
                value={settings.hero_paragraph_1 || ''}
                onChange={(e) => setSettings({ ...settings, hero_paragraph_1: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Paragraph 2</label>
              <textarea
                rows={3}
                value={settings.hero_paragraph_2 || ''}
                onChange={(e) => setSettings({ ...settings, hero_paragraph_2: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Hero Image URL</label>
            <input
              type="text"
              value={settings.hero_image_url || ''}
              onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 mb-3"
              placeholder="https://..."
            />
            <div className="relative aspect-video rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
              {settings.hero_image_url ? (
                <img src={settings.hero_image_url} alt="Hero Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <ImageIcon size={32} className="mx-auto mb-2" />
                  <p className="text-xs font-medium">No Image URL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Foundations / Philosophy */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Building2 className="text-blue-500" size={20} />
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">2. Foundations / Philosophy Section</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Eyebrow Label</label>
              <input
                type="text"
                value={settings.foundations_eyebrow || ''}
                onChange={(e) => setSettings({ ...settings, foundations_eyebrow: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Philosophy Headline</label>
              <textarea
                rows={2}
                value={settings.foundations_title || ''}
                onChange={(e) => setSettings({ ...settings, foundations_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700">Feature 1</h3>
              <input
                type="text"
                value={settings.foundations_feature1_title || ''}
                onChange={(e) => setSettings({ ...settings, foundations_feature1_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Feature 1 Title"
              />
              <textarea
                rows={2}
                value={settings.foundations_feature1_desc || ''}
                onChange={(e) => setSettings({ ...settings, foundations_feature1_desc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Feature 1 Description"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700">Feature 2</h3>
              <input
                type="text"
                value={settings.foundations_feature2_title || ''}
                onChange={(e) => setSettings({ ...settings, foundations_feature2_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Feature 2 Title"
              />
              <textarea
                rows={2}
                value={settings.foundations_feature2_desc || ''}
                onChange={(e) => setSettings({ ...settings, foundations_feature2_desc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Feature 2 Description"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Side Image URL</label>
            <input
              type="text"
              value={settings.foundations_image_url || ''}
              onChange={(e) => setSettings({ ...settings, foundations_image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 mb-3"
            />
            <div className="relative aspect-[3/4] max-h-[400px] mx-auto rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
              {settings.foundations_image_url ? (
                <img src={settings.foundations_image_url} alt="Foundations Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <ImageIcon size={32} className="mx-auto mb-2" />
                  <p className="text-xs font-medium">No Image URL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Distribution & Locations */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Building2 className="text-indigo-500" size={20} />
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">3. Locations / Distribution Section</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Eyebrow Label</label>
              <input
                type="text"
                value={settings.locations_eyebrow || ''}
                onChange={(e) => setSettings({ ...settings, locations_eyebrow: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Section Title</label>
              <input
                type="text"
                value={settings.locations_title || ''}
                onChange={(e) => setSettings({ ...settings, locations_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
              <textarea
                rows={3}
                value={settings.locations_desc || ''}
                onChange={(e) => setSettings({ ...settings, locations_desc: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Button Text</label>
                <input
                  type="text"
                  value={settings.locations_btn_text || ''}
                  onChange={(e) => setSettings({ ...settings, locations_btn_text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Button Link</label>
                <input
                  type="text"
                  value={settings.locations_btn_link || ''}
                  onChange={(e) => setSettings({ ...settings, locations_btn_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Location Banner Image URL</label>
            <input
              type="text"
              value={settings.locations_image_url || ''}
              onChange={(e) => setSettings({ ...settings, locations_image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 mb-3"
            />
            <div className="relative aspect-video rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
              {settings.locations_image_url ? (
                <img src={settings.locations_image_url} alt="Locations Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <ImageIcon size={32} className="mx-auto mb-2" />
                  <p className="text-xs font-medium">No Image URL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Multi-Award Cards */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Award className="text-rose-500" size={20} />
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">4. Multi-Award Cards Section</h2>
          </div>
          <button
            onClick={openAddCardModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Plus size={16} /> Add Award Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Awards Section Title</label>
            <input
              type="text"
              value={settings.awards_section_title || ''}
              onChange={(e) => setSettings({ ...settings, awards_section_title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Award Tag Label</label>
            <input
              type="text"
              value={settings.awards_tag_label || ''}
              onChange={(e) => setSettings({ ...settings, awards_tag_label: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Awards Overview Description</label>
            <textarea
              rows={2}
              value={settings.awards_section_desc || ''}
              onChange={(e) => setSettings({ ...settings, awards_section_desc: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>
        </div>

        {/* Existing Award Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(settings.award_cards || []).map((card, idx) => (
            <div key={card.id || idx} className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col justify-between space-y-4 relative group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {card.logo_url ? (
                      <img src={card.logo_url} alt={card.company} className="w-10 h-10 object-contain bg-white rounded-xl p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">
                        {card.company.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-white">{card.company}</h3>
                      <p className="text-[10px] text-slate-400">{card.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCardModal(idx)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCard(idx)}
                      className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <ul className="space-y-1.5 pl-2 text-xs text-slate-300">
                  {(card.awards || []).map((a, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] font-bold text-rose-400">
                {card.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Our Commitment & Values */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <ShieldCheck className="text-emerald-500" size={20} />
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">5. Our Commitment & Values</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Eyebrow Label</label>
              <input
                type="text"
                value={settings.commitment_eyebrow || ''}
                onChange={(e) => setSettings({ ...settings, commitment_eyebrow: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Commitment Quote</label>
              <input
                type="text"
                value={settings.commitment_quote || ''}
                onChange={(e) => setSettings({ ...settings, commitment_quote: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-700">Value 1</label>
              <input
                type="text"
                value={settings.val1_title || ''}
                onChange={(e) => setSettings({ ...settings, val1_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Title (e.g. Integrity)"
              />
              <textarea
                rows={3}
                value={settings.val1_desc || ''}
                onChange={(e) => setSettings({ ...settings, val1_desc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Description"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-700">Value 2</label>
              <input
                type="text"
                value={settings.val2_title || ''}
                onChange={(e) => setSettings({ ...settings, val2_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Title (e.g. Mastery)"
              />
              <textarea
                rows={3}
                value={settings.val2_desc || ''}
                onChange={(e) => setSettings({ ...settings, val2_desc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Description"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <label className="block text-xs font-bold uppercase text-slate-700">Value 3</label>
              <input
                type="text"
                value={settings.val3_title || ''}
                onChange={(e) => setSettings({ ...settings, val3_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Title (e.g. Support)"
              />
              <textarea
                rows={3}
                value={settings.val3_desc || ''}
                onChange={(e) => setSettings({ ...settings, val3_desc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                placeholder="Description"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add Award Card Modal */}
      {editingCardIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
              {editingCardIndex === -1 ? 'Add New Award Card' : 'Edit Award Card'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={cardFormData.company}
                  onChange={(e) => setCardFormData({ ...cardFormData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  placeholder="e.g. ASUSTeK Computer Inc"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Company Type / Subtitle</label>
                <input
                  type="text"
                  value={cardFormData.type}
                  onChange={(e) => setCardFormData({ ...cardFormData, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  placeholder="e.g. Computer Hardware Company"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Company Logo Image URL (Optional)</label>
                <input
                  type="text"
                  value={cardFormData.logo_url || ''}
                  onChange={(e) => setCardFormData({ ...cardFormData, logo_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Winner Tag / Duration</label>
                <input
                  type="text"
                  value={cardFormData.duration}
                  onChange={(e) => setCardFormData({ ...cardFormData, duration: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  placeholder="e.g. Consecutively 2015-2023 Award Winner"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Award Bullets</label>
                  <button
                    type="button"
                    onClick={handleAddAwardBullet}
                    className="text-[10px] font-bold uppercase text-blue-600 hover:text-blue-800"
                  >
                    + Add Bullet
                  </button>
                </div>
                <div className="space-y-2">
                  {cardFormData.awards.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleAwardBulletChange(bIdx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                        placeholder="e.g. Millions Dollar Award"
                      />
                      {cardFormData.awards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAwardBullet(bIdx)}
                          className="p-2 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCardIndex(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCard}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurStorySettingsPage;
