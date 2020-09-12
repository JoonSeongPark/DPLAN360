function autoDepositCalculator(e) {
  const targetRow = e.target.closest("tr");
  const beginDate = targetRow.cells[1].children[0].value;
  const endDate = targetRow.cells[2].children[0].value;

  if (e.target.name === "lower_issue_date") {
    const mediaIssueDate = e.target.value.split("-");

    if (!beginDate) return alert("시작일을 입력하세요.");
    if (!endDate) return alert("시작일을 입력하세요.");

    const mediaPayCondition = targetRow.cells[21].children[0].value;
    targetRow.cells[6].children[0].value = depositCalculator(
      beginDate,
      endDate,
      mediaIssueDate[0],
      mediaIssueDate[1],
      mediaPayCondition
    );
  }
  if (e.target.name === "lower_attribution_time") {
    const agencyIssueDate = e.target.value.split("-");

    if (!beginDate) return alert("시작일을 입력하세요.");
    if (!endDate) return alert("시작일을 입력하세요.");

    const agencyPayCondition = document.getElementById("agency-pay-condition")
      .value;
    if (!agencyPayCondition) return alert("대행사를 입력하세요");
    targetRow.cells[8].children[0].value = depositCalculator(
      beginDate,
      endDate,
      agencyIssueDate[0],
      agencyIssueDate[1],
      agencyPayCondition
    );
  }
}

function depositCalculator(begin, end, year, month, loan) {
  const lastDay = new Date(year, month, 0);

  loan = loan.replace(/\s/g, "");

  let depositDay;

  // 여신이 숫자인 경우 (월말에서 숫자만큼 날짜 추가)
  if (!isNaN(loan)) {
    const loanMS = +loan * 24 * 60 * 60 * 1000;

    depositDay = new Date(Date.parse(lastDay) + loanMS);
  } else {
    // case 받으면 추가하기
    switch (loan) {
      case "카드연결":
        return "";
      case "선입금":
        depositDay = new Date(Date.parse(begin) - 24 * 60 * 60 * 1000);
        break;
      case "종료월말":
        depositDay = new Date(end.getFullYear(), end.getMonth() + 1, 0);
        break;
      case "캠페인종료시입금":
        depositDay = end;
        break;
      case "종료전입금":
        depositDay = new Date(Date.parse(end) - 24 * 60 * 60 * 1000);
        break;
      default:
        loan = loan.replace(/\D/g, "");
        const loanMS = +loan * 24 * 60 * 60 * 1000;

        depositDay = new Date(Date.parse(lastDay) + loanMS);
    }
  }

  result = `${depositDay.getFullYear()}-${(
    "" +
    (depositDay.getMonth() + 1)
  ).padStart(2, "0")}-${("" + depositDay.getDate()).padStart(2, "0")}`;

  return result;
}
