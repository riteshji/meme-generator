import React from 'react';
import './TextControls.css';

export interface TextBox {
  text: string;
  size: number;
  position: 'top' | 'middle' | 'bottom';
  color: string;
  x?: number; // Custom x position (if set, overrides position-based calculation)
  y?: number; // Custom y position (if set, overrides position-based calculation)
}

interface TextControlsProps {
  textBoxes: TextBox[];
  onTextBoxChange: (index: number, field: keyof TextBox, value: string | number) => void;
  maxTextBoxes: number;
}

const TextControls: React.FC<TextControlsProps> = ({ 
  textBoxes, 
  onTextBoxChange, 
  maxTextBoxes 
}) => {
  if (maxTextBoxes === 0) {
    return (
      <div className="text-controls">
        <p className="no-text-hint">This template doesn't support text overlays</p>
      </div>
    );
  }

  return (
    <div className="text-controls">
      <h3>Text Controls</h3>
      {Array.from({ length: maxTextBoxes }).map((_, index) => {
        const textBox = textBoxes[index] || { text: '', size: 40, position: 'top', color: '#FFFFFF' };
        const positionLabel = textBox.position === 'top' ? 'Top' : 
                             textBox.position === 'middle' ? 'Middle' : 'Bottom';

        return (
          <div key={index} className="text-box-control">
            <label className="text-box-label">
              {positionLabel} Text
            </label>
            <input
              type="text"
              placeholder={`Enter ${positionLabel.toLowerCase()} text...`}
              value={textBox.text}
              onChange={(e) => onTextBoxChange(index, 'text', e.target.value)}
              className="text-input"
            />
            <div className="size-control">
              <label>Size: {textBox.size}px</label>
              <input
                type="range"
                min="20"
                max="100"
                value={textBox.size}
                onChange={(e) => onTextBoxChange(index, 'size', parseInt(e.target.value))}
                className="size-slider"
              />
            </div>
            <div className="color-control">
              <label>Color:</label>
              <input
                type="color"
                value={textBox.color}
                onChange={(e) => onTextBoxChange(index, 'color', e.target.value)}
                className="color-picker"
              />
            </div>
            <div className="drag-hint-control">
              <small>💡 Click and drag text on canvas to reposition</small>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TextControls;

