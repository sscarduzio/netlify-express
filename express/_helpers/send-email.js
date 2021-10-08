const configManager = require('../config-manager');
const mailgunLib = require('mailgun-js');

module.exports = sendEmail;

async function sendEmail({to, subject, html}) {
    const config = await configManager.getConfig()
    const mailgun = mailgunLib({apiKey: config.mailgun.api_key, domain: config.mailgun.domain})
    const data = {
        to, subject, html, from: config.mailgun.emailFrom
    }

    return new Promise((resolve, reject) => {

        mailgun.messages().send(data, (error, body) => {
            if (error) {
                return reject(error)
            }
            console.log(">> ",data, body)
            return resolve(body)
        })
    })
}

//  sendEmail({
//     to: "scarduzio+1@gmail.com",
//     subject: "Hello from ROR Portal",
//     html: "<h1>hi</h1>"
// })
