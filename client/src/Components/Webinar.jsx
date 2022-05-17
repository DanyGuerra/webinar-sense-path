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

const WebinarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  width: 100%;
  height: 100vh;
  padding: 0 50px;
  gap: 5%;
`;

const ChatWrapper = styled.div`
  width: 25%;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);

  .content {
    text-align: center;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    .box-messages {
      height: 70%;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 30px;
      padding: 20px 0;

      .item {
        padding: 5px;
        border: 1px solid black;
        border-radius: 10px;
        position: relative;
      }
      .item.mine {
        align-self: flex-end;
        background-color: black;
        color: white;
      }
      .name {
        color: black;
        position: absolute;
        top: -15px;
        left: 0;
      }
      .second {
        color: black;
        position: absolute;
        bottom: -15px;
        right: 0;
      }
    }
    form {
      height: 30%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      gap: 5%;
      textarea {
        height: 40%;
        resize: none;
      }
      button {
        height: 30%;
        :hover {
          cursor: pointer;
        }
      }
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
        <div className="content">
          <h3>Deja tu comentario {actualUser}</h3>
          <section className="box-messages">
            {messages.map((item, i) => (
              <div
                key={i}
                className={`${item.user === actualUser ? "item mine" : "item"}`}
              >
                <small className="name">{item.user}</small>
                <div>{item.message}</div>
                <small className="second">
                  {fmtMSS(Math.trunc(item.videoTime))}
                </small>
              </div>
            ))}
          </section>
          <form>
            <textarea onChange={messageChange} ref={areaComment}></textarea>
            <button type="submit" onClick={handleSubmit} ref={buttonSend}>
              Enviar
            </button>
          </form>
        </div>
      </ChatWrapper>
    </WebinarWrapper>
  );
};

export default Webinar;
