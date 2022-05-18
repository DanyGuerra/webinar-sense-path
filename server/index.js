const express = require("express");
const path = require("path");
const { google } = require("googleapis");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//*Development for conection with react port 3000 and 5000 server port.
var cors = require("cors");
app.use(cors());
//

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.post("/", async (req, res) => {
  const nombre = req.body.username;
  const correo = req.body.email;
  const telefono = req.body.whatsapp;
  const empresa = req.body.empresa;

  let fecha = new Date();
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
  };

  let fecharegistro =
    fecha.toLocaleDateString("es-MX", options) +
    " " +
    fecha.toLocaleTimeString("es-MX");

  if (!nombre || !correo || !telefono || !empresa) {
    return res.sendStatus(400);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  //Auth client Object
  const authClientObject = await auth.getClient();

  //Google sheets instance
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  // spreadsheet id
  const spreadsheetId = "18OU1c8WvlrTXVgJUTTl7H7Db2jhHI0Li3Npz873pkYs";

  try {
    const response = await googleSheetsInstance.spreadsheets.values.append({
      auth, //auth object
      spreadsheetId, //spreadsheet id
      range: "A:C", //sheet name and range of cells
      valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
      resource: {
        values: [[nombre, correo, telefono, empresa, fecharegistro]],
      },
    });
    if (response.data) {
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500).render("fallo", { titulo: "My page" });
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
