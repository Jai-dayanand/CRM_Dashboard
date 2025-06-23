import React, { useState } from 'react';
import { Upload, FileText, X, Download, Eye, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  category: string;
  description?: string;
}

const UploadsPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [category, setCategory] = useState('documents');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { value: 'documents', label: 'Documents' },
    { value: 'images', label: 'Images' },
    { value: 'templates', label: 'Templates' },
    { value: 'reports', label: 'Reports' },
    { value: 'other', label: 'Other' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      setUploadModalOpen(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setUploadModalOpen(true);
    }
  };

  const handleUpload = () => {
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      category,
      description
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setSelectedFiles([]);
    setCategory('documents');
    setDescription('');
    setUploadModalOpen(false);
    toast.success(`${newFiles.length} file(s) uploaded successfully!`);
  };

  const handleDelete = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast.success('File deleted successfully!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    return '📁';
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">File Management</h1>
            <p className="text-gray-400 mt-2">Upload, organize, and manage your files efficiently</p>
          </div>
          <Button 
            icon={Plus} 
            onClick={() => setUploadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Upload Files
          </Button>
        </div>

        {/* Upload Zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-400 bg-blue-900/20' 
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-gray-400 mb-4">or click to browse files</p>
          <p className="text-sm text-gray-500">
            Supports: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF (Max 50MB per file)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-gray-800 p-4 rounded-lg">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{getFileIcon(file.type)}</div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-gray-400 hover:text-blue-400 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-400 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-semibold text-white mb-2 truncate" title={file.name}>
                {file.name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="capitalize">{file.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span>{format(file.uploadedAt, 'MMM d')}</span>
                </div>
              </div>
              
              {file.description && (
                <p className="text-xs text-gray-500 mt-3 line-clamp-2">
                  {file.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-xl">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {uploadedFiles.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
            </h3>
            <p className="text-gray-500">
              {uploadedFiles.length === 0 
                ? 'Upload your first file to get started' 
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title="Upload Files"
          size="lg"
        >
          <div className="space-y-6">
            {/* Selected Files */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for these files..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
                className="flex-1"
              >
                Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UploadsPage;