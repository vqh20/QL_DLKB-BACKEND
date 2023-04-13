import express from "express"
import homeController from "../controllers/homeController";
import userController from "../controllers/userController"
import doctorController from '../controllers/doctorController';
import userPatientController from "../controllers/userPatientController"
import speciatlyController from "../controllers/speciatlyController";
import clinicController from "../controllers/ClinicController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    // creat
    router.post('/post-crud', homeController.postCRUD);
    // get all
    router.get('/get-crud', homeController.displayCRUD);
    // edit
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    //delete
    router.get('/delete-crud', homeController.deleteCRUD);
    
    // api
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-users', userController.handlCreateUsers);
    router.put('/api/edit-users', userController.handlEditUsers);
    router.delete('/api/delete-users', userController.handlDeleteUsers);
    
    router.get('/api/allcodes', userController.getAllCode);
    
// doctor
    router.get('/api/top-doctor', doctorController.getDoctorTop);

    router.get('/api/get-all-doctor', doctorController.getAllDoctors);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);

    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDdoctorById);

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);
    // done lich hen
    router.post('/api/done-appointment-patient', doctorController.doneAppointmentPatient);




    // get schedule doctor by date (page detail doctor)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    //  get other infomation doctor by id
    router.get('/api/get-other-infomation-doctor-by-id', doctorController.getOtherInfomationDoctorById);   
    // get profile doctor
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    
    
//patient 
    //tao tk cho nguoi dung
    router.post('/api/patient-book-appointment', userPatientController.postBookAppointment);

    router.post('/api/verify-book-appointment', userPatientController.postVerifyBookAppointment);

// specialty
    router.post('/api/create-new-speciatly', speciatlyController.createSpeciatly);
    router.get('/api/get-all-specialty', speciatlyController.getAllSpecialty);
    
    router.get('/api/get-detail-specialty-by-id', speciatlyController.getDetailSpecialtyById);
// clinic
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    return app.use("/", router)
}

module.exports = initWebRoutes;