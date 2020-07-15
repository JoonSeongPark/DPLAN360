function depositCalculator(issue, loan) {
  const year = issue.getFullYear();
  const month = issue.getMonth();

  const lastDay = new Date(year, month, 0);

  let depositDay;

  // 여신이 숫자인 경우 (월말에서 숫자만큼 날짜 추가)
  if (!isNaN(loan)) {
    const loanMS = +loan * 24 * 60 * 60 * 1000;

    depositDay = new Date(Date.parse(lastDay) + loanMS);
  } else {
    // case 받으면 추가하기
  }

  result = `
    ${depositDay.getFullYear()} 년
    ${depositDay.getMonth() + 1} 월
    ${depositDay.getDate()} 일
    `;
    
  return result;
}
