const express = require('express');
const { identity, result } = require('lodash');
const router = express.Router();
const request = require('request')
const {requireSignin } = require('../controllers/auth');
const Address = require('../models/address');


router.route("/address_rsp/:id").get((req,res)=>{
    Address.findById(req.params.id)
        .then(address=>res.json(address))
        .catch(err=>res.status(400).json('Error: ' + err));
})


router.post('/verifyAddress', requireSignin, (req, res) => {
    Address.findOne({ userID: req.auth._id }).exec((err, address) => {

        const {auth_id, auth_token, address_url, street, city, state, zipcode } = req.body;
        if(auth_id ==null || auth_token ==null || address_url ==null)
            return res.status(500).json({
                message:"couldn't get security info"
            });
        
        let params = {
            'auth-id':auth_id, 
            'auth-token':auth_token,
            street: street,
            city: city, 
            state: state, 
            zipcode: zipcode
        }

        let status = "pending";
        let newAddress = {userId: req.auth._id, status }
        request({url:address_url, qs:params}, function(err, response, body) {
            if(err) { 
                newAddress.status= "Error";
            }
            if(response.statusCode ==200){
                let result = JSON.parse(response.body);
                if(result.length!=1){
                    newAddress.status = "Need More Info";
                }
                newAddress.status = "Verified";
                newAddress['primary_number'] = result[0].components.primary_number;
                newAddress['street_name'] = result[0].components.street_name;
                newAddress['street_suffix'] = result[0].components.street_suffix;
                newAddress['city_name'] = result[0].components.city_name;
                newAddress['state_abbreviation'] = result[0].components.zipcode;
                newAddress['zipcode'] = result[0].components.zipcode;
            }
            let add = null;
            if(address){
                add = address;
                add.primary_number = newAddress.primary_number;
                add.street_name = newAddress.street_name;
                add.street_suffix = newAddress.street_suffix;
                add.city_name = newAddress.city_name;
                add.state_abbreviation = newAddress.state_abbreviation;
                add.zipcode = newAddress.zipcode;
            }
            else{
                add= new Address(newAddress);
            }
            add.save((err, success)=>{
                if(err){
                    return res.status(400).json({
                        error:err
                    })
                }
                res.status(201).location(`http://${process.env.CLIENT_URL}:${process.env.Port}/api/address_rsp/${add._id}`).json();
            })
          });
    })
})



module.exports = router;