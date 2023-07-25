document.addEventListener("DOMContentLoaded", () => {
  // ---- Links ----
  const API_KEY = "DJ73dpt+YOX+awA1BU9qCA==rNEEFQswFZwY9AVG";

  // complete: apiUrl + '(currency1)_(currency2)'
  const apiUrl = "https://api.api-ninjas.com/v1/exchangerate?pair=";

  // ---- Constants ----
  const amountInput = document.querySelector("#from-amount");
  const amountOutput = document.querySelector("#to-amount");
  const fromCurrencySelect = document.querySelector("#from");
  const toCurrencySelect = document.querySelector("#to");
  const resultDisplay = document.querySelector(".result-display");
  const switchBtn = document.querySelector("#switch-btn");

  // ---- Events ----
  amountInput.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      Number(amountInput.value) > 0 &&
      fromCurrencySelect.value &&
      toCurrencySelect.value
    ) {
      convert();
    }
  });

  fromCurrencySelect.addEventListener("change", () => {
    if (Number(amountInput.value) > 0 && toCurrencySelect.value) {
      convert();
    }
  });

  toCurrencySelect.addEventListener("change", () => {
    if (Number(amountInput.value) > 0 && fromCurrencySelect.value) {
      convert();
    }
  });

  switchBtn.addEventListener("click", switcheroo);

  // ---- Functions ----
  async function convert() {
    const fromAmount = Number(amountInput.value);
    const currencyPair = `${fromCurrencySelect.value}_${toCurrencySelect.value}`;
    const settings = {
      method: "GET",
      headers: {
        "X-Api-Key": "API_KEY",
      },
      contentType: "application/json",
    };

    try {
      // empty text and show loading animation
      amountOutput.value = "";
      showLoading();

      // fetch data
      const res = await fetch(apiUrl + currencyPair, settings);

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      const exchangeRate = data.exchange_rate;
      const toAmount = (fromAmount * exchangeRate).toFixed(2);
      const amountOutputValue = toAmount.toString();

      // display data and stop loading animation
      amountOutput.value = amountOutputValue;
      hideLoading();
      displayResult(amountOutputValue);
    } catch (err) {
      console.log(err);
    }
  }

  function displayResult(result) {
    resultDisplay.innerHTML = "";

    const originalAmount = numberWithCommas(amountInput.value);
    const convertedAmount = numberWithCommas(result);

    const original = document.createElement("span");
    const converted = document.createElement("span");
    const equals = document.createTextNode(" = ");

    original.className = "original";
    converted.className = "converted";
    original.textContent = `${originalAmount} ${fromCurrencySelect.value}`;
    converted.textContent = `${convertedAmount} ${toCurrencySelect.value}`;

    resultDisplay.appendChild(original);
    resultDisplay.appendChild(equals);
    resultDisplay.appendChild(converted);
  }

  function showLoading() {
    document.querySelector(".load").style.display = "block";
  }

  function hideLoading() {
    document.querySelector(".load").style.display = "none";
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function switcheroo() {
    const tempFromAmount = amountInput.value;
    const tempToAmount = amountOutput.value;

    const tempFromSelect = fromCurrencySelect.value;
    const tempToSelect = toCurrencySelect.value;

    // switch position
    amountInput.value = tempToAmount;
    amountOutput.value = tempFromAmount;

    fromCurrencySelect.value = tempToSelect;
    toCurrencySelect.value = tempFromSelect;

    convert();
  }
});
