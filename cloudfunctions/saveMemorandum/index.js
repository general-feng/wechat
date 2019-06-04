// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if(!event.id){
    event.id = Date.now();
  }
  const wxContext = cloud.getWXContext();
  const db = cloud.database()
  await db.collection('memory').add({
    data:{
      _id: event.id,
      openid: event.openid,
      evtType: event.evtType,
      title: event.title,
      area: event.area
    }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}