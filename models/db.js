var mongoose = require('mongoose');
var url ="mongodb://localhost/biot"
mongoose.connect(url,function(err,result)
{
    if (err)
        {
            return ("NOT DONE"+err)
        }
    console.log("Database connection :) ");
})