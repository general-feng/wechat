// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  const results = await db.collection('memory').where({
    openid: event.openid
  }).get();
  return results.data;
}