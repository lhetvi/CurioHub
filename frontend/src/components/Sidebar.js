import React from "react";
import "./css/Sidebar.css";
import SidebarOptions from "./SidebarOptions";

function Sidebar({ onSelectSection }) {
  const selectsection = (s) => {
    onSelectSection(s);
  }

  return (
    <div className="sidebar">
      <SidebarOptions onSelectSection={selectsection} />
    </div>
  );
}

export default Sidebar;
