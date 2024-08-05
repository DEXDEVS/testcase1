const processProductTypesString = (str) => {
  const regex = /[\u0590-\u05FF]*\d+/g;
  const match = str.match(regex);
  let typeID = '';
  let type = str;
  if (match) {
    typeID = match[0].trim();
    type = str.replace(typeID, '').trim();
    const typeRegex = /^(?:\u05E0\d+|\d+\u05E0)$/;
    if(!typeRegex.test(typeID)){
      typeID= ''
    }
    const typeNameRegex = /^[\u0590-\u05FF\s]+$/;
    if(!typeNameRegex.test(type)){
      type = '';
    }
  }
  return { name: type, typeID };
};
module.exports = {processProductTypesString}