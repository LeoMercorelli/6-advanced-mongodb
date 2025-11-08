import __dirname from "./index.js";
import multer from "multer";

const almacenamiento = multer.diskStorage({
  destination: function (req, file, cb) {
    let carpeta = "general";

    if (file.fieldname === "image") {
      carpeta = "pets";
    } else if (file.fieldname === "document") {
      carpeta = "documents";
    }

    cb(null, `${__dirname}/../public/${carpeta}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage: almacenamiento });

export default uploader;
