var express = require('express');
var router = express.Router();

var ctrlCompiler = require('../controllers/controllers.compiler.js');

router
	.route('/compilecode')
	.post(ctrlCompiler.compile);

router
	.route('/getOutputs')
	.get(ctrlCompiler.getOutputs)

router
	.route('/:participantId/:studyId')
	.get(ctrlCompiler.getInitialValues);
	
module.exports = router;
