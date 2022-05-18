import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { db } from "../firebase.config";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import logo from "../utils/logo-sensepath.svg";

const WebinarWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  padding: 30px 30px;
  margin: 0;
  gap: 5%;
  background: linear-gradient(
    113.09deg,
    rgba(0, 92, 245, 0.1) 0%,
    rgba(255, 97, 115, 0.1) 100.32%
  );

  section {
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
    video {
      width: 80%;
    }
  }
`;

const ChatWrapper = styled.div`
  display: flex;
  width: 30%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .title {
    text-align: center;
    h2 {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      color: #005cf5;
      margin: 0;
      bold {
        font-weight: 800;
      }
    }
  }
  .box-messages {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 100%;
    height: 300px;
    overflow-y: scroll;
    scroll-behavior: auto;
    padding: 20px 10px;
    gap: 20px;
    .item {
      max-width: 60%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      color: white;

      .name,
      .second {
        color: #005cf5;
      }

      .message-content {
        display: flex;
        flex-direction: column;
        .message {
          background: #005cf5;
          border-radius: 10px;
          padding: 5px 10px;
        }
        .second {
          align-self: flex-end;
        }
      }
    }
    .item.mine {
      max-width: 70%;
      align-self: flex-end;
      color: white;

      .message {
        background: #ff6173;
      }

      .name,
      .second {
        color: #ff6173;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;

    textarea {
      width: 100%;
      resize: none;
      height: 100px;
    }
    button {
      margin: 0;
    }
  }
`;

const Webinar = ({ actualUser, actualMail }) => {
  const initialMessage = {
    message: "",
    videoTime: 0,
    user: actualUser,
    email: actualMail,
  };
  const [actualMessage, setMessage] = React.useState(initialMessage);
  const [messages, setMessages] = React.useState([]);
  const [currentSecond, setCurrentSecond] = React.useState(0);

  const usersCollectionRef = collection(db, "messages");

  let areaComment = useRef(null);
  let buttonSend = useRef(null);
  let video = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("hi");
      setCurrentSecond(Number(video.current.currentTime.toFixed(2)));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const q = await query(
        usersCollectionRef,
        where("videoTime", "<=", currentSecond)
      );

      onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map((doc) => ({ ...doc.data() }));
        setMessages(allMessages);
      });
    };

    getMessages();
  }, [currentSecond]);

  const sendMessage = async () => {
    try {
      if (!actualMessage.message) {
        return;
      } else {
        buttonSend.current.disabled = true;
        await addDoc(usersCollectionRef, {
          ...actualMessage,
          videoTime: Number(video.current.currentTime.toFixed(2)),
        });
        areaComment.current.value = "";
        buttonSend.current.disabled = false;
        setMessage((prevState) => ({
          ...prevState,
          message: "",
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const messageChange = (e) => {
    setMessage((prevState) => ({
      ...prevState,
      message: e.target.value.trim(),
      videoTime: Number(video.current.currentTime.toFixed(2)),
    }));
  };

  const fmtMSS = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  };

  const handleVideoPlay = (e) => {
    console.log(e.target.currentTime);
  };

  return (
    <WebinarWrapper>
      <img src={logo} alt="Sense Path logo" width="252px" />
      <section>
        <video
          ref={video}
          id="video"
          width="100%"
          no-controls="true"
          muted
          autoPlay={"autoPlay"}
          onChange={handleVideoPlay}
        >
          <source
            src="https://firebasestorage.googleapis.com/v0/b/video-chat-e6b0e.appspot.com/o/example-video.mp4?alt=media&token=e07711ac-74b2-4311-83eb-0802ce084888"
            type="video/ogg"
          />
        </video>
        <ChatWrapper>
          <div className="title">
            <h2>INTRODUCCIÓN A LA</h2>
            <h2>
              <b>EVALUACIÓN SENSORIAL</b>
            </h2>

            <h2>CHARLA EN VIVO</h2>
          </div>

          <div className="title">
            <h2>
              <b>PATRICIA FUENTES</b>
            </h2>

            <h2>Fundadora de Sense Path</h2>
          </div>
          <div className="box-messages">
            {messages.map((item, i) => (
              <div
                key={i}
                className={`${item.user === actualUser ? "item mine" : "item"}`}
              >
                <small className="name">{item.user}</small>
                <div className="message-content">
                  <div className="message">{item.message}</div>
                  <small className="second">
                    {fmtMSS(Math.trunc(item.videoTime))}
                  </small>
                </div>
              </div>
            ))}
          </div>
          <form>
            <textarea
              onChange={messageChange}
              ref={areaComment}
              placeholder="Deja tu mensaje"
            ></textarea>
            <button type="submit" onClick={handleSubmit} ref={buttonSend}>
              Enviar
            </button>
          </form>
        </ChatWrapper>
      </section>
    </WebinarWrapper>
  );
};

export default Webinar;
