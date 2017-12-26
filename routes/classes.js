var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');

router.get('/', function (req, res) {
    Class.getClasses((err, classes) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.render('classes/index', { title: 'Express', classes: classes });
        }
    });
});

router.get('/:id/details', function (req, res) {
    if(req.user){
        res.locals.usertype  = req.user.type;
    }
    else
    {
        res.locals.usertype  = null;
    }
    Class.getClassById([req.params.id], function (err, classname) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.render('classes/details', { title: 'Express', "classname": classname });
        }
    });
});

router.get('/:id/lessons/new', function (req, res) {
    if (!req.user) {
        res.redirect('/');
    }
    res.render('lessons/create', { title: 'Express', id: req.params.id });
});

router.post('/:id/lesson/save', function (req, res) {
    var info = [];

    info['class_id'] = req.params.id;
    info['lesson_number'] = req.body.number;
    info['lesson_title'] = req.body.title;
    info['lesson_body'] = req.body.body;

    Class.addLesson(info, function (err, lesson) {
        console.log('Lesson Added');
    });

    req.flash('succes', 'Lesson Added');
    res.redirect('/instructors/classes');
    res.render('lessons/create', { title: 'Express' });
});

router.get('/create', function (req, res) {
    if (!req.user) {
        res.redirect('/');
    }
    res.render('classes/create', { title: 'Express', id: req.params.id });
});

router.post('/save', function (req, res) {
    if (!req.user) {
        res.redirect('/');
    }
    res.locals.user = req.user || null;
    var newClass = Class({
        title: req.body.title,
        description: req.body.description,
        instructor: req.user.username
    });

    // save the user
    newClass.save(function (err) {
        if (err) throw err;

        console.log('class created!');
    });

    // save class with instructor
    info = [];
    info['instructor_username'] = req.user.username;
    info['class_id'] = newClass._id;
    info['class_title'] = req.body.title;

    Instructor.register(info, function (err, instructor) {
        if (err) throw err;
        console.log(instructor);
    });

    res.redirect('/instructors/classes');
});

module.exports = router;