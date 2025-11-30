import { useState, useRef } from 'react';
import ImageSelector from './components/ImageSelector';
import MemeCanvas from './components/MemeCanvas';
import TextControls, { TextBox } from './components/TextControls';
import DownloadButton from './components/DownloadButton';
import { MemeTemplate } from './data/memeTemplates';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (imageUrl: string, template?: MemeTemplate) => {
    setSelectedImage(imageUrl);
    setSelectedTemplate(template || null);
    
    // Initialize text boxes based on template
    if (template) {
      const initialTextBoxes: TextBox[] = template.textPositions.map((position) => ({
        text: '',
        size: 40,
        position,
        color: '#FFFFFF'
      }));
      setTextBoxes(initialTextBoxes);
    } else {
      // For uploaded images, default to top and bottom text
      setTextBoxes([
        { text: '', size: 40, position: 'top', color: '#FFFFFF' },
        { text: '', size: 40, position: 'bottom', color: '#FFFFFF' }
      ]);
    }
  };

  const handleTextBoxChange = (index: number, field: keyof TextBox, value: string | number) => {
    setTextBoxes((prev) => {
      const newTextBoxes = [...prev];
      if (!newTextBoxes[index]) {
        newTextBoxes[index] = { text: '', size: 40, position: 'top', color: '#FFFFFF' };
      }
      newTextBoxes[index] = {
        ...newTextBoxes[index],
        [field]: value
      };
      return newTextBoxes;
    });
  };

  const handleTextBoxPositionChange = (index: number, x: number, y: number) => {
    setTextBoxes((prev) => {
      const newTextBoxes = [...prev];
      if (!newTextBoxes[index]) {
        newTextBoxes[index] = { text: '', size: 40, position: 'top', color: '#FFFFFF' };
      }
      newTextBoxes[index] = {
        ...newTextBoxes[index],
        x,
        y
      };
      return newTextBoxes;
    });
  };

  const maxTextBoxes = selectedTemplate?.textBoxes || (selectedImage ? 2 : 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Meme Generator</h1>
        <p>Create your own memes with custom text</p>
      </header>

      <div className="app-container">
        <div className="sidebar">
          <ImageSelector onImageSelect={handleImageSelect} />
          {selectedImage && (
            <>
              <TextControls
                textBoxes={textBoxes}
                onTextBoxChange={handleTextBoxChange}
                maxTextBoxes={maxTextBoxes}
              />
              <DownloadButton canvasRef={canvasRef} />
            </>
          )}
        </div>

        <div className="main-content">
          <MemeCanvas
            imageUrl={selectedImage}
            textBoxes={textBoxes}
            width={600}
            height={600}
            canvasRef={canvasRef}
            onTextBoxPositionChange={handleTextBoxPositionChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

