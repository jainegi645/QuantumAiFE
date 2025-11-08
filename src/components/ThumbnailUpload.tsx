import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiService } from '@/api/apiCalling';
import { endpoints } from '@/api/endpoints';
import { Upload, X } from 'lucide-react';

interface ThumbnailUploadProps {
  courseId: string;
  currentImageUrl?: string;
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError: (error: string) => void;
}

export function ThumbnailUpload({ 
  courseId, 
  currentImageUrl, 
  onUploadSuccess, 
  onUploadError 
}: ThumbnailUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError('Please select an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      onUploadError('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);

      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Azure via backend
      const response = await apiService.uploadFile(
        endpoints.uploadCourseThumbnail,
        file,
        [courseId]
      );

      if (response?.imageUrl) {
        onUploadSuccess(response.imageUrl);
      } else {
        throw new Error('No image URL received from server');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      onUploadError('Failed to upload image');
      // Revert preview on error
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  }, [courseId, currentImageUrl, onUploadSuccess, onUploadError]);

  const clearImage = useCallback(() => {
    setPreviewUrl(null);
    // You might want to add an API call here to clear the image on the backend
  }, []);

  return (
    <div className="relative">
      {/* Preview Area */}
      <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
        {previewUrl ? (
          <div className="relative group">
            <img 
              src={previewUrl} 
              alt="Course thumbnail" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                onClick={clearImage}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="mt-4">
        <input
          type="file"
          id="thumbnail-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => document.getElementById('thumbnail-upload')?.click()}
        >
          {isUploading ? 'Uploading...' : 'Upload Thumbnail'}
        </Button>
      </div>
    </div>
  );
}