module.exports = (query,countTasks) => {
  let objectPagination={
    currentPage:1,
    limitItem:countTasks
  };
  if(isNaN(query.page) === false){
    objectPagination.currentPage=parseInt(query.page);
  }
  if(isNaN(query.limit) === false){
    objectPagination.limitItem=parseInt(query.limit);
  }
  objectPagination.skip=(objectPagination.currentPage-1)*objectPagination.limitItem;

  const totalPage=Math.ceil(countTasks/objectPagination.limitItem);
  objectPagination.totalPage=totalPage;

  if(objectPagination.currentPage > 1 && (objectPagination.currentPage <= objectPagination.totalPage-2)){
    objectPagination.pageStart=objectPagination.currentPage-1;
    objectPagination.pageEnd=objectPagination.currentPage+1;
  } 
  else if(objectPagination.currentPage === 1){
    objectPagination.pageStart=1;
    objectPagination.pageEnd=3;
  }
  else if(objectPagination.currentPage > objectPagination.totalPage-2){
    objectPagination.pageStart=objectPagination.totalPage-2;
    objectPagination.pageEnd=objectPagination.totalPage;
  }
  return objectPagination;
}