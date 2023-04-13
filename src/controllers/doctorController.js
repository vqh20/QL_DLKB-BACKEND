import doctorService from '../services/doctorService'


let getDoctorTop = async(req, res)=>{
    let limit = req.query.limit
    if(!limit) limit = 10; // so luong doctor muon lay 
    try {
        let response = await doctorService.getTopDoctor(+limit); // +limit chuyen ve dang so nguyen
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
        
    }
}

let getAllDoctors = async(req, res)=>{
    try {
        let doctors = await doctorService.getAllDoctors()
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}
let postInfoDoctor =async (req, res)=>{
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let getDetailDdoctorById =async (req, res)=>{
    try {
        let infor = await doctorService.getDetailDdoctorByIdService(req.query.id)
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode:-1,
            errMessage:'error from the server'
        })
    }
}

let bulkCreateSchedule = async(req, res)=>{
    try {
        let schedule = await doctorService.bulkCreateScheduleService(req.body)
        return res.status(200).json({
            schedule
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode:-1,
            errMessage: 'error from the server'
        })
    }
}
//
let getScheduleByDate = async(req, res)=>{
    try {
        let schedule = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date)
        return res.status(200).json({
            schedule
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}
//
let getOtherInfomationDoctorById=async(req, res)=>{
    try {
        let otherInfomation = await doctorService.getOtherInfomationDoctorService(req.query.doctorId)
        return res.status(200).json({
            otherInfomation
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let getProfileDoctorById=async(req,res)=>{
    try {
        let profileDoctor = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json({
            profileDoctor
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

//
let getListPatientForDoctor=async(req, res)=>{
    try {
        let data = await doctorService.getListPatientForDoctorService(req.query.doctorId, req.query.date )
        return res.status(200).json({
            data
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let doneAppointmentPatient =async(req, res)=>{
    try {
        let data = await doctorService.doneAppointmentPatientService(req.body)
        return res.status(200).json({
            data
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}
module.exports={
    getDoctorTop:getDoctorTop,
    getAllDoctors:getAllDoctors,
    postInfoDoctor,postInfoDoctor,
    getDetailDdoctorById:getDetailDdoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getOtherInfomationDoctorById: getOtherInfomationDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor:getListPatientForDoctor,
    doneAppointmentPatient
}