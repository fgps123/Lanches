var infoFood = {};
var infoFillings = [];

async function getFood(idFood) {
  try {
    const response = await fetch(`http://localhost:8080/food/${idFood}`);
    const data = await response.json();

    infoFood = data.food[0];
    infoFillings = data.fillings;

    document.querySelector("#price").innerHTML = infoFood.price;
    document.querySelector("#additions").innerHTML = "";

    renderFillings();

  } catch (error) {
    alert("Erro ao carregar os dados do servidor");
  }
}

function renderFillings() {
  document.querySelector(".fillings").innerHTML = "";

  for (let filling of infoFillings) {
    let div = document.createElement("div");
    div.innerHTML = `<input type="checkbox" onchange="updateTotalPrice()" /> ${filling.name} (R$ ${filling.price.toFixed(2)})`;

    div.addEventListener("change", updateTotalPrice);

    document.querySelector(".fillings").appendChild(div);

  }
}

function updateTotalPrice() {
  let totalPrice = parseFloat(infoFood.price);
  let additions = [];
  const checkboxes = document.querySelectorAll(".fillings input[type='checkbox']");
  
  
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      totalPrice += parseFloat(infoFillings[index].price);
      additions.push(infoFillings[index].name);
    }
  });

  document.querySelector("#price").innerHTML = totalPrice.toFixed(2);
  document.querySelector("#additions").innerHTML = additions.join("<br>");
}

async function pay() {
  try {
    const cpf = document.getElementById("cpf").value;
    
    if (!cpf || cpf.length !== 11) {
      alert("Insira um CPF válido com 11 dígitos");
      return;
    }

    const id_foods = document.getElementById("tapioca").checked ? 1 : 2;
    
    const checkboxes = document.querySelectorAll(".fillings input[type='checkbox']");
    let description = [];
    let totalPrice = parseFloat(infoFood.price);

    checkboxes.forEach((checkbox, index) => {
      if (checkbox.checked) {
        const filling = infoFillings[index];
        description.push(filling.name);
        totalPrice += parseFloat(filling.price);
      }
    });

    const result = await Swal.fire({
      title: "Tem certeza que deseja pagar?",
      text: "Preço total: R$ " + totalPrice.toFixed(2),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, quero pagar!"
    });

    if (result.isConfirmed) {
      const payInfo = {
        id_foods,
        cpf,
        pay_date: new Date().toISOString(),
        description: description.join(", "),
        price: totalPrice.toFixed(2)
      };

      console.log("Enviando dados do pagamento:", payInfo);

      const response = await fetch("http://localhost:8080/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payInfo),
      });

      const data = await response.json();
      
      if (response.ok) {
        checkboxes.forEach(checkbox => checkbox.checked = false);
        document.querySelector("#price").innerHTML = infoFood.price;
        document.querySelector("#additions").innerHTML = "";
        
        Swal.fire({
          title: "Pagamento realizado com sucesso!",
          text: "Obrigado pela compra!",
          icon: "success"
        });
      } else {
        throw new Error(data.error || "Erro ao processar pagamento");
      }
    }
  } catch (error) {
    console.error("Erro no pagamento:", error);
    alert("Erro ao processar pagamento. Por favor, tente novamente.");
  }
}
document.querySelector(".price-container button").addEventListener("click", pay);
function showHistory() {
  const cpf = document.getElementById("cpf").value;

  if (!cpf || cpf.length !== 11) {
    alert("Insira um CPF com 11 dígitos");
    return;
  }

  fetch(`http://localhost:8080/history?cpf=${cpf}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Erro ao buscar histórico');
      }
      return res.json();
    })
    .then((data) => {
      const historyList = document.getElementById("history-list");
      historyList.innerHTML = "";
      document.querySelector("#cpf-history").innerHTML = cpf;

      if (data.length === 0) {
        historyList.innerHTML = "<li>Nenhuma compra encontrada.</li>";
      } else {
        data.forEach((purchase) => {
          const item = document.createElement("li");
          item.innerText = `Data: ${new Date(purchase.pay_date).toLocaleDateString()} | R$ ${purchase.price} | ${purchase.description}`;
          historyList.appendChild(item);
        });
      }

      document.getElementById("modal-history").style.display = "block";
    })
    .catch((error) => {
      console.error("Erro ao buscar histórico:", error);
      alert("Erro ao buscar histórico. Por favor, tente novamente.");
    });
}
getFood(1);