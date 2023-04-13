import db from "../models"
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

// url email
let builUrlEmail = (doctorId,token)=>{
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}
// create user patinet khi đặt lịch khám
let postBookAppointmentService = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.timeBooking || !data.selectedGender
                || !data.address || !data.phoneNumber|| !data.timeSeeDoctor
                ){
                resolve({
                    errCode: 1,
                    errMessage:'missing requier param'
                })
            }else{
                let token = uuidv4();
                await emailService.sendEmail({
                    reciverEmail: data.email,
                    namePatient: data.fullName ,
                    time: data.timeBooking ,
                    linkHere: builUrlEmail(data.doctorId, token),
                    
                })

                // upsert user patient
                let userPatinet = await db.User.findOrCreate({
                    // tifm kiem theo email trong database neu ko thấy tra ve defaults
                    where:{ email: data.email}, // neu tim thay se tra ve data tim thay theo email
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        phonenumber: data.phoneNumber,
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                        
                    }
                
                })

                console.log('check user patient', userPatinet)
                
                // create bookings(table bookings)
                if(userPatinet&&userPatinet[0]){
                    await db.Booking.findOrCreate({
                        where:{ patienId: userPatinet[0].id},
                        defaults:{
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patienId: userPatinet[0].id,
                            //them(edit)
                            date: data.timeSeeDoctor,
                            timeType: data.timeType,
                            token: token
                        }
                       
                    })

                }
                resolve({
                    errCode: 0,
                    errMessage:'Save user Patinet and Bookings sussess!',
                    
                })

            }
            
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointmentService=(data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.token || !data.doctorId){
                resolve({
                    errCode: 1,
                    errMessage:'missing requier param'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where:
                        {   token: data.token,
                            doctorId: data.doctorId,
                            statusId: 'S1'
                        },
                    raw: false
                })
                if(appointment){
                    appointment.statusId = 'S2'
                    await appointment.save();
                    resolve({
                        errCode:0,
                        errMessage:'update appointment sussess'
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports={
    postBookAppointmentService: postBookAppointmentService,
    builUrlEmail: builUrlEmail,
    postVerifyBookAppointmentService: postVerifyBookAppointmentService
}