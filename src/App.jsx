import { useState, useEffect } from "react";
import MedicineForm from "./components/MedicineForm";
import MedicineCard from "./components/MedicineCard";
import Notification from "./components/Notification";
import AppHeader from "./components/AppHeader";

export default function App() {
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('medicines');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info'
  });
  
  useEffect(() => {
    localStorage.setItem('medicines', JSON.stringify(medicines));
  }, [medicines]);
  
  // Check for due medications every minute
  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      
      for (const medicine of medicines) {
        const nextDose = new Date(medicine.nextDose);
        
        // If time for next dose has passed and it wasn't already notified
        if (nextDose <= now && !medicine.notified) {
          // Show notification
          setNotification({
            show: true,
            message: `Time to take your ${medicine.name}!`,
            type: 'info'
          });
          
          // Update the medicine with a new next dose time and mark as notified
          updateMedicineSchedule(medicine.id);
          break; // Only show one notification at a time
        }
      }
    };
    
    // Check immediately and then every minute
    checkMedications();
    const interval = setInterval(checkMedications, 60000);
    
    return () => clearInterval(interval);
  }, [medicines]);
  
  const updateMedicineSchedule = (id) => {
    setMedicines(prevMedicines => {
      return prevMedicines.map(med => {
        if (med.id === id) {
          const nextDose = new Date(med.nextDose);
          
          // Calculate the next dose time based on frequency
          if (med.frequency.unit === 'hours') {
            nextDose.setHours(nextDose.getHours() + med.frequency.value);
          } else {
            nextDose.setDate(nextDose.getDate() + med.frequency.value);
          }
          
          return {
            ...med,
            nextDose,
            notified: true
          };
        }
        return med;
      });
    });
  };
  
  const addMedicine = (newMedicine) => {
    // Calculate the next dose time based on frequency
    const nextDose = new Date();
    if (newMedicine.frequency.unit === 'hours') {
      nextDose.setHours(nextDose.getHours() + newMedicine.frequency.value);
    } else {
      nextDose.setDate(nextDose.getDate() + newMedicine.frequency.value);
    }
    
    setMedicines([...medicines, {...newMedicine, nextDose, notified: false}]);
    
    // Show success notification
    setNotification({
      show: true,
      message: `${newMedicine.name} added successfully`,
      type: 'success'
    });
  };
  
  const deleteMedicine = (id) => {
    const medicineToDelete = medicines.find(med => med.id === id);
    setMedicines(medicines.filter(med => med.id !== id));
    
    // Show success notification
    setNotification({
      show: true,
      message: `${medicineToDelete?.name || 'Medicine'} removed`,
      type: 'info'
    });
  };
  
  const closeNotification = () => {
    setNotification(prev => ({...prev, show: false}));
  };
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AppHeader />
      
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <MedicineForm onAddMedicine={addMedicine} />
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Medications</h2>
            
            {medicines.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">No medications added yet</p>
                <p className="text-sm text-gray-400 mt-2">Add your first medication using the form</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {medicines.map(medicine => (
                  <MedicineCard 
                    key={medicine.id} 
                    medicine={medicine} 
                    onDelete={deleteMedicine} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Notification 
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
}
