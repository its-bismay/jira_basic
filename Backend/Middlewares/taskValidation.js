import Joi from "joi";

export const createTaskValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(1000).allow(""),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid("Low", "Med", "High").required(),
    assignees: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)) // MongoDB ObjectId validation
      .min(1)
      .required()
      .messages({
        "array.base": "Assignees must be an array of user IDs",
        "array.min": "At least one assignee is required",
        "string.pattern.base": "Each assignee must be a valid user ID",
      }),
    // status is optional, default handled in model/controller
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Bad request",
      error: error.details,
    });
  }

  next();
};
