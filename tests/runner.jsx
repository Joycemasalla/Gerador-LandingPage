import React from 'react';
import ReactDOM from 'react-dom/client';
import PreviewSection from '../src/components/PreviewSection';
import '../src/index.css';

window.renderLandingPage = (generatedData) => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<PreviewSection generatedData={generatedData} images={[]} isGenerating={false} generationLogs={[]} />);
};
