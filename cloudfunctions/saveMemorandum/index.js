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
  if(event.method == 'add') {
    await db.collection('memory').add({
      data: {
        _id: event.id,
        openid: event.openid,
        evtType: event.evtType,
        title: event.title,
        area: event.area,
        time: event.time
      }
    })
  }
  if (event.method == 'update') {
    await db.collection('memory').where({
      _id: event.id
    })
    .update({
      data: {
        evtType: event.evtType,
      }
    })
  }
  if (event.method == 'delete') {
    await db.collection('memory').where({
      _id: event.id
    }).remove()
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}