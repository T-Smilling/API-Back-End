const md5=require("md5");
const User=require("../models/user.model");
const ForgotPassword=require("../models/forgot-password.model");

const generateHelper=require("../../../helper/generate.helper");
const sendMailHelper=require("../../../helper/sendMail.helper")
//[POST] /api/v1/user/register/
module.exports.register= async (req,res) =>{
  const existEmail=await User.findOne({
    email:req.body.email,
    deleted:false
  });
  if(existEmail){
    res.json({
      code:400,
      message:"Email đã tồn tại!"
    });
  }
  else{
    req.body.password=md5(req.body.password);
    req.body.token=generateHelper.generateRandomString(30);
    const user=new User(req.body);
    const data = await user.save();
    res.json({
      code:200,
      message:"Tạo tài khoản thành công!",
      token:data.token
    });
  }
};

//[POST] /api/v1/user/login/
module.exports.login=async (req,res)=>{
  const email=req.body.email;
  const password=req.body.password;
  const user=await User.findOne({
    email:email,
    deleted:false
  });
  if(!user){
    res.json({
      code:400,
      message:"Email không tồn tại!"
    });
    return;
  }
  if(md5(password) != user.password){
    res.json({
      code:400,
      message:"Sai mật khẩu!"
    });
    return;
  }
  const token=user.token;
  res.json({
    code:200,
    message:"Đăng nhập thành công",
    token:token
  })
}

//[POST] /api/v1/user/password/forgot/
module.exports.forgotPassword=async(req,res)=>{
  const email=req.body.email;
  const existEmail=await User.findOne({
    email:email,
    deleted:false
  });
  if(!existEmail){
    res.json({
      code:400,
      message:"Email không tồn tại!"
    })
    return;
  }
  const otp=generateHelper.generateRandomNumber(8);
  //Việc 1: Lưu vào database
  const objectForgotPassword={
    email:email,
    otp:otp,
    expireAt: Date.now() + 5*60*1000
  };
  const forgotPassword= new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Việc 2: Gửi OTP qua email của user
  const subject=`Mã OTP lấy lại mật khẩu`;
  const content=`Mã OTP lấy lại mật khẩu là ${otp}. Vui lòng không chia sẻ cho bất kì ai mã OTP này.`;
  sendMailHelper.sendMail(email,subject,content);
  res.json({
    code:200,
    message:"Đã gửi mã OTP qua email!"
  });
};

//[POST] /api/v1/user/password/otp
module.exports.otp=async (req,res)=>{
  const email=req.body.email;
  const otp=req.body.otp;
  const result=await ForgotPassword.findOne({
    email:email,
    otp:otp
  });
  if(!result){
    res.json({
      code:400,
      message:"OTP không tồn tại!"
    });
    return;
  }
  const user=await User.findOne({
    email:email
  });
  res.json({
    code:200,
    message:"Xác thực thành công",
    token:user.token
  });
}

//[POST] /api/v1/user/password/reset
module.exports.resetPassword=async(req,res)=>{
  const token=req.body.token;
  const password=req.body.password;
  const user=await User.findOne({
    token:token,
    deleted:false
  });
  if(!user){
    res.json({
      code:400,
      message:"Tài khoản không tồn tại!"
    })
    return;
  }
  await User.updateOne({
    token:token
  },{
    password:md5(password)
  });
  res.json({
    code:200,
    message:"Đổi mật khẩu thành công!"
  });
}

//[GET] /api/v1/user/detail
module.exports.detail=async(req,res)=>{
  res.json({
    code:200,
    message:"Thành công!",
    info:res.locals.user
  });
}
//[GET] /api/v1/user/list
module.exports.list=async(req,res)=>{
  const users=await User.find({
    deleted:false
  }).select("id fullName email");

  res.json({
    code:200,
    message:"Thành công!",
    users:users
  });
}