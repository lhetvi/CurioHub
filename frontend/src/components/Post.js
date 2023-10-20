import {
  AccountCircleOutlined,
  // ArrowDownwardOutlined,
  // ArrowUpwardOutlined,
  ChatBubbleOutlined,
  // RepeatOneOutlined,
  // ShareOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import React, { useState } from "react";
import "./css/Post.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactTimeAgo from 'react-time-ago'
import axios from "axios";
import ReactHtmlParser from 'html-react-parser'

function LastSeen({ date }) {
  return (
    <div>
      Last seen: <ReactTimeAgo date={date} locale="en-US" timeStyle="round" />
    </div>
  )
}

function Post({ post, user, fetchPosts , isAdmin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isCModelOpen, setIsCModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState({});

  const toggleComments = (questionId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [questionId]: !prevShowComments[questionId],
    }));
  };


  const Close = <CloseOutlined />;

  const handleCQuill = (value) => {
    setComment(value);
  }
  const handleQuill = (value) => {
    setAnswer(value);
  }

  const handleCSubmit = async () => {
    if (localStorage.getItem("token") == null) {
      alert("you need to login first")
    } else {
      if (post?._id && comment !== "") {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        }
        const body = {
          comment: comment,
          questionId: post?._id,
          username: user.username
        }
        await axios.post('/addcomment', body, config)
          .then((res) => {
            // console.log(res.data)
            alert("Comment added successfully")
            setIsCModalOpen(false)
          }).catch((e) => {
            // console.log(e);
            alert('Error in adding Comment please try by login again')
          });
      }
      setComment("");
      fetchPosts();
    }
  }

  const handleSubmit = async (username) => {
    if (localStorage.getItem("token") == null) {
      alert("you need to login first")
    }
    else {
      if (post?._id && answer !== "") {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        }
        const body = {
          answer: answer,
          questionId: post?._id,
          username: user.username
        }
        await axios.post('/addanswers', body, config)
          .then((res) => {
            // console.log(res.data)
            alert("Answer added successfully")
            setIsModalOpen(false)
            sendmail(username, config)
          }).catch((e) => {
            // console.log(e);
            alert('Error in adding answer please try by login again')
          });
      }
      setAnswer("");
      fetchPosts();
    }
  }

  const sendmail = async (username, config) => {
    const body = {
      username: username,
      text: answer,
    }
    await axios
      .post("/sendmailforgetanswer", body, config)
      .then((res) => {
        // console.log(res.data);
      }).catch((e) => {
        // console.log(e);
      });
  }


  const handleDeleteQuestion = async (questionId) => {
    if (isAdmin) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios
        .delete(`/api/questions/${questionId}`, config)
        .then((res) => {
          alert("Question deleted successfully");
          fetchPosts();
        })
        .catch((e) => {
          alert("Error deleting question. Please try again.");
        });
    }
  };
  
  const handleDeleteAnswer = async (answerId) => {
    if (isAdmin) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios
        .delete(`/api/answers/${answerId}`, config)
        .then((res) => {
          alert("Answer deleted successfully");
          fetchPosts();
        })
        .catch((e) => {
          alert("Error deleting answer. Please try again.");
        });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (isAdmin) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios
        .delete(`/api/comments/${commentId}`, config)
        .then((res) => {
          alert("Comment deleted successfully");
          fetchPosts();
        })
        .catch((e) => {
          alert("Error deleting comment. Please try again.");
        });
    }
  };

  return (
    <div className="post">
      <div className="post__info">
        <AccountCircleOutlined />
        <h4>{post?.username}</h4>
        <small><LastSeen date={post?.createdAt} /></small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="post__btnAnswer"
          >
            Answer
          </button>
          {isAdmin && (
            <button onClick={() => handleDeleteQuestion(post._id)} className="post__btnComment">
              Delete Question
            </button>
          )}

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
            <div className="modal__question">
              <h1>{post?.questionName}</h1>
              <p>
                asked by <span className="name">{post?.username}</span> on{" "}
                <span className="name">{new Date(post?.createdAt).toLocaleString()}</span>
              </p>
            </div>
            <div className="modal__answer">
              <ReactQuill value={answer} onChange={handleQuill} placeholder="Enter your answer" />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={() => handleSubmit(post?.username)} type="submit" className="add">
                Add Answer
              </button>
            </div>
          </Modal>
        </div>
        {
          <img src={post.questionUrl} alt="" />
        }
      </div>

      <div className="post__footer">
        {/* <div className="post__footerAction">
          <ArrowUpwardOutlined />
          <ArrowDownwardOutlined />
        </div> */}
        {/* <RepeatOneOutlined /> */}
        <ChatBubbleOutlined onClick={() => toggleComments(post?._id)} />
        <div className="post__footerLeft">
          {/* <ShareOutlined /> */}
          <button onClick={() => setIsCModalOpen(true)} className="post__btnComment">Add Comment</button>
          <Modal
            open={isCModelOpen}
            closeIcon={Close}
            onClose={() => setIsCModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{
              overlay: {
                height: "auto",
              },
            }}
          >
            <div className="modal__question">
              <h1>{post?.questionName}</h1>
              <p>
                asked by <span className="name">{post?.username}</span> on{" "}
                <span className="name">{new Date(post?.createdAt).toLocaleString()}</span>
              </p>
            </div>
            <div className="modal__answer">
              <ReactQuill value={comment} onChange={handleCQuill} placeholder="Enter your Comment" />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsCModalOpen(false)}>
                Cancel
              </button>
              <button onClick={() => handleCSubmit()} type="submit" className="add">
                Add Comment
              </button>
            </div>
          </Modal>
        </div>
      </div>
      {showComments[post?._id] && (
        <>
          {post?.comments.length > 0 && (
            <>
              <p
                style={{
                  color: "rgba(0,0,0,0.5)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  margin: "10px 0",
                }}
              >
                {post?.comments.length} Comments
              </p>

              <div
                style={{
                  margin: "5px 0px 0px 0px ",
                  padding: "5px 0px 0px 20px",
                  borderTop: "1px solid lightgray",
                }}
                className="post__answer"
              >
                {post?.comments?.map((_c) => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        padding: "10px 5px",
                        borderTop: "1px solid lightgray",
                      }}
                      className="post-answer-container"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#888",
                        }}
                        className="post-answered"
                      >
                        <AccountCircleOutlined />
                        <div
                          style={{
                            margin: "0px 10px",
                          }}
                          className="post-info"
                        >
                          <p>{_c?.username}</p>
                          <span>
                            <LastSeen date={_c?.createdAt} />
                          </span>
                        </div>   
                        {isAdmin && (
                  <button onClick={() => handleDeleteComment(_c?._id)} className="post__btnComment">
                    Delete Comment
                  </button>
                )}     
                      </div>
                      <div className="post-answer">
                        {ReactHtmlParser(_c?.text)}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
        </>
      )}



      <p
        style={{
          color: "rgba(0,0,0,0.5)",
          fontSize: "12px",
          fontWeight: "bold",
          margin: "10px 0",
        }}
      >
        {
          post?.allAnswers.length
        } Answers
      </p>
      <div
        style={{
          margin: "5px 0px 0px 0px ",
          padding: "5px 0px 0px 20px",
          borderTop: "1px solid lightgray",
        }}
        className="post__answer"
      >
        {
          post?.allAnswers?.map((_a) => (<>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding: "10px 5px",
                borderTop: "1px solid lightgray",
              }}
              className="post-answer-container"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#888",
                }}
                className="post-answered"
              >
                <AccountCircleOutlined />
                <div
                  style={{
                    margin: "0px 10px",
                  }}
                  className="post-info"
                >
                  <p>{_a?.username}</p>
                  <span><LastSeen date={_a?.createdAt} /></span>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDeleteAnswer(_a?._id)} className="post__btnComment">
                    Delete Answer
                  </button>
                )}     
              </div>
              <div className="post-answer">{ReactHtmlParser(_a?.answer)}</div>
            </div>
          </>
          ))
        }

      </div>
    </div>
  );
}

export default Post;
