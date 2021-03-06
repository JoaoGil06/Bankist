"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "João Gil",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Rita Ferreira",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Pedro Gil",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Constantino Gil",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = ({ movements }, sort = false) => {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((movement, index) => {
    const movementType = movement > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${movementType}">
                ${index + 1} ${movementType}
            </div>
            <div class="movements__value">${movement}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = ({ movements, interestRate }) => {
  const incomes = movements
    .filter((movement) => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);

  const out = movements
    .filter((movement) => movement < 0)
    .reduce((acc, movement) => acc - movement, 0);

  const interest = movements
    .filter((movement) => movement > 0)
    .map((movement) => (movement * interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, movement) => acc + movement, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${out}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = (accounts) => {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((name) => name.at(0))
      .join("");
  });
};

createUsernames(accounts);

const updateUI = (currentAccount) => {
  //Display movements
  displayMovements(currentAccount);

  //Display Balance
  calcDisplayBalance(currentAccount);

  //Display Summary
  calcDisplaySummary(currentAccount);
};

//Event Handler
let currentAccount;

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI & Message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", (event) => {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", (event) => {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", (event) => {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", (event) => {
  event.preventDefault();

  displayMovements(currentAccount, sorted);
  sorted = !sorted;
});
