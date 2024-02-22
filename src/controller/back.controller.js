
import { OpenAI } from 'openai';
import PDFDocument from 'pdfkit';
import { processDocument } from "../utils/langchain.utils.js";

export const updateFile = async (req, res) => {
    res.setHeader("Content-Type", "applicaton/json")
    if (!req.file) {
        res.status(400).send({ message: 'No existe un pdf' });
    }
    if (!req.body.question) {
        res.status(400).send({ message: 'No se envio una preguntas' });
    }
    //console.log(`./src/uploads/${req.file?.filename}`)
    const text = await processDocument(
        //path: `./src/uploads/${req.file?.filename}`,
        `${req.file?.filename}`,
        req.body.question
    )
    console.log("Respuesta: ", text)
    //res.json(text)
    res.status(200).send({ message: text });
};


export const uploadDiferentFiles = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!req.files || Object.keys(req.files).length !== 2) {
        res.status(400).send({ message: 'Debe proporcionar un archivo XML y un archivo HTML' });
        return;
    }

    const xmlFile = req.files.xml;
    const htmlFile = req.files.html;

    if (!req.body.question) {
        res.status(400).send({ message: 'No se envió una pregunta' });
        return;
    }

    try {
        const pdfBuffer = await combineFilesToPDF(xmlFile.data, htmlFile.data); // Combinar archivos a PDF
        const text = await processDocument(pdfBuffer, req.body.question); // Procesar el documento PDF combinado
        console.log("Respuesta:", text);
        res.status(200).send({ message: text });
    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        res.status(500).send({ message: 'Error al procesar el archivo' });
    }
};
const combineFilesToPDF = async (xmlData, htmlData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            // Creamos un stream de escritura para el archivo PDF
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Escribimos el contenido del XML en el PDF
            doc.text('Contenido del archivo XML:');
            doc.text(xmlData.toString());

            // Agregamos una nueva página para el contenido HTML
            doc.addPage();
            // Escribimos el contenido del HTML en el PDF
            doc.text('Contenido del archivo HTML:');
            doc.text(htmlData.toString());

            // Finalizamos el documento PDF
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

const openai = new OpenAI();
export const orderAI = async (req, res) => {

    const { prompt } = req.body

    console.log(prompt)
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "user",
                content: `Tu tienes un rol de contador de vocales y requiero que cuentes las vocales de este texto: ${prompt}`
            }
        ],
        temperature: 0.1
    })

    // @ts-ignore
    res.send(completion.choices[0].message.content)

}

export const ping = async (req, res) => {
    console.log("Diste ping");
    res.send("Pong")
}