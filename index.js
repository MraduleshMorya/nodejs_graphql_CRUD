const { express_obj } = require("./app")

express_obj.listen(8000,()=>{
    console.log("Server Up and Running on http://192.168.50.67:8000");
    console.log("Listening for requests :-");
})
