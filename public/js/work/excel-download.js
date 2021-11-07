const excelDownloadEl = document.getElementById("excel-download");
const file_name = excelDownloadEl.getAttribute("name");

function excelDownload() {
  const resultTable = document.getElementById("result-table");
  const data_type = "data:application/vnd.ms-excel;charset=utf-8";
  const table_html = encodeURIComponent(resultTable.outerHTML);

  const aTag = document.createElement("a");
  aTag.href = `${data_type},%EF%BB%BF${table_html}`;
  aTag.download = `${file_name}.xls`;
  aTag.click();
}

excelDownloadEl.addEventListener("click", excelDownload);
