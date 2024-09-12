const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    name : String,
    mobileNo : Number,
    street: String,
    city: String,
    state: String,
    zip: String,
    deliveryChanges : Number
});

const refferalSchema = new mongoose.Schema({
    refferalcode: String,
    refferredbycode: String,
    myrefferals: [
        {
            userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
            name:{type:String}
            // order_id: { type:mongoose.Schema.Types.ObjectId, ref: 'Order' },
        }
    ],
    myrefferalorders:[
        {
            userId:{type:mongoose.Schema.Types.ObjectId, ref: 'user'},
            order_id: { type:mongoose.Schema.Types.ObjectId, ref: 'Order' },
        }
        

    ]
   
},{_id:false});

const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    mobileNo: Number,
    address: [addressSchema],
    password : String,
    profilePic : String,
    role : String,
    refferal:refferalSchema
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel