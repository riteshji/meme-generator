import React, { useState } from 'react';
import { memeTemplates, MemeTemplate } from '../data/memeTemplates';
import './ImageSelector.css';

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string, template?: MemeTemplate) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'templates'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageSelect(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    onImageSelect(template.imageUrl, template);
  };

  return (
    <div className="image-selector">
      <div className="tabs">
        <button
          className={activeTab === 'templates' ? 'active' : ''}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'templates' && (
          <div className="templates-grid">
            {memeTemplates.map((template) => (
              <div
                key={template.id}
                className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <img src={template.imageUrl} alt={template.name} />
                <p>{template.name}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-button">
              Choose Image File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <p className="upload-hint">Select an image from your device</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelector;

