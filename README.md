# Meme Generator

A React + Vite meme generator application that allows users to create memes by selecting templates or uploading images, adding customizable text with white color and black borders, and downloading the final result.

## Features

- **Image Selection**: Choose from predefined meme templates or upload your own image
- **Text Overlays**: Add 1-3 text boxes depending on the selected template
- **Text Customization**: 
  - Resizable text (20px - 100px)
  - White text with black border/stroke
  - Positioned at top, middle, or bottom
- **Download**: Export your meme as a PNG image

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select an Image**:
   - Click on the "Templates" tab to choose from predefined meme templates
   - Or click on the "Upload" tab to upload your own image

2. **Add Text**:
   - Enter your text in the text input fields
   - Adjust the text size using the slider (20px - 100px)
   - Text will appear in white with a black border

3. **Download**:
   - Click the "Download Meme" button to save your meme as a PNG file

## Technologies Used

- React 18
- TypeScript
- Vite
- Canvas API for image rendering

## Project Structure

```
src/
├── components/
│   ├── ImageSelector.tsx    # Image selection (templates/upload)
│   ├── MemeCanvas.tsx      # Canvas rendering component
│   ├── TextControls.tsx    # Text input and size controls
│   └── DownloadButton.tsx  # Download functionality
├── data/
│   └── memeTemplates.ts    # Meme template definitions
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

