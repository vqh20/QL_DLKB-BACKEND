import speciatlyService from '../services/speciatlyService'


let createSpeciatly=async(req, res)=>{
    try {
        let data = await speciatlyService.createSpeciatlyService(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let getAllSpecialty=async(req, res)=>{
    try {
        let data = await speciatlyService.getAllSpecialtyService()
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from the server'
        })
    }
}

let getDetailSpecialtyById = async(req,res)=>{
    try {
        let data = await speciatlyService.getDetailSpecialtyByIdService(req.query.id)
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
    createSpeciatly:createSpeciatly,
    getAllSpecialty:getAllSpecialty,
    getDetailSpecialtyById:getDetailSpecialtyById
}