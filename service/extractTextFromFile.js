import mammoth from "mammoth";
import fs from "fs";


export default async function extractTextFromFile(filepath, filetype) {
const buffer = await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filepath);
    const chunks = [];
    fileStream.on("data", (chunk) => {
        chunks.push(chunk);
    });
    fileStream.on("error", (error) => {
        reject(error);
    });
    fileStream.on("end", () => {
        resolve(Buffer.concat(chunks));
    });
    });

    // Handle different file types using different modules
    switch (filetype) {
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // i.e. docx file
            const docxResult = await mammoth.extractRawText({ path: filepath });
            return docxResult.value;
        case "text/plain":
            return buffer.toString();
        default:
            throw new Error("Unsupported file type");
    }
}