const db = require("../../db/connection");

function convertTimestampToDate({ created_at, ...otherProperties }){
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
}


function linkedID(parent_table, child_table, parentKey,childKey,childNewKey) {
  return child_table.map((row) => {
    const result = { ...row };
    parent_table.forEach((row) => {
      if (row[parentKey] === result[childKey]) {
        const id = row[childNewKey];
        delete result[childKey];
        result[childNewKey] = id;
      }
    });
    return result;
  });
}

module.exports = {convertTimestampToDate,linkedID};