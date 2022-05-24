import { useEffect, useRef } from "react";

const Messages = ({ messages, actualMail }) => {
  const fmtMSS = (s) => {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  };

  useEffect(() => {
    const position = boxMessages.current.scrollTop;
    const scrollHeight = boxMessages.current.scrollHeight;

    boxMessages.current.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const boxMessages = useRef(null);
  return (
    <>
      <div className="box-messages" ref={boxMessages}>
        {messages.map((item, i) => (
          <div
            key={i}
            className={`${item.email === actualMail ? "item mine" : "item"}`}
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
    </>
  );
};

export default Messages;
