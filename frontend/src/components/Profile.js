import React from 'react'
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import "./css/Profile.css";
import "./css/Quora.css";
import Feed from "./Feed";
import axios from 'axios';
import { useState, useEffect } from 'react';

const fetchUserPosts = async (username, setUserposts) => {
  try {
    const response = await axios.get(`/getquestionsofuser/${username}`);
    setUserposts(response.data.reverse());
  } catch (error) {
    // Handle error
  }
};

export default function Profile({user,isAdmin}) {
  const [userposts , setUserposts] = useState([]);
  const usersection = "all";
  const [username,setusername] = useState(localStorage.getItem('username'))
  const [email,setEmail] = useState(localStorage.getItem('useremail'))


  useEffect(() => {
    if (username) {
      fetchUserPosts(username, setUserposts);
    }
  },[username]);

  return (
    <>
    
    <div className="user-profile-box">
      <div className="user-profile-box__icon">
        <AccountCircleOutlined  fontSize="large" />
      </div>
      <div className="user-profile-box__info">
        <div className="user-profile-box__name">{username}</div>
        <div className="user-profile-box__email">{email}</div>
      </div>
    </div>
      <div className = "feedBox">
        <Feed user={user} posts={userposts} fetchPosts={fetchUserPosts} section={usersection} isAdmin={isAdmin} />
      </div>

    </>
  )
}
