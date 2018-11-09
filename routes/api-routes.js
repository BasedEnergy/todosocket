//Exporting our routes
module.exports = function(info){

    info.app.get('/api/data', function(req, res) {
        info.db.collection(info.COLLECTION).find({}).toArray(function(err, docs) {
            if (err) {
                console.log(res + '==>' + err.message, "Failed to get contacts.");
            } else {
                return res.send(docs);
            }
        });
    });

    info.app.post('/api/data', function(req, res) {
        if (!(req.body.item.label || req.body.item.checked)) {
            console.log(res, "Invalid user input", "Must provide a label and checked state.", 400);
        }

        info.db.collection(info.COLLECTION).insertOne(req.body.item, function(err, doc) {
            if (err) {
                console.log(res + '==>' + err.message, "Failed to create new item.");
            } else {
                return res.send(true);
            }
        });
    });

    info.app.delete('/api/data', function (req, res) {
        info.db.collection(info.COLLECTION).deleteOne({_id: new info.ObjectID(req.body._id)}, function(err, result) {
            if (err) {
                console.log(res + '==>' + err.message, "Failed to delete contact");
            } else {
                return res.send(true);
            }
        });
    });

    info.app.put('/api/data', function (req, res) {
        info.db.collection(info.COLLECTION).updateOne({_id: new info.ObjectID(req.body._id)}, {$set: {checked: req.body.checked}}, function(err, doc) {
            if (err) {
                console.log(res + '==>' + err.message, "Failed to update contact");
            } else {
                return res.send(true);
            }
        });
    });
};