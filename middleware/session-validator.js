let directedUrl = [
    "/",
    "/register",
    "/login"
];

let restrictedUrl = [
    "/home",
    "/events"
]

module.exports = (request, response, next) => {
    if(request.session.key) {
        directedUrl.forEach((element)=> {
            if(request.path == element) {
                return response.redirect("/home")
            }
        })
        console.log("undefined path")
    } else {
        restrictedUrl.forEach((element)=> {
            if(request.path == element) {
                return response.redirect("/login")
            }
        })
        next();
    }
}