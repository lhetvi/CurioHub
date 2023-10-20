import "./css/SidebarOptions.css";

function SidebarOptions({ onSelectSection }) {
  const handleSelect = (section) => {
    onSelectSection(section);
  };
  return (
    <div className="sidebarOptions">
      <div className="sidebarOption" onClick={() => handleSelect("all")}>
        <img
          src="https://images.pexels.com/photos/1721747/pexels-photo-1721747.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>All</p>
      </div>
      <div className="sidebarOption" onClick={() => handleSelect("History")} >
        <img
          src="https://images.pexels.com/photos/1721747/pexels-photo-1721747.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>History</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Business")}> 
        <img
          src="https://images.pexels.com/photos/257636/pexels-photo-257636.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />

        <p>Business</p>
      </div>
      <div className="sidebarOption" onClick={() => handleSelect("Psychology")}>
        <img
          src="https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Psychology</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Cooking")}>
        <img
          src="https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Cooking</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Music")}>
        <img
          src="https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Music</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Science")} >
        <img
          src="https://images.pexels.com/photos/2034892/pexels-photo-2034892.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Science</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Health")}>
        <img
          src="https://images.pexels.com/photos/40751/running-runner-long-distance-fitness-40751.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Health</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Movies")}>
        <img
          src="https://images.pexels.com/photos/5662857/pexels-photo-5662857.png?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Movies</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Technology")}>
        <img
          src="https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Technology</p>
      </div>

      <div className="sidebarOption" onClick={() => handleSelect("Education")}>
        <img
          src="https://images.pexels.com/photos/3755511/pexels-photo-3755511.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <p>Education</p>
      </div>
    
    </div>
  );
}

export default SidebarOptions;
