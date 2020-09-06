import { GoogleSpreadsheet } from "google-spreadsheet";
import Config from "../config";

const SHEET_ID = 0;
const doc = new GoogleSpreadsheet(Config.SHEET_ID);

export const postDataToSheets = async index => {
  try {
    const data = {
      Web_Client: "PWA_client",
      Timestamp: new Date(),
      Index: index
    };
    await doc.useServiceAccountAuth({
      client_email: Config.CLIENT_EMAIL,
      private_key: Config.PRIVATE_KEY
    });
    await doc.loadInfo();
    const sheet = doc.sheetsById[SHEET_ID];
    const result = await sheet.addRow(data);
    console.log(result);
  } catch (err) {
    throw err;
  }
};
