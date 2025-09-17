import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-[#ECE9D8] border border-gray-400 p-4" role="alert">
        <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white font-black text-xl">X</span>
            </div>
            <div>
                <p className="text-sm text-black">
                  <strong className="font-bold">Error: </strong>
                  {message}
                </p>
            </div>
        </div>
    </div>
  );
};

export default ErrorMessage;