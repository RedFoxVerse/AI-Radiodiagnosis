
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import AnalysisResultDisplay from './components/AnalysisResultDisplay';
import Loader from './components/Loader';
import { analyzeMedicalScan } from './services/geminiService';
import { AnalysisResult } from './types';

interface ImageState {
  file: File | null;
  dataUrl: string | null;
}

const App = () => {
  const [image, setImage] = useState<ImageState>({ file: null, dataUrl: null });
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File, dataUrl: string) => {
    setImage({ file, dataUrl });
    setAnalysisResult(null); // Clear previous results
    setError(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!image.file || !image.dataUrl) {
      setError('Please upload a medical scan first.');
      return;
    }
    if (!process.env.API_KEY) {
      setError("Configuration Error: API key is not set. Please contact support.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // remove the data URL prefix e.g. "data:image/png;base64,"
      const base64Image = image.dataUrl.split(',')[1];
      const result = await analyzeMedicalScan(base64Image, image.file.type, clinicalNotes);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      <header className="bg-white dark:bg-slate-800/50 shadow-sm sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Radio-Diagnosis Assistant</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload & Details</h2>
            <div className="space-y-6">
              <ImageUploader onImageUpload={handleImageUpload} imageUrl={image.dataUrl} />
              <div>
                <label htmlFor="clinical-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Clinical Notes / Query
                </label>
                <textarea
                  id="clinical-notes"
                  rows={4}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 'Patient presents with persistent cough and chest pain. Please evaluate for pneumonia.'"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                />
              </div>
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading || !image.file}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-600 transition-colors"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Scan'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col justify-center">
            {isLoading && <Loader message="Analyzing Scan with AI" />}
            {error && (
                <div className="text-center text-red-500">
                    <h3 className="text-lg font-semibold">Error</h3>
                    <p>{error}</p>
                </div>
            )}
            {!isLoading && !error && analysisResult && <AnalysisResultDisplay result={analysisResult} />}
            {!isLoading && !error && !analysisResult && (
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <h3 className="text-lg font-semibold">Awaiting Analysis</h3>
                    <p>Upload a scan and provide clinical notes to begin.</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
