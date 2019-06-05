// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const results = await db.collection('memory').where({
    openid: event.openid,
    _id: event.id
  }).get();
  return results.data;
}