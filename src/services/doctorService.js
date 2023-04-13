import { reject } from "bcrypt/promises"
import db from "../models/index"
import {_} from 'lodash'
require('dotenv').config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctor =(limit)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.User.findAll({
                where: {roleId: 'R2'},
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes:{
                    exclude:['password']
                },
                include:[
                    {model: db.Allcode, as: 'positionData', attributes:['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes:['valueEn', 'valueVi']},

                ],
                raw: true,
                nest: true

            })
            console.log('check data top doctor:', user)
            resolve({
                errCode: 0,
                data: user
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctors = ()=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes:{
                    exclude:['password', 'image']
                }

            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}


let saveDetailInfoDoctor = (inputData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputData.doctorId || !inputData.description|| !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment || !inputData.selectedProvince
                || !inputData.nameClinic || !inputData.addressClinic || !inputData.note
                || !inputData.specialtyId    ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else{
                // upsert(update or insert) to markDown table
                if(inputData.action === 'CREATE'){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdonw: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                } else if (inputData.action === 'EDIT'){
                    let doctorMarkDown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId},
                        raw: false
                    })
                    if(doctorMarkDown){
                        doctorMarkDown.contentHTML= inputData.contentHTML;
                        doctorMarkDown.contentMarkdonw= inputData.contentMarkdown;
                        doctorMarkDown.description= inputData.description;
                        doctorMarkDown.updateAt = new Date();
                        await doctorMarkDown.save()
                    }
                }
                // upsert to doctor_info table
                let doctorInfo = await db.Doctor_info.findOne({
                    where:{
                        doctorId: inputData.doctorId
                    },
                    raw:false
                })
                if(doctorInfo){
                    // update data doctor_info
                    doctorInfo.doctorId= inputData.doctorId
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.specialtyId;
                    doctorInfo.clinicId = inputData.clinicId;
                    await doctorInfo.save()
                }else{
                    // create data doctor_info
                    await db.Doctor_info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                        specialtyId : inputData.specialtyId,
                        clinicId : inputData.clinicId,

                    })
                }
                
                resolve({
                    errCode:0,
                    errMessage: 'sava info doctor succeed!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDdoctorByIdService = (inputId)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!inputId){
                resolve({
                    errCode:1,
                    errMessage: 'Missing required parameter!'
                })
            }else{
                let data = await db.User.findOne({
                    where: {id: inputId},
                    attributes:{
                        exclude:['password']
                    },
                    include:[
                        {
                            model: db.Markdown, 
                            attributes:['description', 'contentHTML', 'contentMarkdonw']
                        }, 
                        {
                            model: db.Allcode, as: 'positionData', attributes:['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Doctor_info,
                            include:[
                                
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }

                            ]
                            //attributes: ['description', 'contentHTML', 'contentMarkdonw']
                        } 
                    ],
                    raw: false,
                    nest: true
                })

                if(data && data.image){
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if(!data){
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

// save schedule doctor
let bulkCreateScheduleService = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            // doctorId: selectedDoctor.value,
            //     date: formatDate
            if (!data.arrSchedule || !data.doctorId ||!data.date){
                resolve({
                    errCode:1,
                    errMessage:'missing required param!'
                })
            }else{
                let schedule = data.arrSchedule

                if(schedule && schedule.length >0){
                    schedule = schedule.map(item=>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                console.log('check data schedule', schedule)

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                // if(existing&&existing.length>0){
                //     existing = existing.map(item=>{
                //         item.date = new Date(item.date).getTime()
                //         return item
                //     })
                // }

                //console.log('check existing', existing)

                //so sanh data truyen len schedule va data trong database existing
                // lay ra du lieu  đẩy lên không trùng với dữ liệu data (so sanh timeType && date)
                let toCreate = _.differenceWith(schedule, existing,(a, b)=>{
                    return a.timeType === b.timeType && +a.date=== +b.date
                })
                console.log('======================')
                console.log('check toCreate',toCreate)
                console.log('======================')

                if(toCreate&&toCreate.length>0){
                    await db.Schedule.bulkCreate(toCreate)
                }
                
                
                resolve({
                    errCode:0,
                    errMessage:'Save schdule success!'
                })
            }
            
        } catch (e) {
            reject(e)
        }
    })

}
//get schedule by id
let getScheduleByDateService=(doctorId, date)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!doctorId || !date){
                resolve({
                    errCode:1,
                    errMessage:'missing required paramate!'
                })
            }else{
                let dataSchedule = await db.Schedule.findAll({
                    where:{
                        doctorId:doctorId,
                        date: date
                    },
                    include:[
                        {model: db.Allcode, as: 'timeTypeData', attributes:['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true
                   
                })
                if (!dataSchedule) dataSchedule =[]
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
            
        }
    })
}

// get other infomation doctor
let getOtherInfomationDoctorService=(doctorId)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!doctorId){
                resolve({
                    errCode: 1,
                    errMessage:'missing required parameters'
                })
            }else{
                let dataDoctorInfo = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId },
                    raw: false,
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }

                    ]
                })
                if(!dataDoctorInfo) dataDoctorInfo=[]
                resolve({
                    errCode:0,
                    data: dataDoctorInfo
                })
            }
            
        } catch (e) {
            reject(e)
        }
    })
}

// get profile doctor
let getProfileDoctorById=(doctorId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!doctorId){
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameters'
                })
            }else{
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdonw']
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Doctor_info,
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }

                            ]
                            //attributes: ['description', 'contentHTML', 'contentMarkdonw']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

// get benh nhan for dotor theo date
let getListPatientForDoctorService=(doctorId, date)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameters'
                })
            }else{
                let data = await db.Booking.findAll({
                    where:{
                        statusId: 'S2',
                        doctorId: doctorId,
                        date : date
                    }, 
                    include: [
                        {
                            model: db.User,as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender', 'phonenumber'],
                            include:[
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },

                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode:0,
                    errMessage:'ok',
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

// cap nhat thang thai status in table bookings
let doneAppointmentPatientService=(dataInput)=>{
    console.log("check idbooking>>>>>>>>>>>>>>>>>>")
    return new Promise(async(resolve, reject) => {
        try {
            if(!dataInput.id){
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameters'
                })
            }else{
                let data = await db.Booking.findOne({
                    where:{id : dataInput.id},
                    raw:false
                })
                if(data){
                    data.statusId = 'S3'
                    await data.save()
                    resolve({
                        errCode:0,
                        errMessage:'update ok'
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
module.exports = {
    getTopDoctor:getTopDoctor,
    getAllDoctors:getAllDoctors,
    saveDetailInfoDoctor:saveDetailInfoDoctor,
    getDetailDdoctorByIdService:getDetailDdoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getOtherInfomationDoctorService: getOtherInfomationDoctorService,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctorService:getListPatientForDoctorService,
    doneAppointmentPatientService:doneAppointmentPatientService
}