import React, { useEffect, useRef } from "react";
import { db } from "../firebase.config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import "../styles/SignUp.css";
import mancha from "../utils/mancha.svg";
import logo from "../utils/logo-sensepath.svg";
import expertise from "../utils/expertise.png";

const inputsInitial = [
  {
    name: "nombre",
    type: "text",
    placeholder: "NOMBRE",
    validation: null,
    value: "",
    minLength: 4,
  },
  {
    name: "email",
    type: "email",
    placeholder: "CORREO ELECTRÓNICO",
    validation: null,
    value: "",
  },
  {
    name: "whatsapp",
    type: "tel",
    placeholder: "WHATSAPP",
    validation: null,
    value: "",
    size: 10,
    maxLength: 10,
  },
  {
    name: "empresa",
    type: "text",
    placeholder: "EMPRESA",
    validation: null,
    value: "",
  },
];

const SignUp = ({ setActualUser, setActualMail }) => {
  const [inputs, setInputs] = React.useState([]);

  const usersCollectionRef = collection(db, "users");
  let buttonSignUp = useRef(null);

  useEffect(() => {
    getUsers();
    setInputs(inputsInitial);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.disabled = true;
    allValidation();
    const validation = checkValidation();
    if (validation.every((el) => el === true)) {
      createUser();
    } else {
      buttonSignUp.current.disabled = false;
    }
  };

  const getUsers = async () => {
    await getDocs(usersCollectionRef);
  };

  const createUser = async () => {
    try {
      await addDoc(usersCollectionRef, {
        username: inputs[0].value,
        email: inputs[1].value,
        whatsapp: inputs[2].value,
        empresa: inputs[3].value,
      });

      const spread = await fetch("/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: inputs[0].value,
          email: inputs[1].value,
          whatsapp: inputs[2].value,
          empresa: inputs[3].value,
        }),
      });

      if (spread.ok) {
        setActualMail(inputs[1].value);
        setActualUser(inputs[0].value);
      } else {
        buttonSignUp.current.disabled = false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  function isNumberValid(number) {
    const regex = /^[0-9]*$/;
    return regex.test(number);
  }

  const inputChange = (e) => {
    const nameInput = e.target.name;
    const resultado = inputs.map((input) => {
      if (input.name === nameInput) {
        input.value = e.target.value;
        input = oneValidation(input);
      }
      return input;
    });

    setInputs(resultado);
  };

  const checkValidation = () => {
    return inputs.map((input) => {
      return input.validation;
    });
  };

  const allValidation = () => {
    const resultado = inputs.map((input) => {
      input = oneValidation(input);
      return input;
    });

    setInputs(resultado);
  };

  const oneValidation = (input) => {
    const value = input.value;
    if (!value) {
      input.validation = false;
    } else if (value.length < input.minLength) {
      input.validation = false;
    } else if (input.size && value.length !== input.size) {
      input.validation = false;
    } else {
      switch (input.type) {
        case "text":
          input.validation = true;
          break;
        case "email":
          if (!isEmail(value)) {
            input.validation = false;
          } else {
            input.validation = true;
          }
          break;
        case "tel":
          if (!isNumberValid(value)) {
            input.validation = false;
          } else {
            input.validation = true;
          }
          break;
        default:
          break;
      }
    }
    return input;
  };

  return (
    <>
      <div className="mancha hidden-mobile show-desktop">
        <img src={mancha} alt="Logo" />
      </div>

      <main>
        <section className="main-section">
          <div className="left-message">
            <div className="logo-header show-desktop hidden-mobile">
              <img src={logo} alt="Sense Path logo" width="252px" />
            </div>
            <h1>
              INTRODUCCIÓN A LA <b>EVALUACIÓN SENSORIAL</b> CHARLA EN VIVO
            </h1>
            <h2>
              <b>PATRICIA FUENTES</b>
            </h2>
            <h2>Fundadora de Sense Path</h2>

            <p className="show-desktop hidden-mobile">
              Regístrate para entrar a la charla en vivo sobre como la
              evaluación sensorial puede ayudar a tu producto. Entérate de como
              puedes descubrir atributos personales, lo que opinan tus clientes
              o futuros compradores, como diferenciarte de tu compentencia y
              mucho más.
            </p>
          </div>
          <div className="formulario">
            <form action="" method="post" id="form">
              {inputs.map((input, index) => (
                <div
                  className={(() => {
                    if (input.validation === true) {
                      return "form-control success";
                    } else if (input.validation === false || null) {
                      return "form-control error";
                    } else {
                      return "form-control";
                    }
                  })()}
                  key={index}
                >
                  {/* <small>Error message</small> */}
                  <input
                    name={input.name}
                    type={input.type}
                    onChange={inputChange}
                    onBlur={inputChange}
                    placeholder={input.placeholder}
                    size={input.size}
                    maxLength={input.maxLength}
                  />
                  <i className="fas fa-check-circle"></i>
                  <i className="fas fa-exclamation-circle"></i>
                </div>
              ))}

              <button type="submit" onClick={handleSubmit} ref={buttonSignUp}>
                ENVIAR
              </button>
            </form>
          </div>
          <div className="logo-main hidden-desktop">
            <img src={logo} alt="Sense Path logo" width="252px" />
          </div>
          <p className="hidden-desktop show-mobile">
            Regístrate para entrar a la charla en vivo sobre como la evaluación
            sensorial puede ayudar a tu producto. Entérate de como puedes
            descubrir atributos personales, lo que opinan tus clientes o futuros
            compradores, como diferenciarte de tu compentencia y mucho más.
          </p>
        </section>
      </main>
      <footer>
        <div className="banner">
          <div className="banner-text">
            <h1>ESTRATEGIA SENSORIAL APLICADA A TU MARCA</h1>
            <h1>
              <b>SOMOS LA EMPRESA MEXICANA</b> DE MÁS ALTO EXPERTISE SENSORIAL
            </h1>
            <a
              href="https://www.sense-path.com/#topFooter"
              target="_blank"
              rel="noreferrer"
            >
              <button className="secondary-button">CONTÁCTANOS</button>
            </a>
          </div>
          <img className="show-desktop hidden-mobile" src={expertise} alt="" />
        </div>
        <div className="aviso-privacidad">
          <a
            href="https://www.sense-path.com/SP-AvisoPrivacidad.pdf"
            target="_blank"
            rel="noreferrer"
          >
            AVISO DE PRIVACIDAD{" "}
          </a>
        </div>
      </footer>
    </>
  );
};

export default SignUp;
