import React from "react";
import Sidebar from "./Sidebar";
import "./css/Quora.css";
import Feed from "./Feed";
import Widget from "./Widget";

function Home({ user, isAdmin, fetchPosts, handleSection, section, posts }) {
  return (
    <div className="quora__contents">
        <div className="quora__content">
          <Sidebar onSelectSection={handleSection} />
          <Feed user={user} posts={posts} fetchPosts={fetchPosts} section={section} isAdmin={isAdmin} />
          <Widget />
        </div>
    </div>
  );
}
                    
export default Home;
