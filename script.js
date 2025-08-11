      // ✅ Safe parseInt helper
      const safeParseInt = (value) => parseInt(value) || 0;

      // ✅ All JS logic (adapted from your code)
      let totalAmountInput = document.getElementById('total-amount');
      let userAmountInput = document.getElementById('user-amount');
      const checkAmountButton = document.getElementById('check-amount');
      const totalAmountButton = document.getElementById('total-amount-button');
      const productTitleInput = document.getElementById('product-title');
      const errorMessage = document.getElementById('error-budget');
      const productTitleError = document.getElementById('product-title-error');
      const expenditureValue = document.getElementById('expenditure-value');
      const balanceValue = document.getElementById('balance-amount');
      const list = document.getElementById('list');
      const userAmountDisplayText = document.getElementById('user-amount-text');

      const getBudgetTipButton = document.getElementById('get-budget-tip-button');
      const budgetTipDisplay = document.getElementById('budget-tip-display');
      const loadingTip = document.getElementById('loading-tip');
      const analyzeSpendingButton = document.getElementById('analyze-spending-button');
      const spendingAnalysisDisplay = document.getElementById('spending-analysis-display');
      const loadingAnalysis = document.getElementById('loading-analysis');

      let temporaryBudget = 0;
      let editFlag = false;
      let tempElement;

      const hideElement = (el) => el.classList.add('hidden');
      const showElement = (el) => el.classList.remove('hidden');

      totalAmountButton.addEventListener('click', () => {
        const amount = safeParseInt(totalAmountInput.value);
        if (amount <= 0) {
          showElement(errorMessage);
          errorMessage.innerText = "Please enter a valid amount";
        } else {
          hideElement(errorMessage);
          temporaryBudget = amount;
          userAmountDisplayText.innerText = amount;
          balanceValue.innerText = amount - safeParseInt(expenditureValue.innerText);
          totalAmountInput.value = "";
        }
      });

      const disableEditButtons = (bool) => {
        document.querySelectorAll('.edit').forEach(btn => btn.disabled = bool);
      };

      const modifyElement = (el, edit = false) => {
        const parentDiv = el.closest('.sublist-content');
        if (!parentDiv) return;
        const name = parentDiv.dataset.productName;
        const amount = safeParseInt(parentDiv.dataset.amount);

        if (edit) {
          editFlag = true;
          tempElement = parentDiv;
          productTitleInput.value = name;
          userAmountInput.value = amount;
          disableEditButtons(true);
        } else {
          balanceValue.innerText = safeParseInt(balanceValue.innerText) + amount;
          expenditureValue.innerText = safeParseInt(expenditureValue.innerText) - amount;
          parentDiv.remove();
        }
      };

      const listCreate = (name, amount) => {
        const sublist = document.createElement('div');
        sublist.className = "sublist-content flex justify-between items-center border border-gray-200 p-3 mb-2 rounded-lg bg-white";
        sublist.dataset.productName = name;
        sublist.dataset.amount = amount;

        const nameEl = document.createElement('p');
        nameEl.className = "text-gray-700 font-medium mb-0";
        nameEl.textContent = name;

        const amountEl = document.createElement('p');
        amountEl.className = "text-gray-700 font-semibold mb-0";
        amountEl.textContent = amount;

        const editBtn = document.createElement('button');
        editBtn.className = "fa-solid fa-pen-to-square edit bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-full ml-2";
        editBtn.addEventListener('click', () => modifyElement(editBtn, true));

        const delBtn = document.createElement('button');
        delBtn.className = "fa-solid fa-trash-can delete bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-full ml-2";
        delBtn.addEventListener('click', () => modifyElement(delBtn));

        const btnGroup = document.createElement('div');
        btnGroup.className = "flex items-center";
        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(delBtn);

        sublist.appendChild(nameEl);
        sublist.appendChild(amountEl);
        sublist.appendChild(btnGroup);

        list.appendChild(sublist);
      };

      checkAmountButton.addEventListener('click', () => {
        const name = productTitleInput.value.trim();
        const amount = safeParseInt(userAmountInput.value);
        if (name === "" || amount <= 0) {
          showElement(productTitleError);
          productTitleError.innerText = "Please enter product name and a valid amount";
          return;
        }

        hideElement(productTitleError);

        if (editFlag && tempElement) {
          const oldAmount = safeParseInt(tempElement.dataset.amount);
          expenditureValue.innerText = safeParseInt(expenditureValue.innerText) - oldAmount;
          balanceValue.innerText = safeParseInt(balanceValue.innerText) + oldAmount;
          tempElement.remove();
          editFlag = false;
          tempElement = null;
        }

        const totalExp = safeParseInt(expenditureValue.innerText) + amount;
        expenditureValue.innerText = totalExp;
        balanceValue.innerText = temporaryBudget - totalExp;

        listCreate(name, amount);
        productTitleInput.value = "";
        userAmountInput.value = "";
        disableEditButtons(false);
      });
