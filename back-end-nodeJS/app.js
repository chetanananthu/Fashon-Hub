const express=require('express');
const mongoose=require('mongoose');
const brand=require('./routes/brand');
const catergoire=require('./routes/catrgorie');
const order=require('./routes/order');
const product=require('./routes/product');
const auth=require('./routes/auth');
const wishlist=require('./routes/wishlist');
const cart=require('./routes/cart')
const cors = require('cors');
const Razorpay=require("razorpay")

const app=express();

app.use(cors());

var instance=new Razorpay({
    key_id:"rzp_test_4PXSy7h5OYlui5",
    key_secret:"y4PZPTT6KEg3iGDYWrJUaz7v",
})


app.use(express.json());

app.post("/api/createPaymentOrder",(req,res)=>{
    var amount=utility.rupeesToPaise(req.body.payload.amount);
    var options={
        amount:amount,
        currency:"INR",
        receipt:"order_rcptid_11",
        notes:{
            key1:"value3",
            key2:"value2",
        },
    };
    instance.orders.create(options,function(err,order){
        if(err){
            res.status(500);
            let response={status:500,data:err};
            res.send(response);
        }
        else if(order){
            res.status(200);
            let response={status:200,data:order};
            res.send(response);
        }
    });
});

mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce')
.then(()=>console.log("Connected to Mongodb"))
.catch((err)=>{console.log(err)})




app.use('/api/brands',brand);
app.use('/api/categories',catergoire);
app.use('/api/orders',order);
app.use('/api/products',product);
app.use('/api/wishlist',wishlist);
app.use('/api/cart',cart);
app.use('',auth);

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


module.exports=app;

