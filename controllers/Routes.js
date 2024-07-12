function add(server){
    server.get("/", function(req, resp){
        resp.render('index', {
            layout: "indexLayout",
            title: "MainPage"
        });
    });
}

module.exports.add = add;