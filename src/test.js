db.createCollection("nonfiction",{
    validator:{
        $jsonSchema:{
            required:['name','price'],
            properties:{
                name:{
                    bsonType:'string',
                    description:'must be a string and is required'
                },
                price:{
                    bsonType : 'number',
                    description : 'must be a number and is required'
                }
                }
            }
        },
    validationAction : 'error',
})