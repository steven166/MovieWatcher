
function validate(list, res, ...params){
  let missingParams = [];
  params.forEach(param => {
    if(!list[param]){
      missingParams.push(param);
    }
  });


  if(missingParams.length > 0){
    badRequest(res, "Missing " + missingParams + " query parameter(s)");
    return false;
  }
  return true;
}


function error(res, err){
  console.log(err);
  res.statusCode = 500;
  res.json({
    status: 500,
    error: "Internal Server Error",
    message: err
  });
}

function badRequest(res, err){
  res.statusCode = 400;
  res.json({
    status: 400,
    error: "Bad request",
    message: err
  });
  return false;
}

module.exports.validate = validate;
module.exports.error = error;
module.exports.badRequest = badRequest;