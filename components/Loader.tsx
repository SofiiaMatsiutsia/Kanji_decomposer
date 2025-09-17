import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-10">
      <div className="flex items-center gap-2 text-black text-m">
        <span>Analyzing, please wait...</span>
      </div>
    </div>
  );
};

export default Loader;