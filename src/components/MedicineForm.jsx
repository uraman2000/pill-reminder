import { useState } from 'react';

export default function MedicineForm({ onAddMedicine }) {
  const [medicineName, setMedicineName] = useState('');
  const [frequency, setFrequency] = useState('8');
  const [duration, setDuration] = useState('7');
  const [frequencyUnit, setFrequencyUnit] = useState('hours');
  const [durationUnit, setDurationUnit] = useState('days');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!medicineName.trim()) return;
    
    const newMedicine = {
      id: Date.now(),
      name: medicineName,
      frequency: {
        value: parseInt(frequency),
        unit: frequencyUnit
      },
      duration: {
        value: parseInt(duration),
        unit: durationUnit
      },
      createdAt: new Date(),
      nextDose: new Date()
    };
    
    onAddMedicine(newMedicine);
    
    // Reset form
    setMedicineName('');
    setFrequency('8');
    setDuration('7');
    setFrequencyUnit('hours');
    setDurationUnit('days');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-medium text-gray-800 mb-5">Add Medication</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name
          </label>
          <input
            type="text"
            id="medicineName"
            className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 transition-colors focus:outline-none"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter medicine name"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Take Every
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 transition-colors focus:outline-none"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              min="1"
              required
            />
            <select
              className="px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 transition-colors focus:outline-none"
              value={frequencyUnit}
              onChange={(e) => setFrequencyUnit(e.target.value)}
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            For Duration
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 transition-colors focus:outline-none"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              required
            />
            <select
              className="px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 transition-colors focus:outline-none"
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value)}
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
        >
          Add Medicine
        </button>
      </form>
    </div>
  );
} 