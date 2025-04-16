import React from 'react';
import SkinAnalyzer from '../components/SkinAnalyzer';

const SkinAnalysisPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Skin Analysis Tool</h1>
                <SkinAnalyzer />
            </div>
        </div>
    );
};

export default SkinAnalysisPage; 