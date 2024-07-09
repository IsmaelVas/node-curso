const express = require('express')
const router = express.Router()
const pool = require('./config')
const { validaProdutos } = require('./midlewares')

router.get('/', async (req, res) => {
    try {
        let produto = await pool.connect()
        let dados = await produto.query('select * from tb_produtos')
        produto.end()
        res.send(dados.rows)
    }catch (error) {
        res.send(error.menssage);
    }
})

router.post('/', validaProdutos, async (req, res) => {
     try {
        let produto = await pool.connect()
        await produto.query('insert into tb_produtos(nome, preco, estoque)values($1, $2, $3) RETURNING *',
        [req.body.nome, req.body.preco, req.body.estoque])
        produto.end()
        res.status(201).send('produto salvo com sucesso')
    }catch (error) {
        res.send(error.message)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        var produto = await pool.connect()
        await produto.query('delete from tb_produtos where id = $1', [req.params.id])
        produto.end()
        res.status(204).send('')
    }catch (error) {
        res.status(404).send(error.menssage)
    }
})

router.get('/:id', async (req, res) => {
    try {
        let produto = await pool.connect()
        let dados = await produto.query('select * from tb_produtos where id = $1',[req.params.id])

        produto.end()
        if (dados.rowCount > 0)
            res.status(200).send(dados.rows[0])
        else
            res.status(404).send('Contato não encontrado')
    } catch (error) {
        res.status(404).send(error.menssage)
    }
})

router.put('/:id', async (req, res) => {
    try {
        let produtos = await pool.connect()
        let dados = await produtos.query('select * from tb_produtos where id = $1', [req.params.id])

        if(dados.rowCount > 0){
            let novosValores = [req.body.nome, req.body.preco, req.body.estoque, req.params.id]
            await produtos.query('update tb_produtos set nome = $1, preco = $2, estoque = $3 where id = $4', novosValores)

            produtos.end()

            res.status(200).send('Produto alterado com sucesso')
        }else{
            res.status(404).send('Produto não encontrado')
        }
    }catch (error) {
        res.status(404).send(error.menssage)
    }
})

module.exports = router