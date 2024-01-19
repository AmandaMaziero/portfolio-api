const express = require("express")
const router = express.Router()
const cors = require("cors")
const nodemailer = require("nodemailer")
const morgan = require("morgan")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("common"))

app.get('/', (_, response) => {
    response.status(200).json({ success: true, message: "API is running!" })
})

app.listen(5000, () => console.log("Server Running"))

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

contactEmail.verify((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Ready to Send")
    }
})

router.post("/contact", (request, response) => {
    const name = request.body.firstName + request.body.lastName
    const { email, message, phone } = request.body

    const mail = {
        from: name,
        to: process.env.EMAIL_USER,
        subject: "Contato Site",
        html: `<p>Nome: ${name}</p>
        <p>Email: ${email}</p>
        <p>Telefone: ${phone}</p>
        <p>Mensagem: ${message}</p>`
    }

    contactEmail.sendMail(mail, (error) => {
        if (error) {
            response.status(400).json({ success: false, message: error.message })
        } else {
            response.status(200).json({ success: true, message: "Mensagem enviada" })
        }
    })
})