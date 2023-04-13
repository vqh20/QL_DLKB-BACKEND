import db from '../models/index'
import userService from '../services/userService'


let handleLogin = async(req, res)=>{
    // lay email password input
    let email = req.body.email;
    let password = req.body.password
    // check email , password
    if(!email || !password){
        return res.status(500).json({
            errCode: 1,
            message: 'Nhập tên đăng nhập và mật khẩu'
        })
    }
    let userData = await userService.handleUserLogin(email, password) 
    // return user info
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

// api get all user
let handleGetAllUsers = async(req, res)=>{
    let id = req.query.id;
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Không tìm được id',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users
    })
}
// api create user
let handlCreateUsers = async(req, res)=>{
    //console.log(req.body)
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message);
}

// api edit user
let handlEditUsers = async(req, res)=>{
    let data = req.body;
    let message = await userService.updateUser(data)
    return res.status(200).json(message)
}

//api delete user
let handlDeleteUsers = async(req, res)=>{
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'khong nhan duoc id user'
        })
    }
    //console.log(req.body.id)
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message)
}

let getAllCode = async(req, res)=>{
    try {
        setTimeout(async() => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data)
        }, 2000);
        
    } catch (e) {
        console.log('get all code:' ,e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports ={
    handleLogin:handleLogin,
    handleGetAllUsers:handleGetAllUsers,
    handlCreateUsers:handlCreateUsers,
    handlEditUsers:handlEditUsers,
    handlDeleteUsers:handlDeleteUsers,
    getAllCode:getAllCode
}