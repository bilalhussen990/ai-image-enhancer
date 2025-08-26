
import React from 'react';

interface ImageViewerProps {
  title: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageUrl, children }) => {
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-xl font-bold text-center mb-4 text-content-200">{title}</h2>
      <div className="relative w-full aspect-square bg-base-200 rounded-2xl overflow-hidden shadow-lg border border-base-300 flex items-center justify-center">
        {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-contain" />}
        {children}
      </div>
    </div>
  );
};

export default ImageViewer;
