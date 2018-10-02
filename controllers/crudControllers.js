const crudOptions             = {};


crudOptions.list              = function(req , res){
    req.getConnection(function(err, conn){
        conn.query('SELECT * FROM people' , function(err, peoples){
            if(err) throw err;
            console.log('SQL code for listing executed.');
            //console.log(peoples);
            res.render('list', {title: 'List', data: peoples, });
            
        });
    });
};

crudOptions.show_add_page     = function(req, res) {
    res.render('add', {title: 'Add a new person',
                        email: '',
                        first_name: '',
                        second_name: '',
                        bio: ''
                        });
}

crudOptions.save              = function(req , res){
    
        // Validations
        req.checkBody('first_name',  'First name is required.')         .notEmpty().trim().isAlphanumeric();
        req.assert('second_name',    'Second name is required.')        .notEmpty().trim().isAlphanumeric();
        req.assert('email',          'Valid email is required.')        .isEmail().trim().escape();
        req.assert('bio',            'Description field is required.')  .notEmpty().trim();

        var errors = req.validationErrors();
        

        if(!errors){
            var person = {
                email:          req.sanitize('email'),
                first_name:     req.sanitize('first_name'),
                second_name:    req.sanitize('second_name'),
                bio:            req.sanitize('bio')
            };
        

    req.getConnection(function(err, conn){
        if(err) throw err;
        conn.query("INSERT INTO people set ?", person, function(err, person){
            if (err) {
                req.flash('error', err);
                res.render('add', {title: 'Add a new person'});
            } else{
                //console.log(req.body);
                req.flash('success', 'Person was added!');
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
     console.log(errorArray);  
     //console.log(errors);
     res.render('add', {
         title: 'Add a new person',
         email: req.body.email,
         first_name: req.body.first_name,
         second_name: req.body.second_name,
         bio: req.body.bio

     });
}
};

crudOptions.show_edit_page    = function(req , res){
    var  { id } = req.params;
    req.getConnection(function(err, conn){
        conn.query('SELECT * FROM people WHERE id = ?', [id], function(err, result){
            res.render('edit', {title: 'Edit a person', 
                                email:  result[0].email,
                                first_name:  result[0].first_name,
                                second_name:  result[0].second_name,
                                bio:  result[0].bio,
                                });
        });
    });
};

crudOptions.save_edit        = function(req, res){
    var person = req.body;
    var {id} = req.params;


    // Validations
    req.checkBody('first_name',   'Enter a valid first name.')          .notEmpty().trim().isAlphanumeric();
    req.assert('second_name',    'Enter a valid second name.')          .notEmpty().trim().isAlphanumeric();
    req.assert('email',          'Valid email is required.')            .isEmail().trim().escape();
    req.assert('bio',            'Description field is required.')      .notEmpty().trim();

    var errors = req.validationErrors();

    if(!errors){
        var person = {
            email:          req.sanitize('email'),
            first_name:     req.sanitize('first_name'),
            second_name:    req.sanitize('second_name'),
            bio:            req.sanitize('bio')
        };


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
         title: 'Edit a person',
         email: req.body.email,
         first_name: req.body.first_name,
         second_name: req.body.second_name,
         bio: req.body.bio
     });

}

};

crudOptions.delete          = function(req, res){
    var { id } = req.params;
    req.getConnection(function(err, conn){
        conn.query('DELETE FROM people WHERE id= ?', [id], function(err, result) { 
            if(err){
                console.log(err);
                return;
            }
            console.log(`Person with id= ${id} deleted.`);
            res.redirect('/list');
         });
    });
};

 

module.exports      = crudOptions;