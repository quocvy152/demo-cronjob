const MONGOOSE = require('mongoose');

const CUSTOMER_COLL = MONGOOSE.model('customer', { 
    email: String,
    fullname: String,
    phone: String,
    code: String, 
});

exports.CUSTOMER_COLL = CUSTOMER_COLL;