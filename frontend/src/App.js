import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes , Navigate } from 'react-router-dom';
import Quora from './components/Quora';
import Home from './components/Home';
import Profile from './components/Profile';
import axios from 'axios';

function App() {
  const [user, setUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [section, setSection] = useState("all");
 

  const handleHeader = (status, user) => {
    if (status) {
      if (user.usertype === "Admin") {
        setIsAdmin(true);
      }
      setUser(user);
    } 
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/getquestions");
      setPosts(response.data.reverse());
    } catch (error) {
      // Handle error
    }
  };

  

  const handleSearching = (p) => {
    setPosts(p);
  };

  const handleSection = (s) => {
    setSection(s);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

 

  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<Quora  onHeader={handleHeader} fetchPosts={fetchPosts} onSearch={handleSearching}/>}>
              <Route index element={<Home user={user} isAdmin={isAdmin} fetchPosts={fetchPosts} handleSection={handleSection} section={section} posts={posts}/>} />
              <Route
              path="profile"
              element={
                localStorage.getItem('token') ? (
                  <Profile user={user} isAdmin={isAdmin}/>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            </Route>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
