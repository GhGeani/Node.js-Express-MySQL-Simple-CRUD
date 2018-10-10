const crudOptions             = {};
const path                    = require('path');
const fs                      = require('fs');


crudOptions.list              = function(req, res){
    req.getConnection(function(err, conn){
        conn.query('SELECT * FROM people' , function(err, peoples){
            if(err) throw err;
            console.log('SQL code for listing executed.');

            //console.log(peoples);
            res.render('list', {title: 'List', data: peoples});
        });
    });
};

crudOptions.show_add_page     = function(req, res) {
    res.render('add', {title: 'Add a new person',
                        email:          '',
                        first_name:     '',
                        second_name:    '',
                        bio:            '',
                        });
}

crudOptions.save              = function(req , res){
    
        // Validations
            if(req.body.first_name == ''){
                req.checkBody('first_name')
                     .notEmpty().withMessage('First name field is required.');
            }else {
                //console.log(req.body.first_name);
                req.checkBody('first_name')
                     .trim().isLength({min: 3}).withMessage('First name is too short.');
                req.checkBody('first_name')
                     .trim().isAlpha().withMessage('First name field must contain only a-z and A-Z caracters.');
            }

            if(req.body.second_name == ''){
                req.checkBody('second_name')
                     .notEmpty().withMessage('Second name field is required.');
            }else {
                //console.log(req.body.second_name);
                req.checkBody('second_name')
                     .trim().isLength({min: 3}).withMessage('Second name is too short.');
                req.checkBody('second_name')
                     .trim().isAlpha().withMessage('Second name field must contain only a-z and A-Z caracters.');
            }
           
            req.checkBody('email',          'Valid email is required.')        .isEmail().trim().escape();
            req.checkBody('bio',            'Description field is required.')  .notEmpty().trim();
            
            
            // Image Validation
                const filetype = /gif|jpg|png|jpeg/;
                var imgValid = true;
                if(req.file != undefined ){
                    const extname  = filetype.test(path.extname(req.file.originalname).toLowerCase());
                    const mimetype = filetype.test (req.file.mimetype);
                    const maxSize  = 2048000;
                    if(mimetype && extname){
                        
                        if(req.file.size < maxSize){
                            console.log('Img loaded! Yayy.');
                        } else{
                            req.assert('image','The file is too large.').notEmpty();
                            imgValid = false;
                        }
                    } else {
                        req.assert('image','File must be an image.').notEmpty();
                        imgValid = false;
                    }
                } else {
                    req.assert('image','Photo file is required.').notEmpty();
                    imgValid = false;
                }

                var errors = req.validationErrors();
                req.getConnection(function (err, conn) { 
                    conn.query('SELECT * FROM people WHERE email= ?', req.body.email, function (err, result) { 
                        if (err){
                            req.flash('error', err);
                        } 
                        if(result.length == 0){
                            if(!errors  && imgValid){
                                var person = {
                                    email:          req.sanitize('email').escape(),
                                    first_name:     req.sanitize('first_name').escape(),
                                    second_name:    req.sanitize('second_name').escape(),
                                    bio:            req.sanitize('bio').escape(),
                                    photo:          req.file,
                                    photo_name:     req.file.filename
                                };
                                
                            req.getConnection(function(err, conn){
                                if(err) throw err;
                                conn.query("INSERT INTO people set ?", person, function(err, person){
                                    if (err) {
                                        req.flash('error', err);
                                        res.render('add', {title:       'Add a new person',
                                                        email:       req.body.email,
                                                        first_name:  req.body.first_name,
                                                        second_name: req.body.second_name,
                                                        bio:         req.body.bio,
                                                        });
                                    } else{
                                        console.log('1 person added.');
                                        res.redirect('/list');
                                    }
                                
                            });
                        });
                    }else{
                        //console.log('SUNT ERORI BA');
                          var errorArray = '';
                    
                         for(var i = 0; i < errors.length; i++){
                             errorArray += errors[i].msg + '<br>';
                         };
                    
                         req.flash('error', errorArray);
                         //console.log(errorArray);  
                         //console.log(errors);
                         res.render('add', {
                             title:         'Add a new person',
                             email:         req.body.email,
                             first_name:    req.body.first_name,
                             second_name:   req.body.second_name,
                             bio:           req.body.bio,
                         });
                    }
                        } else {
                            req.flash('error', `Email ${req.body.email} is already used by another person.`);
                            res.render('add', {
                                title:         'Add a new person',
                                email:         req.body.email,
                                first_name:    req.body.first_name,
                                second_name:   req.body.second_name,
                                bio:           req.body.bio,
                            });
                        }
                     });
                 });
        console.log('Valid image-> ' + imgValid);
        console.log('Invalid fields-> '); console.log(errors);
};

crudOptions.show_edit_page    = function(req , res){
    var  { id } = req.params;
    req.getConnection(function(err, conn){
        conn.query('SELECT * FROM people WHERE id = ?', [id], function(err, result){
            res.render('edit', {title:          'Edit a person', 
                                email:          result[0].email,
                                first_name:     result[0].first_name,
                                second_name:    result[0].second_name,
                                bio:            result[0].bio,
                                });
        });
    });
};

crudOptions.save_edit        = function(req, res){
    var person = req.body;
    var {id} = req.params;


    // Validations
    if(req.body.first_name == ''){
        req.checkBody('first_name')
             .notEmpty().withMessage('First name field is required.');
    }else {
        //console.log(req.body.first_name);
        req.checkBody('first_name')
             .trim().isLength({min: 3}).withMessage('First name is too short.');
        req.checkBody('first_name')
             .trim().isAlpha().withMessage('First name field must contain only a-z and A-Z caracters.');
    }

    if(req.body.second_name == ''){
        req.checkBody('second_name')
             .notEmpty().withMessage('Second name field is required.');
    }else {
        //console.log(req.body.second_name);
        req.checkBody('second_name')
             .trim().isLength({min: 3}).withMessage('Second name is too short.');
        req.checkBody('second_name')
             .trim().isAlpha().withMessage('Second name field must contain only a-z and A-Z caracters.');
    }

        req.assert('email',          'Valid email is required.')            .isEmail().trim().escape();
        req.assert('bio',            'Description field is required.')      .notEmpty().trim();

            // Image Validation
                const filetype = /gif|jpg|png|jpeg/;
                var imgValid = true;
                if(req.file != undefined ){
                    const extname  = filetype.test(path.extname(req.file.originalname).toLowerCase());
                    const mimetype = filetype.test (req.file.mimetype);
                    const maxSize  = 2048000;
                    if(mimetype && extname){
                        if(req.file.size < maxSize){
                            console.log('Img loaded! Yayy.');
                        } else{
                            req.assert('image','The file is too large').notEmpty();
                            imgValid = false;
                        }
                    } else {
                        req.assert('image','File must be an image').notEmpty();
                        imgValid = false;
                    }
                } else {
                    req.assert('image','Photo file is required.').notEmpty();
                    imgValid = false;
                }

    var errors = req.validationErrors();
    req.getConnection(function (err, conn) { 
        if(err) throw err;
        conn.query('SELECT * FROM people WHERE email= ?', req.body.email, function(err, result){
            if(err){
                res.flash('error', err);
            }
            if(result.length == 1) {
                    if(!errors && imgValid){
                        var person = {
                            email:          req.sanitize('email'),
                            first_name:     req.sanitize('first_name'),
                            second_name:    req.sanitize('second_name'),
                            bio:            req.sanitize('bio'),
                            photo:          req.file,
                        };
                            person.photo_name = person.photo.filename;
                
                    req.getConnection(function(err, conn){
                        conn.query('UPDATE people SET ? WHERE id= ?', [person, id], function(err, result){
                            //if(err) throw err;
                            if(err){
                                req.flash('error', err);
                            }
                            console.log(`Person with id= ${id} was successifully updated!`)
                            res.redirect('/list');
                        });
                    });
                }else{
                    var errorArray = '';
                
                    for(var i = 0; i < errors.length; i++){
                        errorArray += errors[i].msg + '<br>';
                    };
                
                    req.flash('error', errorArray);
                    console.log(errorArray);  
                    //console.log(errors);
                    res.render('edit', {
                        title:         'Edit a person',
                        email:         req.body.email,
                        first_name:    req.body.first_name,
                        second_name:   req.body.second_name,
                        bio:           req.body.bio,
                    });
                
                }
            } else {
                req.flash('error', `Email ${req.body.email} is already used by another person.`);
                            res.render('add', {
                                title:         'Add a new person',
                                email:         req.body.email,
                                first_name:    req.body.first_name,
                                second_name:   req.body.second_name,
                                bio:           req.body.bio,
                            });
            }
        });
     });
};

crudOptions.delete          = function(req, res){
    var { id } = req.params;
    req.getConnection(function(err, conn){
        // Unlink profile image
        conn.query('SELECT * FROM people WHERE id= ?', [id], function (err, result) { 
            if (err) throw err;
            fs.unlink(path.join(__dirname, '../public/uploads') + `/${result[0].first_name}-${result[0].email}`, function(err){
                if(err){
                    console.log(err);
                }
            });
        });
        // Delete de profile
        conn.query('DELETE FROM people WHERE id= ?', [id], function(err, result) { 
            if(err){
                console.log(err);
                return;
            }
        });
         console.log(`Person with id= ${id} deleted.`);
            res.redirect('/list');
    });
};

 

module.exports      = crudOptions;