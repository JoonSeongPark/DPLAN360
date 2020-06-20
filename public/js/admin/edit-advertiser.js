const mainCategory = document.getElementById("main_category");
const subCategory = document.getElementById("sub_category");

function chooseSub(e) {
  const mainId = e.target.value;
  const subArr = Array.from(subCategory.children);
  subArr.slice(1).forEach((option) => {
    if (
      !option.classList.contains("deactive") ||
      mainId === option.getAttribute("main")
    ) {
      option.classList.toggle("deactive");
    }
  });
  subCategory.value= ""
}

mainCategory.addEventListener("change", chooseSub);
