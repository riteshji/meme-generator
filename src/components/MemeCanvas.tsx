import React, { useEffect, useRef, useState } from 'react';
import './MemeCanvas.css';

interface TextBox {
  text: string;
  size: number;
  position: 'top' | 'middle' | 'bottom';
  color: string;
  x?: number;
  y?: number;
}

interface MemeCanvasProps {
  imageUrl: string | null;
  textBoxes: TextBox[];
  width?: number;
  height?: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onTextBoxPositionChange?: (index: number, x: number, y: number) => void;
}

const MemeCanvas: React.FC<MemeCanvasProps> = ({ 
  imageUrl, 
  textBoxes, 
  width = 600, 
  height = 600,
  canvasRef,
  onTextBoxPositionChange
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const textBoundsRef = useRef<Array<{ x: number; y: number; width: number; height: number; index: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Set canvas size to match image aspect ratio
      const aspectRatio = img.width / img.height;
      let canvasWidth = width;
      let canvasHeight = height;

      if (aspectRatio > 1) {
        canvasHeight = width / aspectRatio;
      } else {
        canvasWidth = height * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Group text boxes by position with their original indices
      const textBoxesByPosition: { [key: string]: Array<{ textBox: typeof textBoxes[0], index: number }> } = {
        top: [],
        middle: [],
        bottom: []
      };

      textBoxes.forEach((textBox, index) => {
        textBoxesByPosition[textBox.position].push({ textBox, index });
      });

      // Helper function to wrap text within canvas boundaries
      const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;

        words.forEach((word) => {
          // Check if word alone is too long - break it by characters if needed
          const wordMetrics = ctx.measureText(word);
          if (wordMetrics.width > maxWidth) {
            // Word is too long, break it into characters
            if (currentLine) {
              lines.push(currentLine);
              currentLine = '';
            }
            // Break long word into smaller chunks
            let wordChunk = '';
            for (let i = 0; i < word.length; i++) {
              const testChunk = wordChunk + word[i];
              const chunkMetrics = ctx.measureText(testChunk);
              if (chunkMetrics.width > maxWidth && wordChunk) {
                lines.push(wordChunk);
                wordChunk = word[i];
              } else {
                wordChunk = testChunk;
              }
            }
            if (wordChunk) {
              currentLine = wordChunk;
            }
          } else {
            // Normal word wrapping
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        return lines.length > 0 ? lines : [''];
      };

      // Reset text bounds
      textBoundsRef.current = [];

      // Draw text boxes, handling multiple boxes at same position
      textBoxes.forEach((textBox, index) => {
        if (!textBox.text.trim()) return;

        ctx.font = `bold ${textBox.size}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate position - use custom x/y if set, otherwise use position-based calculation
        let x: number;
        let y: number;
        const padding = 20;
        const maxTextWidth = canvasWidth - (padding * 2);
        
        // Wrap text to fit within canvas width
        const text = textBox.text.toUpperCase();
        const lines = wrapText(text, maxTextWidth, textBox.size);
        const lineHeight = textBox.size * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        
        // Use custom position if set, otherwise calculate based on position type
        if (textBox.x !== undefined && textBox.y !== undefined) {
          x = textBox.x;
          y = textBox.y;
        } else {
          const boxesAtPosition = textBoxesByPosition[textBox.position];
          const positionIndex = boxesAtPosition.findIndex(b => b.index === index);
          const totalAtPosition = boxesAtPosition.length;
          
          switch (textBox.position) {
            case 'top': {
              // Spread text boxes out more to avoid overlaps
              const spacing = Math.max(totalTextHeight + 30, canvasHeight * 0.15);
              y = padding + (spacing * positionIndex) + totalTextHeight / 2;
              // Ensure text stays within reasonable bounds
              const maxY = canvasHeight * 0.45;
              y = Math.min(y, maxY);
              break;
            }
            case 'bottom': {
              // Spread text boxes out more to avoid overlaps
              const spacing = Math.max(totalTextHeight + 30, canvasHeight * 0.15);
              y = canvasHeight - padding - (spacing * (totalAtPosition - positionIndex - 1)) - totalTextHeight / 2;
              // Ensure text stays within reasonable bounds
              const minY = canvasHeight * 0.55;
              y = Math.max(y, minY);
              break;
            }
            case 'middle':
            default: {
              // Spread text boxes out more to avoid overlaps
              const spacing = Math.max(totalTextHeight + 40, 80);
              const startY = canvasHeight / 2 - (spacing * (totalAtPosition - 1)) / 2;
              y = startY + spacing * positionIndex;
              // Ensure text stays within reasonable bounds
              const minY = padding + totalTextHeight / 2;
              const maxY = canvasHeight - padding - totalTextHeight / 2;
              y = Math.max(minY, Math.min(y, maxY));
              break;
            }
          }
          x = canvasWidth / 2;
        }

        // Calculate text bounds for click detection
        const maxLineWidth = Math.max(...lines.map(line => {
          ctx.font = `bold ${textBox.size}px Impact, Arial Black, sans-serif`;
          return ctx.measureText(line).width;
        }));
        const textWidth = maxLineWidth;
        const textHeight = totalTextHeight;

        // Store bounds for click detection (add padding for easier clicking)
        const clickPadding = 10;
        const boundsX = x - textWidth / 2 - clickPadding;
        const boundsY = y - textHeight / 2 - clickPadding;
        const boundsWidth = textWidth + clickPadding * 2;
        const boundsHeight = textHeight + clickPadding * 2;
        
        textBoundsRef.current.push({
          x: boundsX,
          y: boundsY,
          width: boundsWidth,
          height: boundsHeight,
          index
        });

        // Draw highlight if hovering or dragging
        if (hoveredIndex === index || draggingIndex === index) {
          ctx.fillStyle = 'rgba(100, 108, 255, 0.2)';
          ctx.fillRect(boundsX, boundsY, boundsWidth, boundsHeight);
        }

        // Draw each line of wrapped text
        lines.forEach((line, lineIndex) => {
          const lineY = y - (totalTextHeight / 2) + (lineIndex * lineHeight) + (lineHeight / 2);

          // Draw black stroke (border) - thicker if dragging
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = draggingIndex === index 
            ? Math.max(3, textBox.size / 15) 
            : Math.max(2, textBox.size / 20);
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.strokeText(line, x, lineY);

          // Draw colored fill
          ctx.fillStyle = textBox.color || '#FFFFFF';
          ctx.fillText(line, x, lineY);
        });
      });
    };

    img.onerror = () => {
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Failed to load image', canvas.width / 2, canvas.height / 2);
    };

    img.src = imageUrl;
  }, [imageUrl, textBoxes, width, height, canvasRef, draggingIndex, hoveredIndex]);

  // Mouse event handlers for dragging
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onTextBoxPositionChange) return;

    const getCanvasCoordinates = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      return { x, y };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const coords = getCanvasCoordinates(e);
      
      // Check if click is on any text box
      for (let i = textBoundsRef.current.length - 1; i >= 0; i--) {
        const bounds = textBoundsRef.current[i];
        if (
          coords.x >= bounds.x &&
          coords.x <= bounds.x + bounds.width &&
          coords.y >= bounds.y &&
          coords.y <= bounds.y + bounds.height
        ) {
          setDraggingIndex(bounds.index);
          // Get the actual text box position
          const textBox = textBoxes[bounds.index];
          if (textBox) {
            // Calculate the actual center position of the text
            const canvas = canvasRef.current;
            if (canvas) {
              let actualX: number;
              let actualY: number;
              
              if (textBox.x !== undefined && textBox.y !== undefined) {
                // Use custom position
                actualX = textBox.x;
                actualY = textBox.y;
              } else {
                // Use bounds center as fallback
                actualX = bounds.x + bounds.width / 2;
                actualY = bounds.y + bounds.height / 2;
              }
              
              // Calculate offset from click position to text center
              setDragOffset({
                x: coords.x - actualX,
                y: coords.y - actualY
              });
            }
          }
          break;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const coords = getCanvasCoordinates(e);
      
      if (draggingIndex !== null && dragOffset !== null) {
        e.preventDefault(); // Prevent default to ensure smooth dragging
        
        // Calculate new position based on offset
        const newX = coords.x - dragOffset.x;
        const newY = coords.y - dragOffset.y;
        
        // Constrain to canvas bounds (with reasonable padding)
        const canvas = canvasRef.current;
        if (canvas && onTextBoxPositionChange) {
          const bounds = textBoundsRef.current.find(b => b.index === draggingIndex);
          if (bounds) {
            // Use appropriate padding for each axis based on text dimensions
            const xPadding = Math.max(10, bounds.width / 2);
            const yPadding = Math.max(10, bounds.height / 2);
            const constrainedX = Math.max(xPadding, Math.min(newX, canvas.width - xPadding));
            const constrainedY = Math.max(yPadding, Math.min(newY, canvas.height - yPadding));
            
            // Always update position - ensure both X and Y are set
            onTextBoxPositionChange(draggingIndex, constrainedX, constrainedY);
          } else {
            // Fallback if bounds not found - use smaller padding
            const padding = 20;
            const constrainedX = Math.max(padding, Math.min(newX, canvas.width - padding));
            const constrainedY = Math.max(padding, Math.min(newY, canvas.height - padding));
            onTextBoxPositionChange(draggingIndex, constrainedX, constrainedY);
          }
        }
      } else {
        // Check for hover
        let foundHover = false;
        for (let i = textBoundsRef.current.length - 1; i >= 0; i--) {
          const bounds = textBoundsRef.current[i];
          if (
            coords.x >= bounds.x &&
            coords.x <= bounds.x + bounds.width &&
            coords.y >= bounds.y &&
            coords.y <= bounds.y + bounds.height
          ) {
            setHoveredIndex(bounds.index);
            foundHover = true;
            break;
          }
        }
        if (!foundHover) {
          setHoveredIndex(null);
        }
      }
    };

    const handleMouseUp = () => {
      setDraggingIndex(null);
      setDragOffset(null);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, draggingIndex, dragOffset, textBoxes, onTextBoxPositionChange, hoveredIndex]);

  if (!imageUrl) {
    return (
      <div className="meme-canvas-placeholder">
        <p>Select an image to get started</p>
      </div>
    );
  }

  return (
    <div className="meme-canvas-container">
      <canvas 
        ref={canvasRef} 
        className="meme-canvas"
        style={{ cursor: draggingIndex !== null ? 'grabbing' : (hoveredIndex !== null ? 'grab' : 'default') }}
      />
      {draggingIndex !== null && (
        <div className="drag-hint">Dragging text... Release to place</div>
      )}
      {!draggingIndex && textBoxes.some(tb => tb.text.trim()) && hoveredIndex === null && (
        <div className="canvas-instruction">💡 Click and drag any text to reposition it</div>
      )}
    </div>
  );
};

export default MemeCanvas;
