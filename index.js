const xlsxFile = require('read-excel-file/node');
const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');

async function obtenerDatos(cedula) {
    const contenido = await axios.get('http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula='+cedula);
    const $ = await cheerio.load(contenido.data);
    var data = await $('td[align="left"]')[1].children[0].data.replace('V-','') + '\t' + $('td[align="left"]')[3].children[0].children[0].data + '\t' + $('td[align="left"]')[5].children[0].data + '\t' + $('td[align="left"]')[7].children[0].data + '\t' + $('td[align="left"]')[9].children[0].data + '\t' + $('td[align="left"]')[11].children[0].children[0].data + '\t' + $('td[align="left"]')[13].children[0].children[0].data + '\n';

    fs.appendFileSync('./archivos/file.xlsx', data);

}

xlsxFile('./archivos/cedulasDataElectoral.xlsx').then(rows => {

    rows.forEach((col, index) => {
        var cedula = col[0];
        obtenerDatos(cedula);
        
    });

});