function sheet_to_workbook(sheet, opts) {
    var n = opts && opts.sheet ? opts.sheet : "Sheet1";
    var sheets = {};
    sheets[n] = sheet;
    return {SheetNames: [n], Sheets: sheets};
}

function aoa_to_workbook(data, opts) {
    return sheet_to_workbook(XLSX.utils.aoa_to_sheet(data, opts), opts);
}

// Todo: Xử lý set độ rộng của ữcel và style cho header
function saveExcel(fileName, dataExport) {
    XLSX.writeFile(aoa_to_workbook(dataExport), fileName);
}

function baseExportFile(data, configFile, arrsTitles, fileName='DanhSachSanPham') {
    let jsonXLSX = []
    let keyIndex = []
    for (let key in configFile){
        if (arrsTitles.includes(configFile[key])){
            keyIndex.push({
                index:arrsTitles.indexOf(configFile[key]),
                key:key
            })
        }
    }
    jsonXLSX.push(arrsTitles)
    data.forEach((item, index)=>{
        item.index = index+1
        let arrs = []
        arrsTitles.forEach(titles=>{
            arrs.push('')
        })
        keyIndex.forEach(item2=>{
            arrs[item2.index]=item[item2.key]
        })
        jsonXLSX.push(arrs)
    })
    saveExcel(`${fileName}-${moment(new Date()).format("HH:mm DD/MM/YYYY")}.xlsx`, jsonXLSX)
}

