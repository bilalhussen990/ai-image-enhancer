
import React, { useState, useCallback } from 'react';
import type { ImageFile } from './types';
import { enhanceImage } from './services/geminiService';
import { fileToBase64, getMimeType } from './utils/imageUtils';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import Spinner from './components/Spinner';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { MagicWandIcon } from './components/icons/MagicWandIcon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setOriginalImage({ file, previewUrl });
    setEnhancedImage(null);
    setError(null);
  }, []);

  const handleEnhanceClick = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const base64String = await fileToBase64(originalImage.file);
      const mimeType = getMimeType(originalImage.file.name) || originalImage.file.type;
      
      const result = await enhanceImage(base64String, mimeType);
      
      if (result) {
        setEnhancedImage(result);
      } else {
        setError('The AI could not enhance the image. It may not have returned an image.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Enhancement failed: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `enhanced_${originalImage?.file.name || 'image.png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    if (originalImage) {
        URL.revokeObjectURL(originalImage.previewUrl);
    }
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-100 text-content-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary">AI Image Enhancer</h1>
        <p className="text-lg text-content-200 mt-2">
          Upscale your images to higher resolutions with stunning clarity and detail.
        </p>
      </header>

      <main className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              <ImageViewer title="Original Image" imageUrl={originalImage.previewUrl} />
              <ImageViewer title="Enhanced Image">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-200/50 backdrop-blur-sm">
                    <Spinner />
                    <p className="text-content-100 mt-4 text-lg font-semibold">AI is enhancing your image...</p>
                  </div>
                )}
                {enhancedImage && !isLoading && <img src={enhancedImage} alt="Enhanced" className="w-full h-full object-contain" />}
                {!enhancedImage && !isLoading && (
                  <div className="w-full h-full flex items-center justify-center text-content-200">
                    <p>Click "Enhance Image" to see the magic</p>
                  </div>
                )}
              </ImageViewer>
            </div>
             {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-center" role="alert">
                    <p>{error}</p>
                </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button onClick={handleEnhanceClick} disabled={isLoading}>
                <MagicWandIcon />
                {isLoading ? 'Enhancing...' : 'Enhance Image'}
              </Button>
              <Button onClick={handleDownload} disabled={!enhancedImage || isLoading}>
                <DownloadIcon />
                Download Enhanced
              </Button>
              <button onClick={handleReset} className="text-content-200 hover:text-brand-primary transition-colors duration-300">
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full max-w-6xl text-center mt-8 py-4 border-t border-base-300">
        <p className="text-content-200 text-sm">Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
