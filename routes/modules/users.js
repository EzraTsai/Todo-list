const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const { findOne } = require('../../models/user')
// 引用 passport
const passport = require('passport')
const bcrypt = require('bcryptjs')
router.get('/login', (req, res) => {
    res.render('login')
})

// 加入 middleware，驗證 reqest 登入狀態
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    // 取得註冊表單參數
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
        errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
        return res.render('register', {
            errors,
            name,
            email,
            password,
            confirmPassword
        })
    }
    // 檢查使用者是否已經註冊
    User.findOne({ email }).then(user => {
        // 如果已經註冊：退回原本畫面
        if (user) {
            errors.push({ message: '這個Email已經註冊過了。' })
            return res.render('register', {
                errors,
                name,
                email,
                password,
                confirmPassword
            })
        }
        // 如果還沒註冊：寫入資料庫
        return bcrypt
            .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
            .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
            .then(hash => User.create({
                name,
                email,
                password: hash // 用雜湊值取代原本的使用者密碼
            }))
            .then(() => res.redirect('/'))
            .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login')
})

module.exports = router