const Joi = require("joi");

const validateClockInRequest = (body) => {
  const schema = Joi.object({
    key: Joi.string().valid("FingerPrint", "RFID").required(),
    method: Joi.string().required(),
  });

  const { error } = schema.validate(body);
  return error ? error.details[0].message : null;
};

module.exports = { validateClockInRequest };