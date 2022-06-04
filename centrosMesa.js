const xlsxFile = require('read-excel-file/node');
const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');
const { text } = require('cheerio/lib/api/manipulation');

async function obtenerListadoCM(codigo) {

    const url = `http://www.cne.gob.ve/web/registro_electoral/listado_mm.php?e=14&m=7&p=10&c=${codigo}`;

    const contenido = await axios.get(url);

    const $ = await cheerio.load(contenido.data, null, false);

    var cantidadDeDatos = await $('.tabla_listados_mm_mj tbody tr').length;
    
    var mesa = 0;
    
    for (let index = 0; index < cantidadDeDatos*3; index = index +3) {

        var cedula = $(`.tabla_listados_mm_mj tbody tr td:eq(${index})`).text().trim();
        var nombre = $(`.tabla_listados_mm_mj tbody tr td:eq(${index+1})`).text().trim();
        var centro = $(`.tabla_listados_mm_mj tbody tr td:eq(${index+2})`).text().trim();

        if(cedula == "CÉDULA") {
            mesa++;
        }

        var data =  cedula + '\t' + nombre + '\t' + centro + '\t' + codigo + '\t' + mesa + '\n';

        fs.appendFileSync('./archivos/data_electoral_centros_mesa.xlsx', data);

    }
}


xlsxFile('./archivos/CodigosCentrosMonagas.xlsx').then(rows => {

    rows.forEach((col, index) => {
        var codigo = col[3];
        obtenerListadoCM(codigo);
    });

});