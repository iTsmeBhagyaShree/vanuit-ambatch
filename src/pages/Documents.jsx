import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Image as ImageIcon, FileArchive, File, 
  Upload, Search, Download, Trash2, Plus, Filter, CheckCircle, X
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';

import projectImg from '../assets/outdoor_project_card.png';
import { useLanguage } from '../context/LanguageContext';

// Initial Mock Documents
const INITIAL_DOCUMENTS = [];

export default function Documents({ role }) {
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);

  // Load documents from localStorage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('app_documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    } else {
      setDocuments(INITIAL_DOCUMENTS);
      localStorage.setItem('app_documents', JSON.stringify(INITIAL_DOCUMENTS));
    }
  }, []);

  // File type icons mapping
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'image':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'excel':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'word':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'zip':
        return <FileArchive className="w-8 h-8 text-amber-500" />;
      case 'text':
        return <FileText className="w-8 h-8 text-dark/70" />;
      default:
        return <File className="w-8 h-8 text-dark/40" />;
    }
  };

  // Helper to format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Simulated upload handler - reads content asynchronously into persistent URL strings
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    const uploadPromises = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const nameParts = file.name.split('.');
        const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : '';
        let fileType = 'other';
        if (['pdf'].includes(ext)) fileType = 'pdf';
        else if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) fileType = 'image';
        else if (['xlsx', 'xls', 'csv'].includes(ext)) fileType = 'excel';
        else if (['docx', 'doc'].includes(ext)) fileType = 'word';
        else if (['zip', 'rar'].includes(ext)) fileType = 'zip';
        else if (['txt', 'json', 'md', 'html', 'css', 'js'].includes(ext)) fileType = 'text';

        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: formatBytes(file.size),
            type: fileType,
            url: e.target.result, // Contains persistent base64 url or raw text
            category: fileType === 'image' || fileType === 'pdf' ? 'Designs' : fileType === 'excel' || fileType === 'word' ? 'Contracts' : 'General',
            date: new Date().toISOString().split('T')[0],
            uploader: role === 'admin' ? 'Admin User' : 'Sven Hoek'
          });
        };
        
        if (fileType === 'text') {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    });

    const newDocs = await Promise.all(uploadPromises);
    setDocuments(prev => {
      const updated = [...newDocs, ...prev];
      localStorage.setItem('app_documents', JSON.stringify(updated));
      return updated;
    });

    const count = newDocs.length;
    showToast(count === 1 ? `"${newDocs[0].name}" ${language === 'NL' ? 'geüpload' : 'uploaded'}` : `${count} ${language === 'NL' ? 'documenten geüpload' : 'documents uploaded'}`);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Input change
  const handleFileChange = (e) => {
    handleUpload(e.target.files);
  };

  // Trigger input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Simulated download
  const handleDownload = (docName) => {
    const element = document.createElement("a");
    const file = new Blob(["Mock file content for " + docName], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = docName;
    document.body.appendChild(element);
    element.click();
    showToast(`${language === 'NL' ? 'Bezig met downloaden' : 'Downloading'} ${docName}...`);
  };

  // Delete handler
  const handleDelete = (id, name) => {
    const updated = documents.filter(doc => doc.id !== id);
    setDocuments(updated);
    localStorage.setItem('app_documents', JSON.stringify(updated));
    showToast(`${language === 'NL' ? 'Verwijderd' : 'Deleted'} ${name}`);
  };

  // Filtering
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                          doc.uploader.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: 'All', label: language === 'NL' ? 'Alles' : 'All' },
    { key: 'Designs', label: language === 'NL' ? 'Ontwerpen' : 'Designs' },
    { key: 'Finance', label: language === 'NL' ? 'Financieel' : 'Finance' },
    { key: 'Materials', label: language === 'NL' ? 'Materialen' : 'Materials' },
    { key: 'Contracts', label: language === 'NL' ? 'Contracten' : 'Contracts' },
    { key: 'General', label: language === 'NL' ? 'Algemeen' : 'General' }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#3E4E36] text-cream px-4 py-3 rounded-xl shadow-lg border border-[#D6CFC2]/20 font-body text-xs"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">
            {language === 'NL' ? 'Documenten' : 'Documents'}
          </h2>
          <p className="text-dark/50 text-sm font-body">
            {language === 'NL' ? 'Projectdocumenten uploaden, beheren en delen.' : 'Upload, manage, and share project documents.'}
          </p>
        </div>
        <Button icon={Plus} onClick={triggerFileInput}>
          {language === 'NL' ? 'Document Uploaden' : 'Upload Document'}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Drag and Drop Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        whileHover={{ scale: 1.005 }}
        className={`rounded-2xl p-8 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-[#D6CFC2] bg-[#EDE8DF] hover:border-primary'
        }`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragActive ? 'text-primary' : 'text-dark/25'}`} />
        <p className="text-sm text-dark/70 font-semibold font-body">
          {language === 'NL' ? 'Sleep uw bestand hierheen, of klik om te bladeren' : 'Drag and drop file here, or click to browse'}
        </p>
        <p className="text-xs text-dark/40 mt-1 font-body">
          {language === 'NL' ? 'PDF, Word, Excel, ZIP of Afbeeldingen tot 10 MB' : 'PDF, Word, Excel, ZIP or Images up to 10MB'}
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/35" />
          <input 
            type="text" 
            placeholder={language === 'NL' ? 'Zoek documenten op naam...' : 'Search documents by name...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#4A4A43]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <div className="flex gap-1.5 items-center">
            <Filter className="w-3.5 h-3.5 text-dark/40 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-dark/40 font-body mr-1">
              {language === 'NL' ? 'Filter:' : 'Filter:'}
            </span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-primary text-cream font-medium'
                  : 'bg-[#EDE8DF] border border-[#D6CFC2]/70 text-dark/60 hover:bg-cream hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card 
                  onClick={() => setSelectedDoc(doc)}
                  className="hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
                  noPadding
                >
                  <div className="p-5 flex items-start gap-4">
                    {/* Icon Area */}
                    <div className="p-3 bg-light rounded-xl border border-cream-dark/30 flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    {/* Content Area */}
                    <div className="flex-1 min-w-0 pr-14">
                      <h4 className="font-semibold text-sm text-dark font-body truncate" title={doc.name}>
                        {doc.name}
                      </h4>
                      <p className="text-xs text-dark/40 font-body mt-0.5">{doc.size} · {doc.date}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="default" className="text-[10px] uppercase font-body">
                          {doc.category}
                        </Badge>
                        <span className="text-[10px] text-dark/40 font-body truncate max-w-[120px]" title={`Uploaded by ${doc.uploader}`}>
                          By: {doc.uploader}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Dropdown/Hover Buttons */}
                  <div className="absolute right-3 top-3 flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-all duration-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(doc.name); }}
                      className="p-1.5 rounded-lg bg-light border border-cream-dark/50 text-dark/60 hover:text-primary hover:bg-cream transition-all shadow-sm"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id, doc.name); }}
                      className="p-1.5 rounded-lg bg-light border border-cream-dark/50 text-red-500 hover:text-white hover:bg-red-500 transition-all shadow-sm"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center border-2 border-dashed border-[#D6CFC2]/60 rounded-2xl"
            >
              <File className="w-12 h-12 mx-auto mb-3 text-dark/20" />
              <p className="text-dark/50 font-body text-sm font-semibold">No documents found</p>
              <p className="text-dark/30 font-body text-xs mt-1">Try changing your filters or upload a new document.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F2EDE4] border border-[#D6CFC2] rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl p-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 text-dark/60 hover:text-dark transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-light rounded-lg border border-cream-dark/30">
                    {getFileIcon(selectedDoc.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-dark text-lg truncate pr-8" title={selectedDoc.name}>
                      {selectedDoc.name}
                    </h3>
                    <p className="text-xs text-dark/50 font-body">Size: {selectedDoc.size} · Uploaded: {selectedDoc.date}</p>
                  </div>
                </div>

                <div className="border-t border-[#D6CFC2] pt-4">
                  {selectedDoc.type === 'image' ? (
                    <div className="flex justify-center bg-black/5 rounded-xl p-4 border border-[#D6CFC2]/50 max-h-96 overflow-hidden">
                      <img 
                        src={selectedDoc.url || projectImg} 
                        alt={selectedDoc.name} 
                        className="max-w-full max-h-80 object-contain rounded-lg shadow-sm"
                      />
                    </div>
                  ) : selectedDoc.type === 'pdf' && selectedDoc.url ? (
                    <div className="rounded-xl overflow-hidden border border-[#D6CFC2]/50">
                      <iframe 
                        src={selectedDoc.url} 
                        className="w-full h-96 bg-white" 
                        title={selectedDoc.name}
                      />
                    </div>
                  ) : selectedDoc.type === 'text' && selectedDoc.url ? (
                    <pre className="text-left bg-[#F8F7F4] p-4 rounded-xl max-h-80 overflow-auto text-[11px] font-mono border border-[#D6CFC2] text-dark/80 whitespace-pre-wrap leading-relaxed">
                      {selectedDoc.url}
                    </pre>
                  ) : (
                    <div className="py-12 text-center border border-dashed border-[#D6CFC2] bg-light rounded-xl">
                      <FileText className="w-16 h-16 mx-auto mb-3 text-dark/20" />
                      <p className="text-sm font-semibold text-dark/70 font-body">No live preview available</p>
                      <p className="text-xs text-dark/40 font-body mt-1">This file type ({selectedDoc.type.toUpperCase()}) cannot be previewed in browser.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 text-xs font-body text-dark/60">
                  <span>Uploaded by: <span className="font-semibold text-dark">{selectedDoc.uploader}</span></span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      icon={Download}
                      onClick={() => handleDownload(selectedDoc.name)}
                    >
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-500 hover:bg-red-600 text-white border-0" 
                      icon={Trash2}
                      onClick={() => {
                        handleDelete(selectedDoc.id, selectedDoc.name);
                        setSelectedDoc(null);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
