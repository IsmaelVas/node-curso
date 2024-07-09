
const validator = require('validator')
const jwt = require('jsonwebtoken')


const validaContatos = (req, res, next) => {
    if (req.body.nome == '') {
        res.status(400).send('O nome deve ser informado')
        return
    }

    if (req.body.email == '') {
        res.status(400).send('O email deve ser informado')
        return
    }


    if (!validator.isEmail(req.body.email)) {
        res.status(400).send('O email está incorreto')
        return
    }

    next()

}

const validaCadastro = (req, res, next) => {
    if (req.body.password == '') {
        res.status(400).send('A senha deve ser informada')
        return
    }

    if (req.body.password.length < 3) {
        res.status(400).send('A senha deve conter mais de 3 caracter')
        return
    }

    const perfis = ['Gerente', 'Coordenador', 'Supervisor', 'Gestora', 'Operador']
    if(req.body.perfil == '') {
        res.status(400).send('O perfil deve ser informado')
        return
    }

    const retorno = perfis.find(p => p == req.body.perfil)
    if (retorno == undefined) {
        res.status(400).send('O perfil informado não existe')
    }

    next()
}

const validaProdutos = (req, res, next) => {
    if (req.body.nome == '') {
        res.status(400).send('O nome deve ser informado')
        return
    }

    if (req.body.preco == '') {
        res.status(400).send('O preço deve ser informado')
        return
    }

    if (req.body.estoque == '') {
        res.status(400).send('O estoque deve ser informado')
    }

    next()
}

const verificaToken = (req, res, next) => {
    let token = req.headers['x-code-access']
    if(!token){
        res.status(400).send('Precisa estar logado')
    }else {
        let decoded = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decoded.perfil);
        if(req.method == "DELETE" & decoded.perfil != "Supervisor"){
            res.status(401).send('Precisa ser supervisor para cadastrar.')
        }
        next()
    }
}

module.exports = {validaContatos, validaCadastro ,validaProdutos, verificaToken}