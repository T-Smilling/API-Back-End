const Task=require("../models/task.model");

const paginationHelper=require("../../../helper/pagination.helper")
//[GET] api/v1/tasks/
module.exports.index= async (req,res) =>{
  const userId=res.locals.user.id;

  const find={
    $or:[
      {createdBy:userId},
      {listUser:userId}
    ],
    deleted:false
  };
  //Filter Status
  if(req.query.status){
    find.status=req.query.status;
  }
  //End Filter Status

  //Sort
  const sort={};
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey]=req.query.sortValue;
  }   
  //End Sort

  //Pagination
  const countTasks= await Task.countDocuments(find);

  let objectPagination=paginationHelper(req.query,countTasks);
  //End Pagination

  //Search
  if(req.query.keyword){
    const regex=new RegExp(req.query.keyword,"i");
    find.title=regex;
  }
  //End Search
  const tasks= await Task.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip);

  res.json(tasks);
}

//[GET] api/v1/tasks/detail/:id
module.exports.detail=async(req,res)=>{
  const taskId=req.params.id;
  const task=await Task.findOne({
    _id:taskId,
    deleted:false
  })
  res.json(task);
}

//[PATCH] api/v1/tasks/change-status/:id
module.exports.changeStatus=async(req,res)=>{
  try {
    const taskId=req.params.id;
    const status=req.body.status;
    await Task.updateOne({
      _id:taskId,
    },{
      status:status
    })
    res.json({
      code:200,
      massage:"Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    console.log(error);
    res.json({
      code:400,
      massage:"Cập nhật trạng thái thất bại!"
    });
  }
}
//[PATCH] api/v1/tasks/change-multi
module.exports.changeMulti=async(req,res)=>{
  try {
    const {ids,key,value}=req.body;
    switch (key) {
      case "status":
        await Task.updateMany({
          _id:{$in:ids}
        },{
          status:value
        });
        res.json({
          code:200,
          massage:"Cập nhật trạng thái thành công!"
        });
        break;
      case "delete":
        await Task.updateMany({
          _id:{$in:ids}
        },{
          deleted:true,
          deleteAt:new Date()
        });
        res.json({
          code:200,
          massage:"Cập nhật trạng thái thành công!"
        });
        break;
      default:
        res.json({
          code:400,
          massage:"Cập nhật trạng thái thất bại!"
        });
        break;
    }
  } catch (error) {
    res.json({
      code:400,
      massage:"Cập nhật trạng thái thất bại!"
    });
  }
}

//[PATCH] api/v1/tasks/delete/:id
module.exports.delete=async(req,res)=>{
  try {
    const taskId=req.params.id;
    await Task.updateOne({
      _id:taskId,
    },{
      deleted:true,
      deleteAt:new Date()
    })
    res.json({
      code:200,
      massage:"Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code:400,
      massage:"Cập nhật trạng thái thất bại!"
    });
  }
}

//[POST] api/v1/tasks/create/
module.exports.create=async(req,res)=>{
  try {
    req.body.createdBy=res.locals.user.id;
    const task=new Task(req.body);
    const data= await task.save();
    res.json({
      code:200,
      message:"Tạo mới thành công!",
      data:data
    });
  } catch (error) {
    res.json({
      code:400,
      message:"Tạo mới thất bại!",
    });
  }
}

//[PATCH] api/v1/tasks/edit/:id
module.exports.edit=async(req,res)=>{
  try {
    const taskId=req.params.id;
    const value=req.body;
    await Task.updateOne( {_id:taskId} ,req.body )
    res.json({
      code:200,
      massage:"Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code:400,
      massage:"Cập nhật thất bại!"
    });
  }
}