import { useState } from 'react';

export default function ProfileTabs({ profiles, activeProfile, onAddProfile, onSelectProfile, onDeleteProfile }) {
  const [newProfileName, setNewProfileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProfile = (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onAddProfile(newProfileName.trim());
      setNewProfileName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center overflow-x-auto pb-2">
        {profiles.map(profile => (
          <div key={profile.id} className="flex-shrink-0">
            <button
              onClick={() => onSelectProfile(profile.id)}
              className={`px-4 py-2 mr-2 rounded-t-lg font-medium transition-colors ${
                activeProfile === profile.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              <div className="flex items-center">
                <span>{profile.name}</span>
                {profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProfile(profile.id);
                    }}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </button>
          </div>
        ))}

        {isAdding ? (
          <form onSubmit={handleAddProfile} className="flex-shrink-0">
            <div className="flex items-center bg-white rounded-t-lg px-2 shadow-md">
              <input
                type="text"
                className="px-2 py-2 focus:outline-none"
                placeholder="Name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="text-green-600 px-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="text-red-600 px-2"
                onClick={() => setIsAdding(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-t-lg hover:bg-blue-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Person</span>
          </button>
        )}
      </div>
    </div>
  );
} 