const router                = require('express').Router();
const crudOption            = require('../controllers/crudControllers');
const bodyParser            = require('body-parser');


router.get('/list',         crudOption.list);
router.get('/add',          crudOption.show_add_page);
router.post('/add',         crudOption.save);
router.get('/edit/:id',     crudOption.show_edit_page);
router.post('/edit/:id',    crudOption.save_edit);
router.get('/delete/:id',   crudOption.delete);



module.exports              = router;