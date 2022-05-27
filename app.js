/* DOM imports */
var countryOptionsElement = document.getElementById("country");
var formInputArray = document.querySelectorAll(".form__input");
var cartDecrementBtnArray = document.querySelectorAll(
  ".card__button--decrement"
);
var checkbox = document.getElementById("form__checkbox");
var cartIncrementBtnArray = document.querySelectorAll(
  ".card__button--increment"
);
var shippingElement = document.getElementById("shipping-cost");
var totalElement = document.getElementById("total-cost");
/* Form Elements */
var purchaseForm = document.getElementById("purchase-form");
/* From https://regexr.com since I really can't understand how regex work */
var namePattern =
  /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
var emailPattern =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
var phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

/* Adding the data to select/country dropdown element */

async function setCountryList() {
  // getting the country list
  var response = await fetch("./countries.json");
  var jsonResponse = await response.json();
  // adding each country on the document
  jsonResponse.countries.forEach(function (country) {
    const newSelectItem = document.createElement("option");
    newSelectItem.textContent = country.name;
    newSelectItem.value = country.code;
    countryOptionsElement.appendChild(newSelectItem);
  });
}

/* Adding cart buttons functionality */

function cartAdd(x, y) {
  var sum = +x + +y;
  return sum.toFixed(2);
}
function cartDecrease(x, y) {
  var difference = +x - +y;
  return difference.toFixed(2);
}

cartIncrementBtnArray.forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    var price =
      event.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    var indicator = event.target.previousElementSibling;
    indicator.innerHTML = Number(indicator.textContent) + 1;
    if (totalElement.textContent === "0")
      totalElement.innerHTML = cartAdd(
        totalElement.innerHTML,
        shippingElement.innerHTML
      );
    totalElement.innerHTML = cartAdd(totalElement.innerHTML, price);
  });
});

cartDecrementBtnArray.forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    if (totalElement.innerHTML === "0") return;
    var price =
      event.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    var indicator = event.target.nextElementSibling;
    if (indicator.textContent === "0") return;
    indicator.innerHTML = Number(indicator.textContent) - 1;
    totalElement.innerHTML = cartDecrease(totalElement.innerHTML, price);
    if (Math.floor(+totalElement.textContent) === +shippingElement.textContent)
      totalElement.innerHTML = "0";
  });
});
/* Email validation */
function validateInput(event, element, regex) {
  if (element.value.match(regex))
    return manipulateInputElement(element, "#828282", "1px");
  if (event) event.preventDefault();
  element.parentElement.setAttribute(
    "data-error",
    `Please check your ${element.id} input.`
  );
  manipulateInputElement(element, "#c92342", "1px");
}

function checkInput(event, element) {
  var splitted = element.id.split("");
  var label = splitted[0].toUpperCase() + splitted.slice(1).join("");
  if (element.value === "" || element.value === null) {
    if (event) event.preventDefault();
    element.parentElement.setAttribute("data-error", `${label} can't be empty`);
    manipulateInputElement(element, "#c92342", "1px");
    return;
  }
  switch (element.id) {
    case "email":
      validateInput(event, element, emailPattern);
      break;
    case "phone":
      validateInput(event, element, phonePattern);
      break;
    case "fullname":
      validateInput(event, element, namePattern);
      break;
    default:
      manipulateInputElement(element, "#828282", "1px");
      break;
  }
}

function purchaseFormHandler(event, element) {
  switch (element.id) {
    case "email":
      checkInput(event, element);
      break;
    case "phone":
      checkInput(event, element);
      break;
    case "fullname":
      checkInput(event, element);
      break;
    case "address":
      checkInput(event, element);

      break;
    case "city":
      checkInput(event, element);
      break;
    case "postal":
      checkInput(event, element);
      break;
    default:
      break;
  }
}

purchaseForm.addEventListener("submit", function (event) {
  formInputArray.forEach(function (input) {
    purchaseFormHandler(event, input);
  });
  onCheckedListener();
});

/* Adding styles on input focus */

function manipulateInputElement(target, color, borderWidth) {
  target.parentElement.style.border = `${borderWidth} solid ${color}`;
  target.previousElementSibling.style.color = color;
}

formInputArray.forEach(function (input) {
  input.addEventListener("focus", function (event) {
    manipulateInputElement(event.target, "#f2994a", "2px");
    if (input.parentElement.hasAttribute("data-error"))
      input.parentElement.removeAttribute("data-error");
  });
  input.addEventListener("blur", function () {
    purchaseFormHandler(null, input);
  });
});

countryOptionsElement.addEventListener("focus", function () {
  manipulateInputElement(event.target, "#f2994a", "2px");
});

countryOptionsElement.addEventListener("blur", function () {
  manipulateInputElement(event.target, "#828282", "1px");
});

function onCheckedListener() {
  if (!checkbox.checked) return window.localStorage.clear();
  formInputArray.forEach(function (input) {
    window.localStorage.setItem(input.id, input.value);
  });
  window.localStorage.setItem(
    countryOptionsElement.id,
    countryOptionsElement.value
  );
}

checkbox.addEventListener("change", function () {
  onCheckedListener();
});

document.addEventListener("DOMContentLoaded", function () {
  if (
    document.readyState === "interactive" ||
    document.readyState === "completed"
  ) {
    setCountryList();
    if (checkbox.checked) {
      formInputArray.forEach(function (input) {
        input.value = window.localStorage.getItem(input.id);
      });
      countryOptionsElement.value = window.localStorage.getItem(
        countryOptionsElement.id
      );
    }
  }
});
