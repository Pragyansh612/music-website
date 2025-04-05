'use client';

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/public/loading.json';

const LoadingComponent: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="w-64 h-64">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
};

export default LoadingComponent;