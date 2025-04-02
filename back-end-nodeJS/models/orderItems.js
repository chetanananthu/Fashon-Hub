const mongoose=require('mongoose');


const itemsSchema=mongoose.Schema({
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:'Order',required:true},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
    quantity:{type:Number},
    price:{type:Number}
})


const OrderItem=mongoose.model('OrderItems',itemsSchema);

module.exports=OrderItem;