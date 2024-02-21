
import { OpenAI } from 'openai';

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