const userSchema = {
    first_name: String,
    last_name: String,
    email: String,
    email_confirmed: Boolean,
    password: String,
    pic: String,
    twitter: String,
    born_date: String,
    idcategory: Number,
    iddescription: Number,
    idrole: Number,
}

module.exports = userSchema;