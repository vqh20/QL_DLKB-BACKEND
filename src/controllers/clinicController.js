import clinicService from '../services/clinicService'

let createClinic = async(req, res)=>{
    try {
        let data = await clinicService.createClinicService(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let getAllClinic =async(req, res)=>{
    try {
        let data = await clinicService.getAllClinicService()
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let getDetailClinicById = async(req,res)=>{
    try {
        let data = await clinicService.getDetailClinicByIdService(req.query.id)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

module.exports={
    createClinic:createClinic,
    getDetailClinicById:getDetailClinicById,
    getAllClinic:getAllClinic
}