const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;


var glossarySchema = new Schema({
	heading:{
		type: String,
		required: true
	},
	definition:{
		type:String,
		default:'Lorem Ipsum'
	},
	moreLink:{
		type:String,
		default:''
	},
	anchorLink:{
		type: String,
		required: true
	}
});

glossarySchema.methods.generateDefaultAnchor = function(){
	// default anchors use g to preserve legacy inbound links
	let h = this.heading;
	return 'g' + h.toLowerCase().replace(/ /g, '_'); 
};

var GlossaryTerm = mongoose.model('GlossaryTerm', glossarySchema);

module.exports = GlossaryTerm;