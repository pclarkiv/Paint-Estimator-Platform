'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);

      // Get presigned URL
      const response = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) throw new Error('Failed to get upload URL');

      const { url, fields } = await response.json();

      // Create form data with presigned post fields
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      // Upload to S3
      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      // Create document record in database
      const createResponse = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          key: fields.key,
        }),
      });

      if (!createResponse.ok) throw new Error('Failed to create document record');

      const { id } = await createResponse.json();
      router.push(`/documents/${id}`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-base-300 rounded-lg">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full max-w-xs"
      />
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn btn-primary"
        >
          {uploading ? (
            <>
              <span className="loading loading-spinner"></span>
              Uploading...
            </>
          ) : (
            'Upload PDF'
          )}
        </button>
      )}
    </div>
  );
}
