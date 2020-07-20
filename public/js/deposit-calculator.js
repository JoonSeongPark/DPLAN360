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

  result = `
    ${depositDay.getFullYear()} 년
    ${depositDay.getMonth() + 1} 월
    ${depositDay.getDate()} 일
    `;

  return result;
}
