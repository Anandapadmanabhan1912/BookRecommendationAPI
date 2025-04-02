import React from "react";
import TabButton from "./TabButton";

const Navbar = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex mb-6 border-b">
      <TabButton
        id="default"
        active={activeTab === "default"}
        onClick={onTabChange}
      >
        Default
      </TabButton>
      <TabButton
        id="demographic"
        active={activeTab === "demographic"}
        onClick={onTabChange}
      >
        For You
      </TabButton>
      <TabButton
        id="newUser"
        active={activeTab === "newUser"}
        onClick={onTabChange}
      >
        Custom
      </TabButton>
    </div>
  );
};

export default Navbar;
