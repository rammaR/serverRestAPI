const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
var userID;

describe('Cadastro simples de usuário', () => {
  it('usuário deve ser cadastrado com campos obrigatórios válidos', () => {
    cy.request({
      url: '/usuarios',
      method: 'POST',
      form: true,
      body: {
        nome: randomName,
        email: randomName + "@email.com",
        password: "teste",
        administrador: true
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      userID = response.body._id;
      cy.log(userID);
      //expect(response).to.have.property('message')
    })
  })

  it("Buscar usuario pelo ID", () => {
    cy.request(({
      method: 'GET',
      url: `/usuarios/${userID}`,
      headers: {
        'Accept': 'application/json'
      }
    })).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('nome', randomName);
      expect(response.body).to.have.property("email", randomName + "@email.com");
      expect(response.body).to.have.property("password", "teste");
      expect(response.body).to.have.property("administrador", "true");
      expect(response.body).to.have.property("_id", userID);
    })
  })

  it("Editar usuario pelo ID", () => {
    cy.request(({
      method: 'PUT',
      url: `/usuarios/${userID}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        nome: randomName + '2',
        email: randomName + "2@email.com",
        password: "teste2",
        administrador: "false"
      }
    })).then((response) => {
      expect(response.body).to.have.property("message", "Registro alterado com sucesso");
    })
  })  

  it('Deletar usuario pelo ID', () => {
    cy.request(({
      method: 'DELETE',
      url: `/usuarios/${userID}`,
      headers: {
        'Accept': 'application/json'
      }
    })).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(userID);
      expect(response.body).to.have.property("message", "Registro excluído com sucesso");
    })
  })

  it('Usuario deletado não pode mais ser buscado', () => {
    cy.request(({
      method: 'GET',
      url: `/usuarios/${userID}`,
      headers: {
        "Accept": 'application/json'
      },
      failOnStatusCode: false
    })).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("message", "Usuário não encontrado");
    })
  })
})