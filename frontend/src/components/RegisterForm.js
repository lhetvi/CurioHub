import React, { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { Modal } from "react-responsive-modal";
import { CloseOutlined, } from "@mui/icons-material";
import "./css/Form.css";
const Close = <CloseOutlined />;


function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username !== "" && email !== "" && password !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        email: email
      }
      await sendmail(body, config);
    }else{
      alert("fill all information")
    }
  }

  const sendmail = async (body, config) => {
    await axios
      .post("/sendmail", body, config)
      .then((res) => {
        console.log(res.data);
      }).catch((e) => {
        setError(e);
      });
  }

  const handelRegister = async () => {
    if (otp === "121103") {
      if (username !== "" && email !== "" && password !== "") {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const body = {
          username: username,
          email: email,
          password: password,
        }
        await axios
          .post("/register", body, config)
          .then((res) => {
            console.log(res.data);
            alert(res.data.message)
            setIsModalOpen(false)
            window.location.href = "/"
          }).catch((e) => {
            setError(e);
          });
      }else{
        alert("fill all information")
      }
    } else {
      alert("otp is wrong")
    }
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Register</Button>
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
        <form className="registration-form" onSubmit={handleSubmit}>
  <input
    className="registration-input"
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <br />
  <input
    className="registration-input"
    type="text"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <br />
  <input
    className="registration-input"
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <br />
  <button className="registration-button" type="submit">
    Register
  </button>
  {error && <p style={{ color: "red" }}>{error}</p>}
  <div>
    <p>Verify the code sent to your email</p>
    <input
      className="registration-input"
      type="number"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <br />
    <button className="registration-button" onClick={handelRegister}>
      Verify and Register
    </button>
  </div>
</form>

      </Modal>
    </>
  );
}

export default RegisterForm;

