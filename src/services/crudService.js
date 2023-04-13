// nhan data tu controller
import db from '../models/index'
import bcrypt  from 'bcrypt';

const saltRounds = 10;

let createNewUser = async (data)=>{
    return new Promise(async (resolve, reject) =>{
        try {
            const hashPasswordFrom = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFrom,
                firstName: data.firstName,
                lastName: data.lastName,
                address : data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === "1" ? true : false,
                //image: data.image,
                roleId: data.roleId,
            })
            resolve('ok create use');
        } catch (e) {
            reject(e)
        }
    })
}
let hashUserPassword = (password)=>{
    return new Promise( async (resolve, reject) =>{
        try{
            const hashPassword = await bcrypt.hashSync(password, saltRounds);
            const someOtherPlaintextPassword = 'not_bacon';
            resolve(hashPassword)
        }catch(e){
            reject(e)
        }
       
    })
}

let getAllUser = ()=>{
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true
            })
            resolve(users)
        } catch (e) {
            reject(e)
        }
    }) 
}
let getUserInforById=  (userId)=>{
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true
            })
            if(user){
                resolve(user)
            }else{
                resolve({})
            }
        } catch (e) {
            reject(e)          
        }
    })
}

// update user
let updateUserData = (data) => {
    return new Promise(async(resolve, reject) =>{
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUser = await db.User.findAll();
                resolve(allUser)
            }else{
                resolve();
            }
           
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUserById = (userId)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(user){
                await user.destroy();
                let allUser = await db.User.findAll();
                resolve(allUser);

            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports ={
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInforById:getUserInforById,
    updateUserData:updateUserData,
    deleteUserById:deleteUserById
}