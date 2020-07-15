// table total calculate
sumTotal();
function sumTotal() {
  const resultTable = document.getElementById("result-table");
  const totalRow = resultTable.rows[2];

  const adTotalCell = totalRow.cells[7];
  const agencyTotalCell = totalRow.cells[8];
  const mediaTotalCell = totalRow.cells[9];
  const dplanTotalCell = totalRow.cells[10];
  const interTotalCell = totalRow.cells[11];

  let agencySum = 0,
    mediaSum = 0,
    dplanSum = 0,
    interSum = 0;

  for (let i = 3; i < resultTable.rows.length; i++) {
    // Total 계산
    agencySum += +resultTable.rows[i].cells[8].innerHTML;
    mediaSum += +resultTable.rows[i].cells[9].innerHTML;
    dplanSum += +resultTable.rows[i].cells[10].innerHTML;
    interSum += +resultTable.rows[i].cells[11].innerHTML;
    resultTable.rows[i].cells[7].innerHTML = nf(
      +resultTable.rows[i].cells[7].innerHTML
    );
    resultTable.rows[i].cells[8].innerHTML = nf(
      +resultTable.rows[i].cells[8].innerHTML
    );
    resultTable.rows[i].cells[9].innerHTML = nf(
      +resultTable.rows[i].cells[9].innerHTML
    );
    resultTable.rows[i].cells[10].innerHTML = nf(
      +resultTable.rows[i].cells[10].innerHTML
    );
    resultTable.rows[i].cells[11].innerHTML = nf(
      +resultTable.rows[i].cells[11].innerHTML
    );

    // 입금일 계산
    // 대행사
    const agencyIssue = new Date(resultTable.rows[i].cells[19].innerHTML);
    const agencyLoan = resultTable.rows[i].cells[14].innerHTML;

    resultTable.rows[i].cells[15].innerHTML = depositCalculator(
      agencyIssue,
      agencyLoan
    );

    // 매체
    const mediaIssue = new Date(resultTable.rows[i].cells[20].innerHTML);
    const mediaLoan = resultTable.rows[i].cells[17].innerHTML;

    resultTable.rows[i].cells[18].innerHTML = depositCalculator(
      mediaIssue,
      mediaLoan
    );
  }

  adTotalCell.innerHTML = nf(agencySum + mediaSum + dplanSum + interSum);
  agencyTotalCell.innerHTML = nf(agencySum);
  mediaTotalCell.innerHTML = nf(mediaSum);
  dplanTotalCell.innerHTML = nf(dplanSum);
  interTotalCell.innerHTML = nf(interSum);
}

/////////////////////////////////////////////////////////////////////////

// excel download

const excelDownloadEl = document.getElementById("excel-download");
const file_name = "sample";

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
