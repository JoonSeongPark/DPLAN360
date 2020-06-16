const interTypeEl = document.getElementById("inter_type");
const interNameEl = document.getElementById("inter_name");

interTypeEl.addEventListener("change", (e) => {
  if (e.target.value === "in" || e.target.value === "out") {
    interNameEl.type = "text";
  } else {
    interNameEl.type = "hidden";
  }
});
