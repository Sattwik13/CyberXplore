import React, { useState } from 'react';
import { uploadFile } from '../api';

export default function UploadPage({ onUpload }: { onUpload: () => void }) {
  
  // State to store the selected file
  const [selected, setSelected] = useState<File | null>(null);
  // Controls button loading state
  const [uploading, setUploading] = useState(false);
  // Tracks the scanning lifecycle
  const [scanStatus, setScanStatus] = useState<'idle'|'uploading'|'scanning'|'uploaded'|null>('idle');

  // Handles file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.files?.[0] || null);
    setScanStatus('idle');
  };

  // Handles file upload and scanning status
  const handleUpload = async () => {
    if (!selected) return;

    setUploading(true);
    setScanStatus('uploading');

    try {
      // Upload the file to the server
      await uploadFile(selected);
      // Simulate scan in progress (you may replace this with polling logic)
      setScanStatus('scanning');
      setTimeout(() => {
        setScanStatus('uploaded');
        onUpload(); // Trigger parent refresh (Dashboard reload)
      }, 2000); // Wait 2s to allow scan to start in backend

    } catch (err) {
      setScanStatus(null);
      alert('Upload failed!');
    }
    setUploading(false);
  };

  // Returns the current UI message based on scan status
  const getStatusMessage = () => {
    if (scanStatus === 'uploading') return 'Uploading…';
    if (scanStatus === 'scanning') return 'Scan in progress…';
    if (scanStatus === 'uploaded') return 'File uploaded successfully';
    return '';
  };


  return (
    <div className="min-h-auto min-w-auto bg-gray-900/70 backdrop-blur-md rounded-2xl text-white p-6 font-sans">
      <h2
       className="text-xl font-semibold mb-4">Upload a File
      </h2>

      <input
        type="file"
        accept=".pdf,.docx,.png,.jpg"
        onChange={handleChange}
        className="block w-full max-w-sm bg-gray-800 border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!selected}
        className={`px-6 py-2 rounded-xl text-white font-medium transition ${
          selected
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-800 cursor-not-allowed'
        }`}
      >
        Upload
      </button>

      <div className="mt-4 text-gray-400 italic">
        {getStatusMessage()}
      </div>
    </div>
  );
}
