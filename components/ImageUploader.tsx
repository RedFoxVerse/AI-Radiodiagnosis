
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  imageUrl: string | null;
}

const ImageUploader = ({ onImageUpload, imageUrl }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Upload Medical Scan
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600'}
          ${imageUrl ? 'border-solid p-0' : ''}`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Scan preview" className="object-contain h-full w-full rounded-lg" />
        ) : (
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
            <div className="flex text-sm text-slate-600 dark:text-slate-400">
              <span className="relative cursor-pointer bg-white dark:bg-slate-900 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
