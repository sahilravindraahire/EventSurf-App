const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// Sends email when booking is confirmed
const sendBookingEmail = async(userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            text: `Hi ${userName}. Your booking for ${eventTitle} is sucessfully confirmed`
        }

        await transporter.sendMail(mailOptions)
        console.log(`booking email sent successfully to`, userEmail);
        
    } catch (error) {
        console.error(`error sending email: `, error)
    }
}

const sendOTPEmail = async (email, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your EventSurf Account' : 'EventSurf Booking Verification'
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new EventSurf account.'
            : 'Please use the following OTP to verify and confirm your event booking.'
        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your OTP code for login`,
        text: `${title}. Your OTP is: ${otp}.${msg}. This code expires in 5 min `
    }

    await transporter.sendMail(mailOptions)
    console.log(`login OTP email sent to ${email} for ${type}`);
    } catch (error) {
        console.log(`Error sending login OTP email ${email}:`, error);
        
    }
}

module.exports = {sendBookingEmail, sendOTPEmail}