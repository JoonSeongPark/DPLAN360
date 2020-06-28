// DB List

// main category list
const mainUl = document.getElementById("main-ul");
const mainList = Array.from(mainUl.children).map((x) => {
  return { id: x.children[0].innerHTML, name: x.children[1].innerHTML };
});

// sub category list
const subUl = document.getElementById("sub-ul");
const subList = Array.from(subUl.children).map((x) => {
  return { id: x.children[0].innerHTML, name: x.children[1].innerHTML };
});

// advertiser List
const advertiserUl = document.getElementById("advertiser-ul");
const adList = Array.from(advertiserUl.children).map((x) => {
  return {
    name: x.children[0].innerHTML,
    main_id: x.children[1].innerHTML,
    sub_id: x.children[2].innerHTML,
  };
});

// agency List
const agencyUl = document.getElementById("agency-ul");
const agencyList = Array.from(agencyUl.children).map((x) => {
  return {
    name: x.children[0].innerHTML,
    pay_condition: x.children[1].innerHTML,
    deposit_type: x.children[2].innerHTML,
    bill_type: x.children[3].innerHTML,
  };
});

// media List
const mediaUl = document.getElementById("media-ul");
const mediaList = Array.from(mediaUl.children).map((x) => {
  return {
    name: x.children[0].innerHTML,
    pay_condition: x.children[1].innerHTML,
    bill_type: x.children[2].innerHTML,
    provide_fee_rate: x.children[3].innerHTML,
    inter_type: x.children[4].innerHTML,
    inter_name: x.children[5].innerHTML,
    agency_fee_rate: x.children[6].innerHTML,
    media_fee_rate: x.children[7].innerHTML,
    dplan_fee_rate: x.children[8].innerHTML,
    inter_fee_rate: x.children[9].innerHTML,
  };
});

/////////////////////////////////////////////////////////////////

// today date auto input
inputToday();
function inputToday() {
  const camDate = document.getElementById("cam-date");
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth();
  month = month < 10 ? `0${month}` : month;
  const day = today.getDate();

  camDate.value = `${year}-${month}-${day}`;
}

/////////////////////////////////////////////////////////////////

// 매체추가 버튼 기능
const newRowContent = `
  <td>
    <input type="text" name="media_name" style="width:88px"/>
  </td>
  <td>
    <input class="input-date" type="date" name="media_start" />
  </td>
  <td>
    <input class="input-date" type="date" name="media_end" />
  </td>
  <td>
    <select name="lower_inter_type" id="lower-inter-type">
      <option value="">x</option>
      <option value="in">in</option>
      <option value="out">out</option>
    </select>
  </td>
  <td>
    <input
      name="lower_inter_name"
      id="lower-inter-name"
      type="text"
      style="width:88px"
    />
  </td>
  <td>
    <input class="input-date" type="month"/>
    <select name="lower_issue_type">
      <option value="전액">전액</option>
      <option value="순액">순액</option>
    </select>
  </td>
  <td>
    <input
      class="input-num"
      style="width:24px"
      type="text"
      name="lower_agency_fee_rate"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:24px"
      type="text"
      name="lower_media_fee_rate"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:24px"
      type="text"
      name="lower_dplan_fee_rate"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:24px"
      type="text"
      name="lower_inter_fee_rate"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:88px"
      type="text"
      name="lower_ad_fee"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:88px"
      type="text"
      name="lower_agency_fee"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:88px"
      type="text"
      name="lower_media_fee"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:88px"
      type="text"
      name="lower_dplan_fee"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:88px"
      type="text"
      name="lower_inter_fee"
      value="0"
    />
  </td>
  <td>
    <input
      class="input-num"
      style="width:68px"
      type="text"
      name="google-cid"
    />
  </td>
  <td>
    <input
    name="lower_memo"
    style="width:68px"
    type="text"
  </td>
  <td>
    <button class="btn alert-btn">삭제</button>
  </td>`;
const addMediaBtn = document.getElementById("add-media");

addMediaBtn.addEventListener("click", () => {
  const len = mediaTable.rows.length;
  const row = mediaTable.insertRow(len - 1);
  row.innerHTML = newRowContent;

  // media auto complete
  const mediaInput = row.cells[0].children[0];
  
  new autoComplete({
    selector: mediaInput,
    minChars: 1,
    source: function (term, suggest) {
      term = term.toLowerCase();
      const choices = mediaList.map((x) => {
        return x.name;
      });
      const matches = [];
      for (i = 0; i < choices.length; i++)
        if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
      suggest(matches);
    },
  });

  // media delete button
  const deleteBtn = row.cells[row.cells.length - 1].children[0];
  deleteBtn.addEventListener("click", (e) => {
    e.target.closest("tr").remove();
  });
});

/////////////////////////////////////////////////////////////////

// advertiser auto complete
const advertiserInput = document.getElementById("cam-advertiser");

new autoComplete({
  selector: advertiserInput,
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    const choices = adList.map((x) => {
      return x.name;
    });
    const matches = [];
    for (i = 0; i < choices.length; i++)
      if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
    suggest(matches);
  },
});

const mainInput = document.getElementById("cam-main-cat");
const subInput = document.getElementById("cam-sub-cat");

advertiserInput.addEventListener("focusout", (e) => {
  const advertiser_info = adList.find((x) => x.name === e.target.value);
  if (!advertiser_info) return;
  mainInput.value = mainList.find((x) => x.id == advertiser_info.main_id).name;
  subInput.value = subList.find((x) => x.id == advertiser_info.sub_id).name;
});

/////////////////////////////////////////////////////////////////

// agency auto complete
const agencyInput = document.getElementById("cam-agency");

new autoComplete({
  selector: agencyInput,
  minChars: 1,
  source: function (term, suggest) {
    term = term.toLowerCase();
    const choices = agencyList.map((x) => {
      return x.name;
    });
    const matches = [];
    for (i = 0; i < choices.length; i++)
      if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
    suggest(matches);
  },
});

////////////////////////////////////////////////////////////////////

// 광고수주액 및 대행사 수수료 from lower part sum
// 상단부
const camAdTotal = document.getElementById("cam-ad-total");
const camAgencyFeeRate = document.getElementById("cam-agency-fee-rate");
const camAgencyFee = document.getElementById("cam-agency-fee");
// 하단부
const lowerAdFeeSum = document.getElementById("lower-ad-fee-sum");

lowerAdFeeSum.addEventListener("change", (e) => {
  camAdTotal.value = e.target.innerHTML;
});

////////////////////////////////////////////////////////////////////

const mediaTable = document.getElementById("media-table");

const startDate = document.getElementById("cam-start-date");
const endDate = document.getElementById("cam-end-date");

startDate.addEventListener("change", (e) => {
  console.log(e.target.value);
});

// console.log(mediaTable.rows);
// console.log(mediaTable.rows[2]);
// console.log(mediaTable.rows[2].cells);
// console.log(mediaTable.rows[2].cells[3].value);

mediaTable.rows[2].cells[3].addEventListener("change", (event) => {
  console.log(event.target.value);
});
