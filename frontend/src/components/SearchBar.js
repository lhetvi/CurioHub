import React, { useEffect, useState } from "react";
import { Input } from "@mui/material";
import axios from "axios";

function SearchBar({ onSearch, onEmptySearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery !== "") {
        try {
          const response = await axios.get(`/search?query=${searchQuery}`);
          onSearch(response.data); // Pass search results to the parent component
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        onEmptySearch();
      }
    };

    const identifier = setTimeout(() => {
      if (searchQuery === "") {
        onEmptySearch();
      } else {
        handleSearch();
      }
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [searchQuery, onSearch, onEmptySearch]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <Input
        type="text"
        placeholder="Search questions"
        value={searchQuery}
        onChange={handleChange} // Trigger search on input change
      />
    </div>
  );
}

export default SearchBar;
