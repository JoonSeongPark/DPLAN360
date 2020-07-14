// media List
const mediaUl = document.getElementById("media-ul");
const mediaList = Array.from(mediaUl.children).map((x) => {
  return {
    id: x.children[0].innerHTML,
    name: x.children[1].innerHTML,
  };
});

// media auto complete
const mediaInput = document.getElementById("media-input");
mediaInput.focus();

new autoComplete({
  selector: mediaInput,
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    const choices = mediaList.map((x) => {
      return x.name;
    });

    const matches = choices.filter((choice) => {
      return choice.toLowerCase().includes(term);
    });
    suggest(matches);
  },
});

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
  }

  adTotalCell.innerHTML = nf(agencySum + mediaSum + dplanSum + interSum);
  agencyTotalCell.innerHTML = nf(agencySum);
  mediaTotalCell.innerHTML = nf(mediaSum);
  dplanTotalCell.innerHTML = nf(dplanSum);
  interTotalCell.innerHTML = nf(interSum);
}

const conditionTable = document.getElementById("condition-table");
const formEl = document.querySelector("form");
const submitInput = document.getElementById("submit-button");
const mediaId = document.getElementById("media-id");

conditionTable.addEventListener("change", (e) => {
  if (e.target.id === "media-input") {
    const searchedMedia = mediaList.find(
      (media) => media.name === e.target.value
    );
    if (searchedMedia === undefined) {
      const errorP = document.createElement("p");
      errorP.classList.add("error-p");
      errorP.innerText = "매체를 새로 추가하거나 매체명을 확인하세요.";
      conditionTable.parentElement.append(errorP);
      return;
    } else {
      mediaId.value = searchedMedia.id;
    }
  }
  submitInput.click();
});
