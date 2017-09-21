const mongoose = require('mongoose');
const bluebird = require('bluebird');
const Schema   = mongoose.Schema;
mongoose.Promise = bluebird;

var AcademySchema = new Schema({
	academyIntroText: {
		type: String,
		default:'Welcome to Academy by PatSnap'
	},
	academyNewsHeadline:{
		type: String,
		default: 'Latest News Headline'
	},
	academyNewsText: {
		type:String,
		default: 'Latest News Item'
	},
	academyHomeCta: {
		type:String,
		default: ''
	},
	academyTOS: {
		type: String,
		default: 'This website (including any enclosures and attachments) has been produced for your exclusive use, for educational purposes only. Patsnap (UK) Limited, its employees, partners or agents do not accept any liability if this website is used for an alternative purpose from which it is intended, nor to any third party in respect of this website. All information on this website is provided strictly on an "as is" basis, with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of the information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose. Under no circumstances, will Patsnap (UK) Limited, its employees, partners, or agents, be liable to you or any third party for any decision made or action taken in reliance on the information in this report or for any consequential, special or similar damages, even if advised of the possibility of such damages. Unless Patsnap (UK) Limited provides express prior written consent, no part of this website should be reproduced, distributed or communicated to any third party.'
	}
});

module.exports = mongoose.model('Academy', AcademySchema);