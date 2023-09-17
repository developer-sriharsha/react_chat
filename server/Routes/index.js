const Router=require("express").Router()
const UserRoutes=require('./UserModule/UserRoutes')


//exporting Routes
Router.use(UserRoutes)

module.exports=Router