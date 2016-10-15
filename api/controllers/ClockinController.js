/**
 * ClockinController
 *
 * @description :: Server-side logic for managing clockins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var GeTui = require('getui-sdk/GT.push');
var Target = require('getui-sdk/getui/Target.js');
var TransmissionTemplate = require('getui-sdk/getui/template/TransmissionTemplate');
var SingleMessage = require('getui-sdk/getui/message/SingleMessage');

// http的域名
var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';
//定义常量, appId、appKey、masterSecret 采用本文档 "第二步 获取访问凭证 "中获得的应用配置
var APPID = 'nEZeAGn0gRAnONJEw39Sx';
var APPKEY = 'OTAJfza3cG8OXU1zGGjfB1';
var MASTERSECRET = 'RxK7jF6mIU8l248pphmPE8';

module.exports = {
  hello: function (req, res) {
    res.ok('hello world')
  },
  clockIn: function (req, tRes) {
    "use strict";
    let schoolName = req.body.schoolName
    let className = req.body.className
    let data = req.body.data
    console.log(schoolName + "_" + className)
    let gt = new GeTui(HOST, APPKEY, MASTERSECRET)
    // 定义"点击链接打开通知模板"，并设置透传内容，透传形式
    let template = new TransmissionTemplate({
      appId: APPID,
      appKey: APPKEY,
      transmissionType: 2,
      transmissionContent: {
        key: 'clockIn',
        data: data
      }
    });
    let message = new SingleMessage({
      isOffline: false,
      data: template,
      appIdList: [APPID]
    });
    let target = new Target({
      appId: APPID,
      alias: schoolName + '_' + className
    });
    gt.pushMessageToSingle(message, target, function (err, res) {
      if (err != null) {
        if (err.exception != null && err.exception instanceof RequestError) { // 请求异常
          var requestId = err.exception.requestId;
          console.log(err.exception.requestId);
          //发送异常重传
          gt.pushMessageToSingle(message, target, requestId, function (err, res) {
            if (err) {
              tRes.serverError(err)
            }
            tRes.ok(res)
          });
        } else {
          tRes.serverError(err)
        }
      } else {
        tRes.ok(res)
      }
    })
  }
};

