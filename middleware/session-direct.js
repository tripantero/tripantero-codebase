module.exports = (request, response, next) => {
    if(request.session.key) {
        response.redirect("/events")
    } else {
        next();
    }
}