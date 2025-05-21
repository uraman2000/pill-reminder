export default function AppHeader() {
  return (
    <header className="bg-blue-600 text-white shadow-md px-4 py-4 mb-6">
      <div className="container mx-auto flex items-center">
        <div className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-medium">Family Pill Reminder</h1>
          <p className="text-sm text-blue-100 opacity-80">Manage medications for the whole family</p>
        </div>
      </div>
    </header>
  );
} 