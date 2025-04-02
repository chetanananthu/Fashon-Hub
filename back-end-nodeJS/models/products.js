const express=require('express');
const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    stockQuantity:{type:String,required:true},
    image:{type:String},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'Catergories',required:true},
    brandId:{type:mongoose.Schema.Types.ObjectId,ref:'Brand',required:true},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date}
})


const Product=mongoose.model('Product',productSchema);

module.exports=Product;