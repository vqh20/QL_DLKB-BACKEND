// điều hướng page
// get data
import db from '../models/index'
import crudService from '../services/crudService';

let getHomePage = async (reg, res) => {
    try{
        let data = await db.User.findAll();
        
        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    }catch(e){
        console.log(e)
    }
   
}

let getAboutPage = (reg, res) =>{
    return res.render("about.ejs");
}

// form create
let getCRUD = (rep, res) => {
    return res.render('crud.ejs')
}

// create crud
let postCRUD = async (rep, res) => {
    // lay tham so tu cliet gui len server (ma hoa password : bcrypt)
    await crudService.createNewUser(rep.body)  
    return res.send('post crud')
}

let displayCRUD = async (req, res) => {
    let data = await crudService.getAllUser();
    
    return res.render('displayCRUD.ejs', {
        data: data
    })
}

// get user by Id
let editCRUD = async(req,res)=>{
    let userId = req.query.id
    if(userId){
        let userData = await crudService.getUserInforById(userId)
        // check userdata not found
        return res.render("editCRUD.ejs",{
            user: userData
        })

    }else{
        return res.send("user not found")
    }
    
}

// update user
let putCRUD = async(req,res)=>{
    //lay value input
    let data = req.body
    let allUser = await crudService.updateUserData(data)
    return res.render('displayCRUD.ejs', {
        data: allUser
    })
    
}

//delete
let deleteCRUD = async(req, res) =>{
    let id = req.query.id;
    if(id){
        let allUser = await crudService.deleteUserById(id);
        return res.render('displayCRUD.ejs',{
            data: allUser
        })
    }else{
        return res.send('xoa that bai')
    }
    
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD:displayCRUD,
    editCRUD:editCRUD,
    putCRUD:putCRUD,
    deleteCRUD:deleteCRUD

}