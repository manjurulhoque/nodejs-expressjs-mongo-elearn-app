var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

router.get('/classes', function(req, res) {
    if(!req.user){
        res.redirect('/');
    }
    Instructor.getInstructorByUsername(req.user.username, (err, instructor) => {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.render('instructors/classes', { title: 'Express', instructor: instructor });
        }
    });
});

router.post('/classes/register', (req, res) => {
    if(!req.user){
        res.redirect('/');
    }
    info = [];
    info['instructor_username'] = req.user.username;
    info['class_id'] = req.body.class_id;
    info['class_title'] = req.body.class_title;

    Instructor.register(info, function(err, instructor){
        if(err) throw err;
        console.log(instructor);
    });

    req.flash('succes', 'You are now registered to teach this class');
    res.redirect('/instructors/classes');
})

module.exports = router;