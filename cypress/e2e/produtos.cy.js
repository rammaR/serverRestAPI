const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const randomProduct = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
const randomEmail = randomName + "@email.com";
const password = "teste";

var userID;
var token;

describe('Cadastro simples de produtos', () => {

    it('usuário deve ser cadastrado com campos obrigatórios válidos', () => {
        cy.request({
            url: '/usuarios',
            method: 'POST',
            form: true,
            body: {
                nome: randomName,
                email: randomEmail,
                password: password,
                administrador: true
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            userID = response.body._id;
        })
    })

    it('Deve-se autenticar com email e senha válidos', () => {
        cy.request({
            method: 'POST',
            url: '/login',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: {
                email: randomEmail,
                password: password
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            token = response.body.authorization;
        })
    })

    it('Cadastra produto, se estiver autenticado', () => {
        cy.request({
            method: 'POST',
            url: '/produtos',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                "nome": randomProduct,
                "preco": 470,
                "descricao": randomProduct,
                "quantidade": 381
            })
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('message', "Cadastro realizado com sucesso");
        })
    })

})