const db = require("../models")

let createClinicService = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.nameSpeciatly || !data.address ||  !data.imgBase64 ||!data.descriptionHTML||!data.descriptionMarkdown
                ){
                resolve({
                    errCode:1,
                    errMessage:'missing requier param'
                })
            }else{
                await db.Clinic.create({
                    name: data.nameSpeciatly,
                    address: data.address,
                    image: data.imgBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage:'create ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
//
let getAllClinicService = ()=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let data= await db.Clinic.findAll();
            if(data&&data.length>0){
                data.map(item=>{
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode:0,
                errMessage: 'get all clinic ok',
                data
        })
        } catch (error) {
            reject(error)
        }
        
    })
}
//
let getDetailClinicByIdService = (inputId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputId){
                resolve({
                    errCode:1,
                    errMessage:'missing requier param'
                })
            }else{
                let data = {}
                 data =await db.Clinic.findOne({
                    where: {id: inputId},
                    attributes: ['descriptionHTML','descriptionMarkdown', 'address','name'],
                    raw:true
                })
                if(data){
                    let doctorInClinic = await db.Doctor_info.findAll({
                        where:{clinicId: inputId},
                        attributes: ['doctorId'],
                        raw:true
                        

                    })
                    data.doctorInClinic = doctorInClinic
                console.log('check doctorInSpecialty>>>>>>>>>>>>',data)


                }else{
                    data={}
                }

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
 module.exports = {
    createClinicService:createClinicService,
    getAllClinicService:getAllClinicService,
    getDetailClinicByIdService:getDetailClinicByIdService
 }