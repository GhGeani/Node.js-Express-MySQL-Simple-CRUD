const router                = require('express').Router();
const crudOption            = require('../controllers/crudControllers');

var path    = require('path');
var multer  = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, callback){
        callback(null, req.body.first_name + '-' + req.body.email);
    },

});
var upload = multer({
    storage: storage,
});
 
router.get('/list',                                        crudOption.list);
router.get('/add',                                         crudOption.show_add_page);
router.post('/add',         upload.single('image'),        crudOption.save);
router.get('/edit/:id',                                    crudOption.show_edit_page);
router.post('/edit/:id',    upload.single('image'),        crudOption.save_edit);
router.get('/delete/:id',                                  crudOption.delete);

router.get('/', function (req, res) { res.redirect('/list') });


module.exports              = router;