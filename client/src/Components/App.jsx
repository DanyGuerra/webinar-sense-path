import SignUp from "./SignUp";
import Webinar from "./Webinar";

import { useState } from "react";

function App() {
  const [actualUser, setActualUser] = useState("");
  const [actualMail, setActualMail] = useState("");

  return (
    <>
      {actualUser ? (
        <Webinar actualUser={actualUser} actualMail={actualMail}></Webinar>
      ) : (
        <SignUp
          setActualUser={setActualUser}
          setActualMail={setActualMail}
        ></SignUp>
      )}
    </>
  );
}

export default App;
