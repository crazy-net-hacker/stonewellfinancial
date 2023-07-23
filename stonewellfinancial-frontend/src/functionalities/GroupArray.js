// Group
export const groupBy = (array, keys, variable) => {  
    var i, key, temp, split;
    var data = array.reduce((result,currentValue) => {
        key = "";
        for(i = 0; i < keys.length; i++) {
            key = key + currentValue[keys[i]] + "_";
        }
        if(!result[key]) {
            result[key] = 0;
        }
        // result[key] += parseFloat(currentValue[variable]);
        result[key] = currentValue[variable];
        return result;
    }, {});
    var grouped = [];
    Object.keys(data).forEach(function(key) {
        temp = {};
        split = key.split("_");
        for(i=0; i < split.length - 1; i++) {
            temp[keys[i]] = split[i]
        }
        temp[variable] = data[key];
        grouped.push(temp);
    });
    return grouped;
}

  