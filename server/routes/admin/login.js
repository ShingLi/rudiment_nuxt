const express = require('express')
const Eslintrc = require('../../../admin/.eslintrc')
const router = express.Router()

let postData

const parsebody = (req) => {
	return new Promise((resolve, reject) => {
		postData = ''
		try {
			req.on('data', data => {
				postData += data
			})
			req.on('end', ()=> {
				postData = JSON.parse(postData)
				return resolve(postData)
			})
		} catch (error) {
			return reject(error)
		}
	})
}
module.exports = (app, { User }) => {
	
	router.post('/login', async(req, res) => {
		await parsebody(req)
		const info = {
			username: postData.username,
			password: postData.password
		}
		console.log('登录账号数据', postData)
		User.find(info, (err, doc) => {
			console.log('用户查询', doc)
			if (err) {
				res.json({
					responseCode: "9999",
					responseMsg: "查询错误"
				})
			} else{
				if (!doc.length) {
					res.json({
						responseCode: '9999',
						responseMsg: '账号不存在!'
					})
				} else {
					res.json({
						responseCode: '0000',
						responseMsg: '登录成功'
					})
				}
			}
		})
	})

	router.post('/signup', async(req, res) => {
		await parsebody(req)
		const len = await User.find().countDocuments()
		if (len) {
			res.send({
				responseCode: '9999',
				responseMsg: '请勿重复注册'
			})
		} else {
			User.create(postData, (err, doc) => {
				if (err) {
					console.log(err)
				}
				if (doc) {
					res.send({
						responseCode: '0000',
						responseMsg: '注册成功'
					})
				} else {
					res.send({
						responseCode: '9999',
						responseMsg: '注册失败'
					})
				}
			})
		}
	})
	app.use('/admin', router)
}