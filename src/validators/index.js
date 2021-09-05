const param = (schema, id) => {
  return (req, res, next) => {
    console.log(`LHA:  ===> file: index.js ===> line 9 ===> req.params[id]`, req.params[id])
    const validatorResult = schema.validate({ param: req.params[id] });
    if (validatorResult.error)
      return res.status(400).json(validatorResult.error);
    else {
      if (!req.value) req.value = {};
      if (!req.value['params']) req.value.params = {};
      req.value.params = validatorResult.value;
      next();
    };
  }
}
const body = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);

    if (validatorResult.error)
    {
      console.log(req.body)
      return res.status(400).json(validatorResult.error.details);
    }
    else {
      if (!req.value) req.value = {};
      if (!req.value['body']) req.value.body = {};
      const obj=Object.assign(req.value.body,validatorResult.value);
      req.value.body=obj;
      next();
    }
  };
}


const bodySocket=((schema,data)=>{
  const validatorResult=schema.validate(data)
  if (validatorResult.error)
  {
    console.log(data)
    return {
      success:false,
      data:null,
      message:validatorResult.error.details
    }
  }
  else {
    return {
      success:true,
      data:validatorResult.value,
      message:"Successful validate data"
    }
  }
})
module.exports = {
  body,
  bodySocket,
  param
}