import React from 'react';
import { AnalysisResult } from '../types';
import Accordion from './Accordion';
import { MicroscopeIcon, ClipboardIcon, ChartBarIcon } from './icons';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const AnalysisResultDisplay = ({ result }: AnalysisResultDisplayProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Analysis Report</h2>
      
      {/* FIX: Accordion component was incorrectly self-closed, causing a 'missing children prop' error. The content is now correctly passed as children. */}
      <Accordion 
        title="Diagnosis" 
        icon={<MicroscopeIcon className="w-6 h-6 text-blue-500" />}
        defaultOpen={true}
      >
        <p>{result.diagnosis}</p>
      </Accordion>

      {/* FIX: Accordion component was incorrectly self-closed, causing a 'missing children prop' error. The content is now correctly passed as children. */}
      <Accordion 
        title="Detailed Report" 
        icon={<ClipboardIcon className="w-6 h-6 text-green-500" />}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{result.report}</p>
      </Accordion>

      {/* FIX: Accordion component was incorrectly self-closed, causing a 'missing children prop' error. The content is now correctly passed as children. */}
      <Accordion 
        title="Future Course of Action" 
        icon={<ChartBarIcon className="w-6 h-6 text-purple-500" />}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{result.actionPlan}</p>
      </Accordion>
    </div>
  );
};

export default AnalysisResultDisplay;
