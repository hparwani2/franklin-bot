import { IncomingForm } from "formidable";
import extractTextFromFile from "../service/extractTextFromFile.js";
import { createEmbeddings } from "../service/createEmbeddings.js";

export async function processFile(req, res) {
    const form = new IncomingForm();
    form.maxFileSize = 30 * 1024 * 1024; // Set the max file size to 30MB
    try {
        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              reject(err);
            } else {
              resolve({ fields, files });
            }
          });
        });
        const file = files.file[0];
        if (!file || Array.isArray(file) || file.size === 0) {
          res.status(400).json({ error: "Invalid or missing file" });
          return;
        }
    
        const text = await extractTextFromFile(
          file.filepath,
          file.mimetype ?? "",
        );
    
        const { meanEmbedding, chunks } = await createEmbeddings(
          text,
        );
    
        res.status(200).json({ text, meanEmbedding, chunks });
      } catch (error) {
        res.status(500).json({ error: error.message });
      } finally {
        // Always send a response, even if it is empty
        res.end();
      }
}