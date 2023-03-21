const dropList= document.querySelectorAll('.drop-list select');
const fromCurrency= document.querySelector('.from select');
const toCurrency= document.querySelector('.to select');
let button = document.querySelector('form button')
for (let i = 0; i < dropList.length; i++) {
    for(currencyCode in countryCode){
        //selecting USD and NGN by default
        let selected;
        if(i == 0){
            selected = currencyCode == "USD" ? "selected" : "";
        } else if(i == 1){
            selected = currencyCode == "NGN" ? "selected" : "";
        }
        //putting the currency code in the option tag
        let optionTag = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;

        dropList[i].insertAdjacentHTML("beforeend", optionTag)   
    }
    dropList[i].addEventListener('change', e => {
        loadFlag(e.target) //loading the flag of the selected currency code
    })
}

function loadFlag(el) {
    for(code in countryCode){
        if(code == el.value){
            let imgTag = el.parentElement.querySelector('img');
            imgTag.src = `https://flagcdn.com/48x36/${countryCode[code].toLowerCase()}.png`
        }
    }
}

window.addEventListener('load', () => {
    getTheExchangeRate();
})

button.addEventListener('click', e => {
    e.preventDefault();
    getTheExchangeRate();
})

const swapIcon = document.querySelector('.drop-list .icon')
swapIcon.addEventListener('click', () => {
    change = fromCurrency.value; //the main code we're seeing
    fromCurrency.value = toCurrency.value; // swaps from currency to the to currency
    toCurrency.value = change; // swaps to currency to the from currency
    getTheExchangeRate();
    loadFlag(fromCurrency) //loading the flag of the selected currency code
    loadFlag(toCurrency)   
})

function getTheExchangeRate() {
    const amount = document.querySelector('.amount input')
    let amountVal = amount.value
    exchangeRateTxt = document.querySelector('.exchange-rate')
    //If user inputs zero or leaves the input empty and submits, it'll make the input val 1 by default
    if(amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1
    }

    exchangeRateTxt.textContent = 'Fetching Exchange Rate....';

    let url = `https://v6.exchangerate-api.com/v6/02acb3fed48d96bc94c543de/latest/${fromCurrency.value}`;
    //fetch(url).then(response => console.log(response.json()));
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value]
        console.log(exchangeRate);
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2)
        console.log(totalExchangeRate)
        exchangeRateTxt.textContent = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
    }).catch(() => {//if user is offline or any other error occured while fetching data
        exchangeRateTxt.textContent = 'Failed to fetch exchange rate'
    })
}