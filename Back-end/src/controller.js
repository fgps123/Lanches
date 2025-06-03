const database = require("./database");
const FoodRepository = require("./repository");
const repository = new FoodRepository(database);
async function getAllFoods(request, reply) {
  const responseDB = await repository.getAllFoods();
  if (responseDB.error) return reply.status(404).json(responseDB.error);
  reply.json(responseDB);
}

/* Retorna uma comida pelo ID, como também o seu
   preço e os seus recheios */
async function getFoodById(request, reply) {
  const id = request.params.id;
  const responseFood = await repository.getFoodById(id);
  const responseFillings = await repository.getFillingsById(id);
  if (responseFood.error) return reply.status(404).json(responseFood.error);
  const response = {
    food: responseFood,
    fillings: responseFillings,
  };
  reply.json(response);
}

async function setPayment(request, reply) {
  const payInfo = request.body;
  const responseDB = await repository.setPayment(payInfo);
  if (responseDB.error) return reply.status(404).json(responseDB.error);
  reply.json(responseDB);
}

async function getHistoryByCpf(request, reply) {
  const cpf = request.query.cpf;
  if (!cpf) return reply.status(400).json({ error: "CPF obrigatório!" });
  const responseDB = await repository.getHistoryByCpf(cpf);
  if (responseDB.error) return reply.status(404).json(responseDB.error);

  reply.json(responseDB);
}

module.exports = { getAllFoods, getFoodById, setPayment, getHistoryByCpf };