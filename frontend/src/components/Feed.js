  // import React, { useEffect, useState } from "react";
  import QuoraBox from "./QuoraBox";
  import "./css/Feed.css";
  import Post from "./Post";

  function Feed({ user, posts, fetchPosts, section ,isAdmin}) {
    const filteredPosts = section === "all" ? posts : posts.filter(post => post.section === section);
      // console.log(section);
    return (
      <div className="feed">
        <QuoraBox />
        {
          filteredPosts.map((post, index) => (
            <Post key={index} post={post} user={user} fetchPosts={fetchPosts} isAdmin = {isAdmin}/>
          ))
        }
      </div>
    );
  }
  
  export default Feed;
  
  
  
  
  
  