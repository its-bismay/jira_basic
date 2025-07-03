import Joi from "joi";

export const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(10).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
});

const {error} = schema.validate(req.body);

if(error) {
    return res.status(400).json({
        message: "Bad request", error
    }) 
}

next();

}

export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
});

const {error} = schema.validate(req.body);

if(error) {
    return res.status(400).json({
        message: "Bad request", error
    }) 
}

next();

}