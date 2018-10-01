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
    res.render('add', {title: 'Add a new person'});
}

crudOptions.save              = function(req , res){
    var person = {
        email:          req.body.email,
        first_name:     req.body.first_name,
        second_name:    req.body.second_name,
        bio:            req.body.bio
    };
    req.getConnection(function(err, conn){
        if(err) throw err;
        conn.query("INSERT INTO people set ?", person, function(err, person){
            if (err) {
                console.log(err);
                return;
            }
            console.log('1 person added.');
            res.redirect('/list');
        });
    });
};

crudOptions.show_edit_page    = function(req , res){
    var  { id } = req.params;
    req.getConnection(function(err, conn){
        conn.query('SELECT * FROM people WHERE id = ?', [id], function(err, result){
            res.render('edit', {title: 'Edit a person', data: result[0]});
        });
    });
};

crudOptions.save_edit        = function(req, res){
    var person = req.body;
    var {id} = req.params;
    req.getConnection(function(err, conn){
        conn.query('UPDATE people SET ? WHERE id= ?', [person, id], function(err, result){
            if(err) throw err;
            console.log(`Person with id= ${id} was successifully updated!`)
            res.redirect('/list');
        });
    });

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