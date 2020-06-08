module.exports = {


    //Ensure Student Auth
    ensureAuthenticatedStudent: function (req, res, next) {
        if (req.isAuthenticated() && req.user.type === 'student') {
            next()
        } else {
            req.flash('error_msg', "Please Login to continue")
            res.redirect('/students/signin')
        }
    },

    //Ensure Staff Auth
    ensureAuthenticatedStaff: function (req, res, next) {
        if (req.isAuthenticated() && req.user.type === 'staff') {
            next()
        } else {
            req.flash('error_msg', "Please Login to continue")
            res.redirect('/staffs/signin')
        }
    },

    //Ensure Admin Auth
    ensureAuthenticatedAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.type === 'admin') {
            next()
        } else {
            req.flash('error_msg', "Please Login to continue")
            res.redirect('/admin/signin')
        }
    }
}