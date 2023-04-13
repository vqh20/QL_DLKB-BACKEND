import db from '../models/index'
import bcrypt  from 'bcrypt';

const saltRounds = 10;

let handleUserLogin = (email, password) =>{
    return new Promise(async(resolve, reject)=>{
        try {
            let userData ={};
            let isExist = await checkUserEmail(email)
            if(isExist){
                // ton tai user email trong data => find data user
                let user = await db.User.findOne({
                where: {email: email},
                // tra duoi dang object
                raw : true,
                attributes: ['id','email', 'password', 'roleId', 'firstName', 'lastName'] // cho phep lay email, password, roleId
               });
               if(user){
                    // check password
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errCode = 0;
                        userData.errMessage = "";
                        delete user.password;
                        userData.user = user
                    }else{
                        userData.errCode = 3;
                        userData.errMessage = "Kiểm tra lại mật khẩu";
                    }
               }else{
                    userData.errCode = 2,
                    userData.errMessage = 'user not found'
               }
            }else{
                //return error
                userData.errCode = 1;
                userData.errMessage= " Email không tồn tại"
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}
let checkUserEmail = (userEmail)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.User.findOne({
                where: {email : userEmail}
            })
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            let users = '';
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    // khong find password
                    attributes : {
                        exclude: ['password']
                    }
                    
                })
            }
            if(userId && userId !=='ALL'){
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes : {
                        exclude: ['password']
                    }
                     
                })               
            }
            resolve(users)            
        } catch (e) {
            reject(e)
        }
    })
}

// create user
let createNewUser = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            //check email ton tai???
            let check = await checkUserEmail(data.email)
            if(check ===true){
                resolve({
                    errCode: 1,
                    errMessage: "Email đã được sử dụng"
                });
            }else{
                const hashPasswordFrom = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFrom,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address : data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    image: data.image,
                    roleId: data.roleId,
                    positionId: data.positionId
                })
            resolve({
                errCode: 0,
                errMessage: "create ok"
            });
            }
            
            
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

// delete user
let deleteUser = (userId)=>{
    return new Promise(async(resolve, reject)=>{
        let user = await db.User.findOne({
            where: {id : userId},
            //raw: false // ??? (sua loi : user.destroy is not a function)
        })
        if(!user){
            resolve({
                errCode:2,
                errMessage: `user khong ton tai`
            })
        }

        await db.User.destroy({
            where: {id : userId}
        });

        resolve({
            errCode: 0,
            errMessage: 'delete ok'
        })
    })
}

// edit user Api
let updateUser = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try {
        //console.log('check data',data)
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode: 2,
                    errMessage: "khong nhan duoc id user"
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                // raw: true
                
            })
            if(user){
                user.email = data.email
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId,
                user.positionId = data.positionId,
                user.gender = data.gender,
                user.phonenumber = data.phonenumber
                if(data.image){
                    user.image = data.image
                }



                await user.save();
                // await db.User.save({
                //     where: {id : data.id}
                // });
                
                resolve({
                    errCode: 0,
                    errMessage: 'update ok'
                })
            }else{
                resolve({
                    errCode: 1,
                    errMessage: "user not found"
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

//
let getAllCodeService = (typeInput)=>{
    return new Promise(async(resolve, reject)=>{
        try {
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            }else{
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: {type : typeInput}
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res)
            }
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports={
    handleUserLogin:handleUserLogin,
    checkUserEmail:checkUserEmail,
    getAllUsers:getAllUsers,
    createNewUser:createNewUser,
    deleteUser:deleteUser,
    updateUser:updateUser,
    getAllCodeService:getAllCodeService
}