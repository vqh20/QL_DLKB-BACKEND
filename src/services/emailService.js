require('dotenv').config();
import nodemailer from "nodemailer"

let sendEmail = async(dataSend)=>{
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Vu Hung 👻" <vqhung141120@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        //text: "Hello world?", // plain text body
        html: `
        <h3>Xin chào ${dataSend.namePatient}!</h3>

        <p>Chúng tôi đã nhận được thông tin đặt lịch khám bệnh của bạn trên Bookingcare</p>

        <div><b>Thời gian khám: ${dataSend.time}</b></div>

        <p>Vui lòng click vào link bên dưới để hoàn tất đặt lịch khám bệnh</p>
        <div><a href='${dataSend.linkHere}' target="_blank">Xác nhận đặt lịch khám bệnh</a></div>
        <br></br>


        <div>Xin cảm ơn!</div>
        `, // html body
    });

}


// async..await is not allowed in global scope, must use a wrapper

module.exports={
    sendEmail: sendEmail
}