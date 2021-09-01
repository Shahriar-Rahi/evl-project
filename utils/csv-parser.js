const jtc = require('json2csv');
const fs = require('fs');

exports.downloadResource = (res, fileName, fields, data) => {
    const json2csv = new jtc.Parser({ fields });
    const csv = json2csv.parse(data);
    res.type('text/csv');
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    fs.writeFile(fileName, csv, (err)=>{
        if(err){
            console.log('Could not generate the leaderborad csv file');
        }
        else{
            console.log('Leaderboard csv file saved successfully!!!');
        }
    });
    return res.status(201).send(csv);
}