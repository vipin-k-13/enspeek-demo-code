import React from 'react';
import { FiAlertCircle } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";
import { GoHome } from "react-icons/go";

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showRetry?: boolean;
  showHome?: boolean;
}

const Error: React.FC<ErrorPageProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an issue while loading your data. Please try again later.',
  onRetry,
  onGoHome,
  showRetry = true,
  showHome = false,
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 mb-6 text-gray-400">
        <FiAlertCircle className="w-full h-full" />
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        {title}
      </h2>

      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>

      <div className="flex gap-3">
        {showRetry && (
          <button onClick={handleRetry} className="inline-flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
            <LuRefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {showHome && (
          <button onClick={handleGoHome} className="inline-flex items-center cursor-pointer gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200">
            <GoHome className="w-4 h-4" />
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;