import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import reportWebVitals from "./reportWebVitals";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@import url("https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap");
  body {
    margin:0;
    padding: 0;
    font-family: "Sen";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;


  }
  *{
    box-sizing: border-box;
  }



`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle></GlobalStyle>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
