import React from 'react';
import './DownloadButton.css';

interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ canvasRef }) => {
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('No canvas to download');
      return;
    }

    try {
      // Convert canvas to data URL and download
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `meme-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download meme. Please try again.');
    }
  };

  return (
    <button className="download-button" onClick={handleDownload}>
      Download Meme
    </button>
  );
};

export default DownloadButton;

