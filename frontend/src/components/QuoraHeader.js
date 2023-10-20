import React, { useState, useEffect } from "react";
import {
  Home,
  CloseOutlined,
  PeopleAltOutlined,
  ExpandMoreOutlined,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { NavLink } from 'react-router-dom';
import "./css/QuoraHeader.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Button, Input } from "@mui/material";
import axios from "axios";
import LoginForm from "./LoginForm"; // Import the LoginForm component
import RegisterForm from "./RegisterForm"; // Import the RegisterForm component
import SearchBar from "./SearchBar";

function QuoraHeader({ onHeader, fetchPosts, onSearch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSection, setSelectedSection] = useState(""); // State variable for selected section
  const sections = ["History", "Business", "Psychology", "Cooking", "Music", "Science", "Health", "Movies", "Technology", "Education"];

  const Close = <CloseOutlined />;

  const handleSearching = (p) => {
    onSearch(p);
  };

  const handleEmptySearch = () => {
    fetchPosts();
  };


  const handleLogin = (status, token, user) => {
    setIsAuthenticated(status);

    if (status) {
      // console.log('Storing token:', token);
      setUser(user);
      onHeader(true, user);
      localStorage.setItem('token', token); 
      localStorage.setItem('username' , user.username);
      localStorage.setItem('useremail' , user.email)
    } else {
      localStorage.removeItem('token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser({});
    window.location.href = "/";
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (question !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      const body = {
        questionName: question,
        questionUrl: inputUrl,
        username: user.username,
        section: selectedSection,
      };
      try {
        // console.log("Sending request:", body);
        const response = await axios.post("/addquestions", body, config);
        // console.log("Response:", response.data);
        alert(response.data.message);
        setIsModalOpen(false);
        setInputUrl("");
        setQuestion("");
        fetchPosts();
      } catch (error) {
        // console.error("Error:", error);
        alert("Error in adding question");
      }
    }
  };



  return (
    <div className="qHeader">
      <div className="qHeader-content">
        <div className="qHeader__logo">
          <img
            src="https://video-public.canva.com/VAD8lt3jPyI/v/ec7205f25c.gif"
            alt="logo"
          />
        </div>
        <NavLink to="/"   >
          <div className="qHeader__icons">
            <div className="qHeader__icon">
              <Home />
            </div>
          </div>
        </NavLink>
        <div className="qHeader__input" >
          <SearchBar onSearch={handleSearching} onEmptySearch={handleEmptySearch} />
        </div>
        {!isAuthenticated ? (
          <div className="qHeader__Rem">
            <LoginForm onLogin={handleLogin} />
            <RegisterForm />
          </div>
        ) : (
          <div className="qHeader__Rem">
            <NavLink to="/profile">
              <div className="qHeader__icons">
                <div className="qHeader__icon">
                  <AccountCircleOutlined />
                </div>
              </div>
            </NavLink>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
            <Modal
              open={isModalOpen}
              closeIcon={Close}
              onClose={() => setIsModalOpen(false)}
              closeOnEsc
              center
              closeOnOverlayClick={false}
              styles={{
                overlay: {
                  height: "auto",
                },
              }}
            >
              <div className="modal__title">
                <h5>Add Question</h5>
                <h5>Share Link</h5>
              </div>
              <div className="modal__info">
                <AccountCircleOutlined className="avatar" />
                <div className="modal__scope">
                  <PeopleAltOutlined />
                  <p>Public</p>
                  <ExpandMoreOutlined />
                </div>
              </div>
              <div className="modal__Field">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  type=" text"
                  placeholder="Start your question with 'What', 'How', 'Why', etc. "
                />
                <br></br>
                <br></br>

                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="section-dropdown"
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <br></br>
                  <br></br>

                  <Input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)} // Add this line
                    style={{
                      margin: "5px 0",
                      border: "1px solid lightgray",
                      padding: "10px",
                      outline: "2px solid #000",
                    }}
                    placeholder="Optional: include a link that gives context"
                  />

                  {inputUrl !== "" && (
                    <img
                      style={{
                        height: "40vh",
                        objectFit: "contain",
                      }}
                      src={inputUrl}
                      alt="displayimage"
                    />
                  )}
                </div>
              </div>
              <div className="modal__buttons">
                <button className="cancle" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button onClick={(e) => handleSubmit(e)} type="submit" className="add">
                  Add Question
                </button>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuoraHeader;









