import patinerService from "../services/patienrService"

let postBookAppointment=async(req, res)=>{
    try {
        let dataPatient = await patinerService.postBookAppointmentService(req.body)
        return res.status(200).json({
            data:dataPatient
        })
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let postVerifyBookAppointment= async(req, res)=>{
    try {
        let data = await patinerService.postVerifyBookAppointmentService(req.body)
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
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}