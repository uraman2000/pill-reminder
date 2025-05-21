import { useState, useEffect } from 'react';

export default function Notification({ show, message, type = 'info', onClose }) {
  const [isVisible, setIsVisible] = useState(show);
  
  useEffect(() => {
    setIsVisible(show);
    
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  
  const bgColor = type === 'success' ? 'bg-green-500' : 
                 type === 'error' ? 'bg-red-500' : 
                 'bg-blue-500';
  
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`${bgColor} text-white rounded-lg shadow-lg p-4 transition-all transform duration-300 ease-in-out`}>
        <div className="flex justify-between items-center">
          <p>{message}</p>
          <button 
            onClick={handleClose}
            className="ml-4 text-white opacity-70 hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 