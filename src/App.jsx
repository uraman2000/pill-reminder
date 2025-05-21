import { useState, useEffect } from "react";
import MedicineForm from "./components/MedicineForm";
import MedicineCard from "./components/MedicineCard";
import Notification from "./components/Notification";
import AppHeader from "./components/AppHeader";
import ProfileTabs from "./components/ProfileTabs";

export default function App() {
  // Load profiles from localStorage
  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      return JSON.parse(savedProfiles);
    }
    // Default profile if none exists
    return [{ id: "default", name: "Default" }];
  });

  // Track active profile
  const [activeProfile, setActiveProfile] = useState(() => {
    const saved = localStorage.getItem('activeProfile');
    return saved || (profiles[0]?.id || "default");
  });

  // Load medicines for all profiles
  const [allMedicines, setAllMedicines] = useState(() => {
    const saved = localStorage.getItem('allMedicines');
    return saved ? JSON.parse(saved) : {};
  });

  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info'
  });
  
  // Access medicines for current profile
  const medicines = allMedicines[activeProfile] || [];

  // Save all data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('activeProfile', activeProfile);
  }, [activeProfile]);
  
  useEffect(() => {
    localStorage.setItem('allMedicines', JSON.stringify(allMedicines));
  }, [allMedicines]);
  
  // Check for due medications every minute
  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      let notificationShown = false;
      
      // Check medicines across all profiles
      for (const profileId in allMedicines) {
        if (notificationShown) break;
        
        for (const medicine of allMedicines[profileId]) {
          const nextDose = new Date(medicine.nextDose);
          
          // If time for next dose has passed and it wasn't already notified
          if (nextDose <= now && !medicine.notified) {
            // Get profile name
            const profileName = profiles.find(p => p.id === profileId)?.name || "Unknown";
            
            // Show notification
            setNotification({
              show: true,
              message: `Time for ${profileName} to take ${medicine.name}!`,
              type: 'info'
            });
            
            // Update the medicine with a new next dose time and mark as notified
            updateMedicineSchedule(profileId, medicine.id);
            notificationShown = true;
            break; // Only show one notification at a time
          }
        }
      }
    };
    
    // Check immediately and then every minute
    checkMedications();
    const interval = setInterval(checkMedications, 60000);
    
    return () => clearInterval(interval);
  }, [allMedicines, profiles]);
  
  const updateMedicineSchedule = (profileId, medicineId) => {
    setAllMedicines(prevAllMedicines => {
      const updatedMedicines = {...prevAllMedicines};
      
      if (updatedMedicines[profileId]) {
        updatedMedicines[profileId] = updatedMedicines[profileId].map(med => {
          if (med.id === medicineId) {
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
      }
      
      return updatedMedicines;
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
    
    // Add medicine to the current active profile
    setAllMedicines(prev => {
      const updated = {...prev};
      if (!updated[activeProfile]) {
        updated[activeProfile] = [];
      }
      updated[activeProfile] = [...updated[activeProfile], {...newMedicine, nextDose, notified: false}];
      return updated;
    });
    
    // Show success notification
    setNotification({
      show: true,
      message: `${newMedicine.name} added successfully for ${getActiveProfileName()}`,
      type: 'success'
    });
  };
  
  const deleteMedicine = (id) => {
    const medicineToDelete = medicines.find(med => med.id === id);
    
    setAllMedicines(prev => {
      const updated = {...prev};
      if (updated[activeProfile]) {
        updated[activeProfile] = updated[activeProfile].filter(med => med.id !== id);
      }
      return updated;
    });
    
    // Show success notification
    setNotification({
      show: true,
      message: `${medicineToDelete?.name || 'Medicine'} removed from ${getActiveProfileName()}'s list`,
      type: 'info'
    });
  };
  
  const closeNotification = () => {
    setNotification(prev => ({...prev, show: false}));
  };
  
  // Profile management functions
  const addProfile = (name) => {
    const newProfile = {
      id: `profile-${Date.now()}`,
      name
    };
    
    setProfiles([...profiles, newProfile]);
    setActiveProfile(newProfile.id);
    
    setNotification({
      show: true,
      message: `Profile for ${name} created`,
      type: 'success'
    });
  };
  
  const deleteProfile = (profileId) => {
    const profileToDelete = profiles.find(p => p.id === profileId);
    
    // Don't delete if it's the only profile
    if (profiles.length <= 1) {
      setNotification({
        show: true,
        message: "Cannot delete the only profile",
        type: 'error'
      });
      return;
    }
    
    // Update profiles list
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    
    // If deleting active profile, switch to first profile
    if (profileId === activeProfile) {
      setActiveProfile(updatedProfiles[0].id);
    }
    
    // Remove medicines for this profile
    setAllMedicines(prev => {
      const updated = {...prev};
      delete updated[profileId];
      return updated;
    });
    
    setNotification({
      show: true,
      message: `Profile for ${profileToDelete?.name || 'Unknown'} deleted`,
      type: 'info'
    });
  };
  
  const getActiveProfileName = () => {
    return profiles.find(p => p.id === activeProfile)?.name || "Unknown";
  };
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AppHeader />
      
      <div className="container mx-auto px-4 pb-8">
        <ProfileTabs 
          profiles={profiles} 
          activeProfile={activeProfile}
          onAddProfile={addProfile}
          onSelectProfile={setActiveProfile}
          onDeleteProfile={deleteProfile}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <MedicineForm onAddMedicine={addMedicine} />
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {getActiveProfileName()}'s Medications
            </h2>
            
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
