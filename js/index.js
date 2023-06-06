function getLinkArr() {
  let linkStrArr = localStorage.getItem("dsp_shortlinks");
  if (!linkStrArr) return [];

  let linkArr = JSON.parse(linkStrArr);
  return linkArr;
}

function populateLInks(div) {
  let linkArr = getLinkArr();
  let content = ``;

  if (linkArr.length === 0) {
    div.style.display = "none";
    return;
  }

  linkArr.forEach((link) => {
    content += `
    <div class='outer_div'>
      <span>${link.long}</span>

      <div class='inner_div'>
        <a href='${link.short}'>${link.short}</a>
        <button onClick='copy(event)' class='copy_btn'>Copy</button>
      </div>
    </div>
      `;
  });

  div.innerHTML = content;
  return;
}

function setLinkArr(data) {
  let linkArr = getLinkArr();
  linkArr = [
    { long: data.result.original_link, short: data.result.full_short_link },
    ...linkArr,
  ];
  par;

  localStorage.setItem("dsp_shortlinks", JSON.stringify(linkArr));
}

function copy(event) {
  let btn = event.target;
  let link = btn.parentNode.childNodes[1].innerHTML;
  console.log(btn.parentNode.childNodes);
  navigator.clipboard.writeText(link);
  btn.classList.add("clicked");
  btn.innerHTML = "Copied!";
}

function updateError(input, error) {
  let errorBox = document.querySelector("#errBox");
  errorBox.style.display = "inline-block";
  errorBox.innerHTML = error;
  input.classList.add("error");
}

function clearError(input) {
  let errorBox = document.querySelector("#errBox");
  errorBox.innerHTML = "";
  errorBox.style.display = "none";
  input.classList.remove("error");
}

window.onload = () => {
  let form = document.querySelector(".linkForm");
  let linkDiv = document.querySelector(".shortenedLink");
  let transformDiv = document.querySelector(".transform_div");

  transformDiv.style.transform = `translateY(-${
    transformDiv.childNodes[1].clientHeight / 2
  }px)`;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    input = document.querySelector("#linkInput");
    link = input.value;

    clearError(input);
    if (link === "") {
      updateError(input, "Please add a link");
      return;
    }

    response = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`);
    data = await response.json();

    if (!data.ok) {
      updateError(input, data.error);
      return;
    }

    setLinkArr(data);
    populateLInks(linkDiv);
    input.value = "";
  });

  populateLInks(linkDiv);
};
