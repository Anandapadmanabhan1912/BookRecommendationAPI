import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import DefaultReccs from './components/DefaultReccs';
import DemographicReccs from './components/DemographicReccs';
import NewUserReccs from './components/NewUserReccs';

function App() {
  const [activeTab, setActiveTab] = useState('default');

  // tab switching handler
  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Book Recommendation System
      </h1>

      {/* Navigation system */}
      <Navbar activeTab={activeTab} onTabChange={handleTabSwitch} />

      {/* content area */}
      <div className="mt-4 p-4 border rounded-lg">
        {activeTab === "default" && <DefaultReccs />}
        {activeTab === "demographic" && <DemographicReccs />}
        {activeTab === "newUser" && <NewUserReccs />}
      </div>
    </div>
  );
}

export default App;
