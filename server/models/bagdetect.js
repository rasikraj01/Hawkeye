const mongoose = require('mongoose');

const bagDetectSchema = mongoose.Schema({
    screenshot_url : {
        type:String,
        required: true
    },
   number_of_bags:{
       type:String,
       required: true
   },
   date : {
      type: Date,
      default: Date.now,
      required: true,
   },
   camera_id : {
    type:String,
    required: true
    },
    location: {
        type: String,
        required: true
    }
});

const BagDetect = mongoose.model('bagDetect', bagDetectSchema);
module.exports = BagDetect;