const errorObject = (value, msg, path, location) => {
  const object = {
    type: "field",
    value: value,
    msg: msg,
    path: path,
    location: location,
  };
  return object;
};

module.exports = errorObject;
