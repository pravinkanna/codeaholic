let express = require("express");
let router = express.Router();


//Controller
const indexController = require('../controllers/index')
const ideController = require('../controllers/ide')

/* GET home page. */
router.get("/", indexController.showIndex);

router.get("/playground", indexController.showPlayground);

router.post("/playground/run", ideController.run);

router.get("/playground/stop", ideController.stop);

module.exports = router;

