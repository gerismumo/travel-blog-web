// src/components/ErrorComponent.tsx

import React from 'react';

interface ErrorComponentProps {
    onRetry: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <p className="text-red-500 text-lg">Error occured</p>
            <button
                onClick={onRetry}
                className="mt-4 bg-lightDark hover:bg-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Try Again
            </button>
        </div>
    );
};

export default ErrorComponent;
