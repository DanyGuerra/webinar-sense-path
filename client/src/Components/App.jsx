import SignUp from "./SignUp";
import Webinar from "./Webinar";

import { useState } from "react";

function App() {
  const [actualUser, setActualUser] = useState("Juan Lopez");
  const [actualMail, setActualMail] = useState("juanlopez@example.com");

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
