const mongoose=require('mongoose');

const brandSchema=mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date}
})

const Brand=mongoose.model('Brand',brandSchema);

  
module.exports=Brand