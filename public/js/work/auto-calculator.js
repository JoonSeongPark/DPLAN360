// 각 매체 자동 계산 함수
function autoCalculate(e) {
  // 숫자 부분만 함수적용
  if (!e.target.classList.contains("input-num")) return;
  if (e.target.getAttribute("name") === "google_cid") return;

  const targetRow = e.target.closest("tr");

  const agencyFeeRateInput = targetRow.cells[7].children[0];
  const mediaFeeRateInput = targetRow.cells[8].children[0];
  const dplanFeeRateInput = targetRow.cells[9].children[0];
  const interFeeRateInput = targetRow.cells[10].children[0];

  const agencyFeeInput = targetRow.cells[12].children[0];
  const mediaFeeInput = targetRow.cells[13].children[0];
  const dplanFeeInput = targetRow.cells[14].children[0];
  const interFeeInput = targetRow.cells[15].children[0];

  const totalFeeInput = targetRow.cells[11].children[0];

  switch (e.target) {
    case agencyFeeRateInput:
      agencyFeeInput.value = (
        +totalFeeInput.value *
        (+agencyFeeRateInput.value / 100)
      ).toFixed();
      break;
    case mediaFeeRateInput:
      mediaFeeInput.value = (
        +totalFeeInput.value *
        (+mediaFeeRateInput.value / 100)
      ).toFixed();
      break;
    case dplanFeeRateInput:
      dplanFeeInput.value = (
        +totalFeeInput.value *
        (+dplanFeeRateInput.value / 100)
      ).toFixed();
      break;
    case interFeeRateInput:
      interFeeInput.value = (
        +totalFeeInput.value *
        (+interFeeRateInput.value / 100)
      ).toFixed();
      break;

    case agencyFeeInput:
      agencyFeeRateInput.value = (
        (+agencyFeeInput.value / +totalFeeInput.value) *
        100
      ).toFixed(2);

      dplanFeeInput.value =
        +totalFeeInput.value -
        (+agencyFeeInput.value + +mediaFeeInput.value + +interFeeInput.value);
      break;
    case mediaFeeInput:
      mediaFeeRateInput.value = (
        (+mediaFeeInput.value / +totalFeeInput.value) *
        100
      ).toFixed(2);

      dplanFeeInput.value =
        +totalFeeInput.value -
        (+agencyFeeInput.value + +mediaFeeInput.value + +interFeeInput.value);
      break;
    case dplanFeeInput:
      dplanFeeRateInput.value = (
        (+dplanFeeInput.value / +totalFeeInput.value) *
        100
      ).toFixed(2);
      break;
    case interFeeInput:
      interFeeRateInput.value = (
        (+interFeeInput.value / +totalFeeInput.value) *
        100
      ).toFixed(2);

      dplanFeeInput.value =
      +totalFeeInput.value -
      (+agencyFeeInput.value + +mediaFeeInput.value + +interFeeInput.value);
      break;
    case totalFeeInput:
      agencyFeeInput.value = (
        +totalFeeInput.value *
        (+agencyFeeRateInput.value / 100)
      ).toFixed();
      mediaFeeInput.value = (
        +totalFeeInput.value *
        (+mediaFeeRateInput.value / 100)
      ).toFixed();
      dplanFeeInput.value = (
        +totalFeeInput.value *
        (+dplanFeeRateInput.value / 100)
      ).toFixed();
      interFeeInput.value = (
        +totalFeeInput.value *
        (+interFeeRateInput.value / 100)
      ).toFixed();
      break;
  }

  errorCheck(
    100,
    agencyFeeRateInput,
    mediaFeeRateInput,
    dplanFeeRateInput,
    interFeeRateInput
  );

  errorCheck(
    totalFeeInput.value,
    agencyFeeInput,
    mediaFeeInput,
    dplanFeeInput,
    interFeeInput
  );

  autoTotalCaculate();
}

function errorCheck(total, ...args) {
  const percentSum = args.reduce((acc, cur) => {
    return acc + +cur.value;
  }, 0);

  if (+total !== percentSum) {
    args.forEach((element) => {
      element.classList.add("error-border");
    });
  } else {
    args.forEach((element) => {
      element.classList.remove("error-border");
    });
  }
}
