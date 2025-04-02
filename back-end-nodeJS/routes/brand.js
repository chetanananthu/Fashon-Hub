const express=require('express');
const { route } = require('../app');
const router=express.Router();
const Brand=require('../models/brands');

router.get('',async(req,res,next)=>{
    try{
        const brand=await Brand.find();
        return res.status(200).json({
            message:"success",
            brand:brand
        })
    }
    catch(error){
        console.error(error);
    }
})


router.post('',async(req,res,next)=>{
    try{
        const brand=new Brand({
            name:req.body.name,
            description:req.body.description
        });
       await brand.save();
        return res.status(200).json({
            message:"Successfully Created"
        })
    }
    catch(error){
        return res.status(500).json({
            message:`Internal Server Error${error}`
        })
    }
})


router.get('/:id',async(req,res,next)=>{
    try{
        const brand=await Brand.findOne({_id:req.params.id});
        if(!brand){
            return res.status(404).json({
                message:"There is brand with given id"
            })
        }
        return res.status(200).json(brand);
    }
    catch(error){
        return res.status(500).json({
            message:`Internal Server Error${error}`
        })
    }
})

router.delete('/:id',async(req,res,next)=>{
    try{
        const brand=await Brand.findOne({_id:req.params.id});
        if(!brand){
            return res.status(404).json({
                message:"There is brand with given id"
            })
        }
        await Brand.deleteOne({_id:brand._id});
        return res.status(200).json({
            message:"Successfully Deleted"
        })
    }
    catch(error){
        return res.status(500).json({
            message:`Internal Server Error${error}`
        }) 
    }
})

router.put('/:id',async(req,res,next)=>{
        try{
            const brand=Brand.findOneAndUpdate(
                {_id:req.params.id},
                req.body,
                {new:true}
                );
            if(!brand)
                return res.status(404).json({message:"No brand found to update."})
            return res.status(200).json(brand);
        }
        catch(error){
            return res.status(500).json({message:`Internal Server Error ${error}`})
        }
})


module.exports=router;