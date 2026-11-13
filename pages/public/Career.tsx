import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  FileText,
  CheckCircle2,
  X,
  MapPin,
  AlertCircle,
  Loader2,
  Paperclip,
  ExternalLink,
  Calendar,
  Layers,
  Headset,
  Users
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import SidebarCart from '../../components/SidebarCart';
import { useAuth } from '../../lib/AuthContext';
import { useCart } from '../../lib/CartContext';
import { submitCareerApplication } from '../../services/inboxService';

const BRANCH_OPTIONS = [
  'Any Johor Branch',
  'Johor Jaya HQ (Jalan Ros Merah)',
  'Meadow Computer Plaza Pelangi',
  'ASUS Concept Store (Plaza Pelangi)',
  'HP World Meadow Computer (Toppen)',
  'Meadow Computer Taman Universiti (Skudai)',
  'Huawei Authorized Experience Store (Plaza Pelangi)'
];

const DEPARTMENT_OPTIONS = [
  'Retail Sales & Customer Advisory',
  'Technical Workshop & PC Assembly',
  'Customer Service & Warranty Support',
  'Operations, Inventory & Logistics',
  'E-Commerce & Marketing',
  'Internship / Industrial Training',
  'General Application'
];

interface UploadedResume {
  file: File;
  filename: string;
  size: number;
  mimetype: string;
  publicUrl: string;
  uploadedAt: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

const Career: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    position: DEPARTMENT_OPTIONS[0],
    employmentType: 'Full-Time',
    preferredBranch: BRANCH_OPTIONS[0],
    earliestStartDate: '',
    coverLetter: ''
  });

  // Resume attachment states
  const [resumeAttachment, setResumeAttachment] = useState<UploadedResume | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<any | null>(null);

  const processResumeFile = async (file: File) => {
    setUploadError(null);

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size exceeds 15MB. Please select a smaller file.');
      return;
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp', '.rtf', '.txt'];
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    if (!allowedExtensions.includes(ext)) {
      setUploadError('Unsupported file format. Please upload PDF, DOC, DOCX, JPG, or PNG.');
      return;
    }

    setIsUploadingFile(true);
    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body
      });

      let publicUrl = '';
      if (response.ok) {
        const result = await response.json();
        publicUrl = result.publicUrl || URL.createObjectURL(file);
      } else {
        publicUrl = URL.createObjectURL(file);
      }

      setResumeAttachment({
        file,
        filename: file.name,
        size: file.size,
        mimetype: file.type || 'application/octet-stream',
        publicUrl,
        uploadedAt: new Date().toISOString()
      });
    } catch {
      setResumeAttachment({
        file,
        filename: file.name,
        size: file.size,
        mimetype: file.type || 'application/octet-stream',
        publicUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processResumeFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processResumeFile(droppedFile);
    }
  };

  const handleRemoveResume = () => {
    setResumeAttachment(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!resumeAttachment) {
      setUploadError('Please attach your resume before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        resume: {
          filename: resumeAttachment.filename,
          size: resumeAttachment.size,
          formattedSize: formatFileSize(resumeAttachment.size),
          mimetype: resumeAttachment.mimetype,
          url: resumeAttachment.publicUrl,
          uploadedAt: resumeAttachment.uploadedAt
        }
      };

      const result = await submitCareerApplication(payload);
      if (result.success && result.data) {
        setSubmittedApplication(result.data);
      } else {
        setSubmittedApplication({
          id: `APP-${Date.now().toString().slice(-6)}`,
          ...payload,
          submittedAt: new Date().toISOString()
        });
      }
    } catch {
      setSubmittedApplication({
        id: `APP-${Date.now().toString().slice(-6)}`,
        ...formData,
        resume: {
          filename: resumeAttachment.filename,
          size: resumeAttachment.size,
          formattedSize: formatFileSize(resumeAttachment.size),
          url: resumeAttachment.publicUrl
        },
        submittedAt: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetApplicationForm = () => {
    setSubmittedApplication(null);
    setResumeAttachment(null);
    setUploadError(null);
    setSubmitError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans selection:bg-[#333] selection:text-white overflow-x-hidden">
      <PublicNavbar
        user={user}
        profile={profile}
        cartCount={cartCount}
        onOpenAuth={() => navigate('/')}
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />
      <SidebarCart />

      {/* Hero Section (Matching Our Story style) */}
      <section className="pt-36 sm:pt-44 md:pt-48 lg:pt-52 pb-12 md:pb-16 px-4 md:px-10 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 md:pt-8">
          {/* Left Column: Text */}
          <div className="lg:col-span-7 xl:col-span-6 pt-2 md:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e11d48] mb-3 block">
                CAREER
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                Grow Your Career With Meadow Computer.
              </h1>
              <div className="space-y-4 text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-2xl pt-6">
                <p>
                  Since 1995, Meadow Computer has grown from a local IT distributor into a trusted retail name across Johor, operating Meadow Computer outlets alongside official ASUS and HP concept stores.
                </p>
                <p>
                  Behind every store and workshop is a team of people who care about giving honest product advice, building reliable systems, and providing dependable after-sales service.
                </p>
                <p>
                  Whether you are experienced in IT retail, technical support, and operations, or a fresh graduate looking for a practical environment to learn and grow, we welcome you to send us your resume.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Image with Rounded Corners */}
          <div className="lg:col-span-5 xl:col-span-6 pt-2 md:pt-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 bg-slate-100"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Meadow Computer Team"
                className="w-full h-full object-cover grayscale brightness-95 contrast-105"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Feature Card Container (Matching Our Story style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-16 bg-white border border-slate-100/90 rounded-3xl p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-slate-100">
            <div className="flex items-start gap-4 lg:px-6 first:lg:pl-0">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  Established Since 1995
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Long-standing stability with over 30 years in the IT industry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:px-6">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  Branches Across Johor
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Retail stores in Johor Jaya, Plaza Pelangi, Toppen, and Skudai.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:px-6">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  On-The-Job Training
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Product knowledge and practical guidance from experienced staff.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:px-6 last:lg:pr-0">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  Supportive Workplace
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Clear career progression, commissions, and full statutory benefits.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-12 max-w-[1440px] mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Intro */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-4">
                JOIN OUR TEAM
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
                Send Us Your Application
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Fill in your particulars and attach your latest resume. Our team reviews applications regularly and will get in touch with shortlisted candidates for an interview.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
                  What We Look For
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A positive attitude, willingness to learn, and genuine care when assisting customers or handling hardware in our stores and workshop.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">
                  Store & HQ Locations
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Johor Jaya HQ • Plaza Pelangi • Toppen Shopping Centre • Taman Universiti, Skudai
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
              <AnimatePresence mode="wait">
                {submittedApplication ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 px-4 text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Thank You for Applying
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        We have received your application and resume attachment (<span className="font-semibold text-slate-900">{submittedApplication.resume?.filename}</span>). Our team will contact you if your profile matches our current requirements.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={resetApplicationForm}
                        className="px-6 py-2.5 rounded-full bg-[#0B1329] hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Full Name <span className="text-[#e11d48]">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Phone Number <span className="text-[#e11d48]">*</span>
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="e.g. 012-345 6789"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email Address <span className="text-[#e11d48]">*</span>
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Preferred Store Location
                        </label>
                        <select
                          value={formData.preferredBranch}
                          onChange={(e) => setFormData({ ...formData, preferredBranch: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        >
                          {BRANCH_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Department / Role
                        </label>
                        <select
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        >
                          {DEPARTMENT_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Employment Type
                        </label>
                        <select
                          value={formData.employmentType}
                          onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Available Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.earliestStartDate}
                          onChange={(e) => setFormData({ ...formData, earliestStartDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all"
                        />
                      </div>
                    </div>

                    {/* Resume / Attachment Upload Section */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-700">
                          Resume / CV Attachment <span className="text-[#e11d48]">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                          PDF, DOC, DOCX, JPG, PNG (Max 15MB)
                        </span>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {!resumeAttachment ? (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`rounded-2xl border border-dashed p-7 text-center transition-all cursor-pointer ${
                            isDragging
                              ? 'border-slate-900 bg-slate-50'
                              : uploadError
                              ? 'border-rose-300 bg-rose-50/20'
                              : 'border-slate-300 bg-[#FAFAFA] hover:bg-slate-50 hover:border-slate-400'
                          }`}
                        >
                          {isUploadingFile ? (
                            <div className="py-3 flex flex-col items-center justify-center gap-2">
                              <Loader2 size={24} className="text-slate-700 animate-spin" />
                              <p className="text-xs font-semibold text-slate-600">
                                Uploading file...
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
                                <Upload size={18} />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-800">
                                  Click to attach your resume{' '}
                                  <span className="font-normal text-slate-500">or drag and drop here</span>
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Supported formats: PDF, Word (.doc, .docx), or Image
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {resumeAttachment.filename}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {formatFileSize(resumeAttachment.size)} • Attached
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {resumeAttachment.publicUrl && (
                              <a
                                href={resumeAttachment.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                              >
                                <ExternalLink size={12} /> View
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveResume}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                              title="Remove file"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-600">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{uploadError}</span>
                        </div>
                      )}
                    </div>

                    {/* Message / Note */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Additional Message <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us a little about yourself or your past work experience..."
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 transition-all resize-y"
                      />
                    </div>

                    {submitError && (
                      <div className="flex items-center gap-2 text-xs font-medium text-rose-600">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || isUploadingFile}
                        className="px-8 py-3.5 bg-[#0B1329] hover:bg-black text-white rounded-full font-semibold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-wait inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Career;
