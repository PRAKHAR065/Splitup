document.getElementById('generateMatrix').addEventListener('click', () => {
    const numPersons = parseInt(document.getElementById('numPersons').value);
  
    if (isNaN(numPersons) || numPersons < 2) {
      alert("Please enter a valid number of persons (minimum 2).");
      return;
    }
  
    const matrixContainer = document.getElementById('matrix');
    matrixContainer.innerHTML = '';
    matrixContainer.style.gridTemplateColumns = `repeat(${numPersons}, 1fr)`;
  
    for (let i = 0; i < numPersons; i++) {
      for (let j = 0; j < numPersons; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '0';
        input.dataset.row = i;
        input.dataset.col = j;
        input.value = 0;
        matrixContainer.appendChild(input);
      }
    }
  
    document.getElementById('matrixContainer').classList.remove('hidden');
  });
  
  document.getElementById('calculateSplit').addEventListener('click', () => {
    const numPersons = parseInt(document.getElementById('numPersons').value);
    const matrix = [];
  
    // Collect the matrix values
    for (let i = 0; i < numPersons; i++) {
      const row = [];
      for (let j = 0; j < numPersons; j++) {
        const input = document.querySelector(`input[data-row="${i}"][data-col="${j}"]`);
        row.push(parseInt(input.value) || 0);
      }
      matrix.push(row);
    }
  
    const result = calculateSplit(matrix);
    document.getElementById('results').textContent = result;
    document.getElementById('resultContainer').classList.remove('hidden');
  });
  
  // Split calculation logic
  function calculateSplit(matrix) {
    const numPersons = matrix.length;
    const balance = new Array(numPersons).fill(0);
  
    // Calculate net balance for each person
    for (let i = 0; i < numPersons; i++) {
      for (let j = 0; j < numPersons; j++) {
        balance[i] += matrix[j][i] - matrix[i][j];
      }
    }
  
    const transactions = [];
    settleDebts(balance, transactions);
    return transactions.length ? transactions.join('\n') : 'No transactions needed.';
  }
  
  // Settle debts recursively
  function settleDebts(balance, transactions) {
    const maxCredit = balance.indexOf(Math.max(...balance));
    const maxDebit = balance.indexOf(Math.min(...balance));
  
    if (balance[maxCredit] === 0 && balance[maxDebit] === 0) return;
  
    const minTransfer = Math.min(-balance[maxDebit], balance[maxCredit]);
    balance[maxCredit] -= minTransfer;
    balance[maxDebit] += minTransfer;
  
    transactions.push(`Person ${maxDebit + 1} pays ${minTransfer} to Person ${maxCredit + 1}`);
    settleDebts(balance, transactions);
  }
  