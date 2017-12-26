var express = require('express');
var router = express.Router();

Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');

router.get('/classes', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }
    Student.getStudentByUsername(req.user.username, (err, student) => {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.render('students/classes', { title: 'Express', student: student });
        }
    });
});

router.post('/classes/register', (req, res) => {
    if(!req.user){
        res.redirect('/');
    }
    info = [];
    info['student_username'] = req.user.username;
    info['class_id'] = req.body.class_id;
    info['class_title'] = req.body.class_title;

    Student.register(info, function(err, student){
        if(err) throw err;
        // console.log(student);
    });

    req.flash('succes', 'You are now registered');
    res.redirect('/students/classes');
})

module.exports = router;