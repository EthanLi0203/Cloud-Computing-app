const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
        max: 32,
        unique: true
    },
    status:{
        type :String, 
        trim: true,
        required: true,
        max: 32
    },
    primary_number: {
        type: String,
        trim: true,
        max: 32
    },
    street_name: {
        type: String,
        trim: true,
        max: 32
    },
    street_suffix: {
        type: String,
        trim: true,
        max: 32
    },
    city_name: {
        type: String,
        trim: true,
        max: 32
    },
    state_abbreviation:{
        type:String, 
        trim: true,
        max: 32
    },
    zipcode: {
        type: String,
        trim: true,
        max: 32
    }
}, { timestamp: true });


module.exports = mongoose.model('Address', addressSchema);