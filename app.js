// Data for menu items & prices
const menuData = {
  Breakfast: [
    { name: "Idli", price: 50 },
    { name: "Vada", price: 60 },
    { name: "Pongal", price: 55 },
    { name: "Upma", price: 50 },
    { name: "Dosa", price: 70 }
  ],
  Lunch: [
    { name: "Steamed Rice", price: 50 },
    { name: "Tamarind Rice", price: 55 },
    { name: "Lemon Rice", price: 50 },
    { name: "Curd Rice", price: 50 },
    { name: "Veg Biryani", price: 80 }
  ],
  Dinner: [
    { name: "Dosa", price: 70 },
    { name: "Rava Dosa", price: 60 },
    { name: "Ghee Dosa", price: 75 },
    { name: "Pesarattu", price: 80 },
    { name: "Set Dosa", price: 70 }
  ],
  Drinks: [
    { name: "Lemon Juice", price: 40 },
    { name: "Coconut Water", price: 50 },
    { name: "Buttermilk", price: 30 }
  ]
};

let selectedTable = 0;
let cart = {};

const root = document.getElementById("root");

// Utility to show message overlay
function showMessage(msg, duration=1500) {
  const existing = document.querySelector(".message-overlay");
  if (existing) root.removeChild(existing);
  const msgDiv = document.createElement("div");
  msgDiv.className = "message-overlay";
  msgDiv.textContent = msg;
  root.appendChild(msgDiv);
  setTimeout(() => {
    root.removeChild(msgDiv);
  }, duration);
}

// Show Table Selection page
function showTableSelectionPage() {
  selectedTable = 0;
  cart = {};
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container";

  const title = document.createElement("h1");
  title.textContent = "✨ Welcome to Tech Hotel ✨";
  container.appendChild(title);

  const instructions = document.createElement("pre");
  instructions.style.fontSize = "22px";
  instructions.style.color = "darkslategray";
  instructions.textContent = `📌 Instructions:
1. Select your table.
2. Select dishes with quantity.
3. Modify/delete items before payment.
4. Proceed to payment.`;
  container.appendChild(instructions);

  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.className = "button-table";
    btn.textContent = "Table " + i;
    btn.onclick = () => {
      selectedTable = i;
      cart = {};
      showMenuPage();
    };
    grid.appendChild(btn);
  }
  container.appendChild(grid);
  root.appendChild(container);
}

// Show Menu Page
function showMenuPage() {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container";

  const backBtn = document.createElement("button");
  backBtn.className = "button-back";
  backBtn.textContent = "⬅ Back";
  backBtn.onclick = showTableSelectionPage;
  container.appendChild(backBtn);

  for (const sectionName in menuData) {
    const section = document.createElement("div");
    section.className = "menu-section";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = sectionName;
    section.appendChild(title);

    const itemsGrid = document.createElement("div");
    itemsGrid.className = "grid";

    menuData[sectionName].forEach(({name, price}) => {
      const btn = document.createElement("button");
      btn.className = "button-menu-item";
      btn.textContent = `${name} - ₹${price}`;
      btn.onclick = () => showQuantityPopup(name, true);
      itemsGrid.appendChild(btn);
    });

    section.appendChild(itemsGrid);
    container.appendChild(section);
  }

  const viewCartBtn = document.createElement("button");
  viewCartBtn.className = "button-cart";
  viewCartBtn.textContent = "🛒 View Cart";
  viewCartBtn.onclick = showCartPage;
  container.appendChild(viewCartBtn);

  root.appendChild(container);
}

// Show quantity popup for add/delete
function showQuantityPopup(itemName, isAdd) {
  // Create popup elements
  const popup = document.createElement("div");
  popup.className = "popup";

  const label = document.createElement("label");
  label.textContent = (isAdd ? "Enter quantity for " : "Enter quantity to delete for ") + itemName;
  label.style.fontWeight = "bold";
  label.style.fontSize = "24px";
  popup.appendChild(label);

  const input = document.createElement("input");
  input.type = "number";
  input.value = 1;
  input.min = 1;
  popup.appendChild(input);

  const okBtn = document.createElement("button");
  okBtn.textContent = isAdd ? "Add" : "Delete";
  okBtn.style.backgroundColor = isAdd ? "#4CAF50" : "#f44336";
  okBtn.style.color = "white";
  okBtn.style.fontSize = "18px";
  okBtn.style.marginRight = "10px";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.backgroundColor = "#999";
  cancelBtn.style.color = "white";
  cancelBtn.style.fontSize = "18px";

  popup.appendChild(okBtn);
  popup.appendChild(cancelBtn);

  root.appendChild(popup);

  // Event handlers
  cancelBtn.onclick = () => root.removeChild(popup);

  okBtn.onclick = () => {
    let qty = parseInt(input.value);
    if (isNaN(qty) || qty <= 0) {
      showMessage("Enter a valid positive number!");
      return;
    }
    if (isAdd) {
      cart[itemName] = (cart[itemName] || 0) + qty;
      showMessage(`${qty} x ${itemName} added!`);
    } else {
      if (!(itemName in cart)) {
        showMessage(`${itemName} not in cart!`);
        return;
      }
      if (qty > cart[itemName]) {
        showMessage(`Cannot delete more than ${cart[itemName]}`);
        return;
      }
      cart[itemName] -= qty;
      if (cart[itemName] <= 0) delete cart[itemName];
      showMessage(`${qty} removed from ${itemName}`);
    }
    root.removeChild(popup);
  };
}

// Show Cart Page
function showCartPage() {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container";

  const title = document.createElement("h1");
  title.textContent = `🛒 Cart for Table ${selectedTable}`;
  container.appendChild(title);

  const list = document.createElement("div");
  list.className = "cart-list";
  updateCartList(list);
  container.appendChild(list);

  const totalLabel = document.createElement("div");
  totalLabel.style.fontWeight = "bold";
  totalLabel.style.fontSize = "22px";
  updateTotalLabel(totalLabel);
  container.appendChild(totalLabel);

  const btnReorder = document.createElement("button");
  btnReorder.textContent = "🔄 Reorder";
  btnReorder.className = "button-payment";
  btnReorder.onclick = showMenuPage;

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "🗑 Delete Order";
  btnDelete.className = "button-delete";
  btnDelete.onclick = () => {
    const itemNames = Object.keys(cart);
    if (itemNames.length === 0) {
      showMessage("Cart is empty");
      return;
    }
    const itemToDelete = prompt("Enter item name to delete:");
    if (!itemToDelete || !(itemToDelete in cart)) {
      showMessage("Invalid item name");
      return;
    }
    showQuantityPopup(itemToDelete, false);
  };

  const btnPayment = document.createElement("button");
  btnPayment.textContent = "💳 Payment";
  btnPayment.className = "button-payment";
  btnPayment.onclick = showPaymentPage;

  const btnBox = document.createElement("div");
  btnBox.style.display = "flex";
  btnBox.style.justifyContent = "center";
  btnBox.style.gap = "20px";
  btnBox.style.marginTop = "15px";

  btnBox.appendChild(btnReorder);
  btnBox.appendChild(btnDelete);
  btnBox.appendChild(btnPayment);

  container.appendChild(btnBox);

  root.appendChild(container);
}

// Update cart list element
function updateCartList(listEl) {
  listEl.innerHTML = "";
  for (const item in cart) {
    const qty = cart[item];
    const price = findPrice(item);
    const subtotal = qty * price;
    const div = document.createElement("div");
    div.textContent = `${item} x ${qty} = ₹${subtotal}`;
    listEl.appendChild(div);
  }
}

// Update total label element
function updateTotalLabel(labelEl) {
  let total = 0;
  for (const item in cart) {
    total += cart[item] * findPrice(item);
  }
  labelEl.textContent = `Total Bill: ₹${total}`;
}

function findPrice(itemName) {
  for (const section in menuData) {
    for (const it of menuData[section]) {
      if (it.name === itemName) return it.price;
    }
  }
  return 0;
}

// Show Payment Page
function showPaymentPage() {
  root.innerHTML = "";

  const container = document.createElement("div");
  container.className = "container";
  container.style.background = "linear-gradient(135deg, #f12711, #f5af19)";
  container.style.color = "white";
  container.style.textAlign = "center";

  const title = document.createElement("h1");
  title.textContent = "💰 Payment Options";
  container.appendChild(title);

  const msgLabel = document.createElement("div");
  msgLabel.style.fontWeight = "bold";
  msgLabel.style.fontSize = "24px";
  msgLabel.style.margin = "20px";
  container.appendChild(msgLabel);

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✅ Check Items";
  checkBtn.style.backgroundColor = "#4CAF50";
  checkBtn.style.color = "white";
  checkBtn.style.padding = "10px 20px";
  checkBtn.style.borderRadius = "15px";
  checkBtn.style.fontSize = "20px";
  checkBtn.style.margin = "10px";
  checkBtn.onclick = showCartPage;

  const cashCounterBtn = document.createElement("button");
  cashCounterBtn.textContent = "💵 Cash at Counter";
  cashCounterBtn.style.backgroundColor = "#2196F3";
  cashCounterBtn.style.color = "white";
  cashCounterBtn.style.padding = "10px 20px";
  cashCounterBtn.style.borderRadius = "15px";
  cashCounterBtn.style.fontSize = "20px";
  cashCounterBtn.style.margin = "10px";

  cashCounterBtn.onclick = () => {
    const total = calculateTotal();
    msgLabel.textContent = `💳 Table ${selectedTable}\nThank you for visiting Tech Hotel!\nYour bill is ₹${total}.\nPlease take it and give it to the counter.\nPrinting your bill now...`;
    cart = {};
    setTimeout(showTableSelectionPage, 3000);
  };

  const cashMobileBtn = document.createElement("button");
  cashMobileBtn.textContent = "📱 Cash via Mobile";
  cashMobileBtn.style.backgroundColor = "#FF5722";
  cashMobileBtn.style.color = "white";
  cashMobileBtn.style.padding = "10px 20px";
  cashMobileBtn.style.borderRadius = "15px";
  cashMobileBtn.style.fontSize = "20px";
  cashMobileBtn.style.margin = "10px";

  cashMobileBtn.onclick = () => {
    const total = calculateTotal();
    msgLabel.textContent = `💳 Table ${selectedTable}\nPlease pay via Mobile to the number 8807496177.\nAmount: ₹${total}\nThank you for visiting Tech Hotel!`;
    cart = {};
    setTimeout(showTableSelectionPage, 3000);
  };

  container.appendChild(checkBtn);
  container.appendChild(cashCounterBtn);
  container.appendChild(cashMobileBtn);

  root.appendChild(container);
}

// Calculate cart total
function calculateTotal() {
  let total = 0;
  for (const item in cart) {
    total += cart[item] * findPrice(item);
  }
  return total;
}

// Initialize app with table selection
showTableSelectionPage();

