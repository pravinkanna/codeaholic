
//Routes
exports.showIndex = (req, res) => {
    res.render('index', { title: "Welcome to Codeaholic" })
};

exports.showPlayground = (req, res) => {
    res.render('ide/index', { title: "Codeaholic Playground" })
};


