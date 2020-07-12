const tables = document.querySelectorAll("table");

const totalTable = tables[0];

// 팀별 값 합산
teamTotalSum();
function teamTotalSum() {
  for (let i = 3; i < totalTable.rows.length; i++) {
    let adTotal = 0,
      dplanTotal = 0;

    tables.forEach((table, idx) => {
      if (idx === 0) return;

      adTotal += +table.rows[i].cells[1].innerHTML;
      dplanTotal += +table.rows[i].cells[2].innerHTML;
    });

    if (adTotal !== 0) {
      totalTable.rows[i].cells[1].innerHTML = adTotal;
      totalTable.rows[i].cells[3].innerHTML = `${(
        (dplanTotal / adTotal) *
        100
      ).toFixed(2)} %`;
    }
    if (dplanTotal !== 0) {
      totalTable.rows[i].cells[2].innerHTML = dplanTotal;
    }
  }
}

// 월별 값 합산
monthTotalSum();
function monthTotalSum() {
  tables.forEach((table) => {
    let adTotal = 0,
      dplanTotal = 0;

    for (let i = 3; i < table.rows.length; i++) {
      adTotal += +table.rows[i].cells[1].innerHTML;
      dplanTotal += +table.rows[i].cells[2].innerHTML;

      if (+table.rows[i].cells[1].innerHTML !== 0) {
        table.rows[i].cells[1].innerHTML = nf(
          +table.rows[i].cells[1].innerHTML
        );
      }
      if (+table.rows[i].cells[2].innerHTML !== 0) {
        table.rows[i].cells[2].innerHTML = nf(
          +table.rows[i].cells[2].innerHTML
        );
      }
    }

    table.rows[2].cells[1].innerHTML = nf(adTotal);
    table.rows[2].cells[2].innerHTML = nf(dplanTotal);

    table.rows[2].cells[3].innerHTML =
      adTotal === 0 ? "0 %" : `${((dplanTotal / adTotal) * 100).toFixed(2)} %`;
  });
}
