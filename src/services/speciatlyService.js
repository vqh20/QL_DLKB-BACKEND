import { reject } from 'lodash'
import db from '../models/index'
import { promise } from 'bcrypt/promises'

let createSpeciatlyService=(data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.nameSpeciatly || !data.imgBase64 ||!data.descriptionHTML||!data.descriptionMarkdown
                ){
                resolve({
                    errCode:1,
                    errMessage:'missing requier param'
                })
            }else{
                await db.specialties.create({
                    name: data.nameSpeciatly,
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
// get all spcialty
let getAllSpecialtyService=()=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let data= await db.specialties.findAll();
            if(data&&data.length>0){
                data.map(item=>{
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode:0,
                errMessage: 'get all spcialty ok',
                data
        })
        } catch (error) {
            reject(error)
        }
        
    })
}
// get thong tin specialty and doctor in specialty
let getDetailSpecialtyByIdService = (inputId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(!inputId){
                resolve({
                    errCode:1,
                    errMessage:'missing requier param'
                })
            }else{
                let data = {}
                 data =await db.specialties.findOne({
                    where: {id: inputId},
                    attributes: ['descriptionHTML','descriptionMarkdown'],
                    raw:true
                })
                if(data){
                    let doctorInSpecialty = await db.Doctor_info.findAll({
                        where:{specialtyId: inputId},
                        attributes: ['doctorId'],
                        raw:true
                        

                    })
                    data.doctorInSpecialty = doctorInSpecialty
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
    createSpeciatlyService:createSpeciatlyService,
    getAllSpecialtyService:getAllSpecialtyService,
    getDetailSpecialtyByIdService:getDetailSpecialtyByIdService
}