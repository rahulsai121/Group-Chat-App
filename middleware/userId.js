const User=require('../model/user')

const userIdForGroupMember = async (req, res, next) => {

    try {

        console.log(req.body.email)

        const email=req.body.email

        const findUser= await User.findOne({
            where:{
                email:email
            }
        })

        if(!findUser){

            return res.status(404).json({message:'User is not found'})
        }
        req.userId=findUser.dataValues.id

        next();
    } 
    catch (err) {
        console.log(err)
    }
}

module.exports=userIdForGroupMember