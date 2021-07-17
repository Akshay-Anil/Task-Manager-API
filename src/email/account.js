const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email,name)=>{ 
sgMail.send({
    to: email,
    from:'akshay_b180034cs@nitc.ac.in',
    subject:'Thanks for joining',
    text:`Welcome to the app , ${name}.Let us know how you get along with the app.`
})
}

const sendCancelationMail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'akshay_b180034cs@nitc.ac.in',
        subject:'Farewell',
        text:` ${name},Let us know what you didn't like about the app.`
    })
    }

module.exports = {
    sendWelcomeMail,
    sendCancelationMail
}