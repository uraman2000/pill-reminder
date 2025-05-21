import { useState, useEffect } from 'react';

export default function MedicineCard({ medicine, onDelete }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [durationLeft, setDurationLeft] = useState('');
  
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const nextDose = new Date(medicine.nextDose);
      
      const diff = nextDose - now;
      
      if (diff <= 0) {
        setTimeLeft('Take now');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
      
      // Calculate days remaining in treatment
      const createdAt = new Date(medicine.createdAt);
      const durationMs = medicine.duration.value * 
        (medicine.duration.unit === 'days' ? 24 * 60 * 60 * 1000 : 
        medicine.duration.unit === 'weeks' ? 7 * 24 * 60 * 60 * 1000 : 
        30 * 24 * 60 * 60 * 1000);
      
      const endDate = new Date(createdAt.getTime() + durationMs);
      const daysLeft = Math.ceil((endDate - now) / (24 * 60 * 60 * 1000));
      
      if (daysLeft <= 0) {
        setDurationLeft('Completed');
      } else {
        setDurationLeft(`${daysLeft} days left`);
      }
    };
    
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [medicine]);
  
  const isOverdue = new Date(medicine.nextDose) <= new Date();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className={`w-full h-2 ${isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}></div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-800">{medicine.name}</h3>
            <p className="text-sm text-gray-600">
              Take every {medicine.frequency.value} {medicine.frequency.unit}
            </p>
            <p className="text-sm text-gray-600">
              For {medicine.duration.value} {medicine.duration.unit}
            </p>
          </div>
          <button 
            onClick={() => onDelete(medicine.id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className={`px-3 py-1 rounded-full ${isOverdue ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
            <p className="text-sm font-medium">
              {isOverdue ? 'Take now!' : `Next: ${timeLeft}`}
            </p>
          </div>
          <div className="bg-purple-50 px-3 py-1 rounded-full">
            <p className="text-sm font-medium text-purple-800">
              {durationLeft}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 