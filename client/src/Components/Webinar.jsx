import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { db } from "../firebase.config";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import logo from "../utils/logo-sensepath.svg";
import Messages from "./Messages";

const WebinarWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 30px 30px;
  margin: 0;
  gap: 5%;
  background: linear-gradient(
    113.09deg,
    rgba(0, 92, 245, 0.1) 0%,
    rgba(255, 97, 115, 0.1) 100.32%
  );

  * {
    box-sizing: border-box;
  }

  b {
    font-weight: 800;
  }

  .title-header {
    .title {
      text-align: center;
      color: #005cf5;
      h2 {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        margin: 0;
        b {
          font-weight: 800;
        }
      }
    }
  }

  .show-desktop {
    display: block;
  }
  .hidden-desktop {
    display: none;
  }

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

  @media (max-width: 992px) {
    background: white;
    padding: 10px 10px;
    background: #ffffff;

    section {
      width: 90%;
      flex-direction: column;

      video {
        width: 100%;
      }
    }
    .hidden-mobile {
      display: none;
    }

    .show-mobile {
      display: block;
    }

    .title-header.show-mobile {
      margin: 20px 0px;
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title.left {
        text-align: left;
      }
      .title.right {
        text-align: right;
        color: #ff6173;
      }
    }
  }
  @media (max-width: 600px) {
    padding: 0px 0px;
    section {
      width: 100%;
      flex-direction: column;

      video {
        width: 100%;
      }
    }
  }
`;

const ChatWrapper = styled.div`
  display: flex;
  width: 25%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .box-messages {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 100%;
    height: 500px;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 20px 10px;
    gap: 20px;
    .item {
      max-width: 80%;
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
      align-self: flex-end;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
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
      font-style: normal;
      font-family: "Sen";
      font-weight: 700;
      font-size: 16px;
      padding: 10px;
    }
    button {
      box-sizing: border-box;
      margin: 0;
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      height: 50px;
    }
  }

  @media (max-width: 992px) {
    width: 70%;
    .box-messages {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    }
  }
  @media (max-width: 600px) {
    width: 90%;
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
  const [filterMessages, setFilterMessages] = React.useState([]);
  const [currentSecond, setCurrentSecond] = React.useState(0);

  const usersCollectionRef = collection(db, "messages");

  let areaComment = useRef(null);
  let buttonSend = useRef(null);
  let video = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSecond(Number(video.current.currentTime.toFixed(2)));
    }, 1000);

    video.current.volume = 1;

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getAllMessages();
  }, []);

  useEffect(() => {
    const filterBySecond = () => {
      const copyAllMessages = [...messages];
      const filter = copyAllMessages.filter(
        (message) => message.videoTime <= currentSecond
      );
      if (filter.length > filterMessages.length) {
        setFilterMessages(filter);
      }
    };

    filterBySecond();
  }, [currentSecond]);

  const getAllMessages = async () => {
    const q = await query(usersCollectionRef, orderBy("videoTime"));

    onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({ ...doc.data() }));
      if (allMessages.length > messages.length) {
        setMessages(allMessages);
      }
    });
  };

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
        getAllMessages();
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

  return (
    <WebinarWrapper>
      <a href="https://www.sense-path.com/" target="_blank" rel="noreferrer">
        <img src={logo} alt="Sense Path logo" width="150px" />
      </a>
      <div className="title-header show-mobile">
        <div className="title left">
          <h2 className="hidden-desktop show-mobile">INTRODUCCIÓN A LA</h2>
          <h2>
            <b className="hidden-desktop show-mobile">EVALUACIÓN SENSORIAL</b>
          </h2>

          <h2 className="hidden-desktop show-mobile">CHARLA EN VIVO</h2>
        </div>

        <div className="title right">
          <h2>
            <b className="hidden-desktop show-mobile">PATRICIA FUENTES</b>
          </h2>

          <h2 className="hidden-desktop show-mobile">
            Fundadora de Sense Path
          </h2>
        </div>
      </div>
      <section>
        <video
          ref={video}
          id="video"
          width="100%"
          controls={false}
          autoPlay={true}
          loop={false}
        >
          <source
            src="https://firebasestorage.googleapis.com/v0/b/sense-path-webinar.appspot.com/o/SP-VidLanding-1080.mp4?alt=media&token=2151681e-4637-4d6b-ba9d-094adf4f2949"
            type="video/mp4"
          />
        </video>
        <ChatWrapper>
          <div className="title-header">
            <div className="title">
              <h2 className="show-desktop hidden-mobile">INTRODUCCIÓN A LA</h2>
              <h2>
                <b className="show-desktop hidden-mobile">
                  EVALUACIÓN SENSORIAL
                </b>
              </h2>

              <h2 className="show-desktop hidden-mobile">CHARLA EN VIVO</h2>
            </div>

            <div className="title">
              <h2>
                <b className="show-desktop hidden-mobile">PATRICIA FUENTES</b>
              </h2>

              <h2 className="show-desktop hidden-mobile">
                Fundadora de Sense Path
              </h2>
            </div>
          </div>
          <Messages
            messages={filterMessages}
            actualMail={actualMail}
          ></Messages>
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
      <footer>
        <div
          className="
        aviso-privacidad"
        >
          <a
            href="https://www.sense-path.com/SP-AvisoPrivacidad.pdf"
            target="_blank"
            rel="noreferrer"
          >
            AVISO DE PRIVACIDAD
          </a>
        </div>
      </footer>
    </WebinarWrapper>
  );
};

export default Webinar;
