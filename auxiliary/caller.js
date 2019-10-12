const {readdirSync} = require('fs');

const caller = (path, restrict) => {
    readdirSync('./'+path).forEach((filename)=>{

        if(filename.indexOf('.js') == -1 || filename.replace('.js', '').indexOf(restrict) != -1){
            return;
        }
        filename = filename.replace('.js', '');
        require('../'+path+'/'+filename);
    })
}

module.exports = {};
module.exports.Caller = caller;