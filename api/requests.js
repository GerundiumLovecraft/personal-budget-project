const envelopeRouter = require('express').Router();

const { request } = require('express');
const {
    setBudget,
    getMonthlyBudget,
    createEnvelope,
    createSpendingRecord,
    getAllEnvelopes,
    getEnvelopeById,
    getAllSpendingRecords,
    getSpendingById,
    transferBudget,
    deleteSpendingRecord,
    deleteEnvelopeById,
    clearMonthlyBudget
} = require('./envelope_methods.js')

envelopeRouter.get('/', (req, res) => {
    res.send(getAllEnvelopes());
});

envelopeRouter.get('/budget', (req, res) => {
    res.send(getMonthlyBudget());
});

envelopeRouter.get('/:envelopeId', (req, res) => {
    res.send(getEnvelopeById(req.params.envelopeId));
});

envelopeRouter.get('/:envelopeId/spendingRecords', (req, res) => {
    res.send(getAllSpendingRecords(req.params))
});

envelopeRouter.get('/:envelopeId/spendingRecords/:spendingRecordId', (req, res) => {
    res.send(getSpendingById(req.params))
});

envelopeRouter.post('/budget', (req, res) => {
    res.status(201).send(setBudget(req.body.salary));
});

envelopeRouter.post('/', (req, res) => {
    const newEnvelope = createEnvelope(req.body);
    if (newEnvelope) {
        res.status(201).send(newEnvelope);
    } else {
        res.status(500).send("Insuficcient funds")
    }
    

});

envelopeRouter.post('/:envelopeId/spendingRecords', (req, res) => {
    const newSpendingRecord = createSpendingRecord(req.body)
    if (newSpendingRecord) {
        res.status(201).send(newSpendingRecord)
    } else {
        res.status(500).send("You have exceeded you envelope budget!")
    }
    
});

envelopeRouter.put('/:envelopeId', (req, res) => {
    if (transferBudget(req.body)) {
        res.sendStatus(200)
    } else {
        res.status(500).send("Insuficcient funds!")
    }
});

envelopeRouter.delete('/:envelopeId/spendingRecords/:spendingRecordId', (req, res) => {
    if (deleteSpendingRecord(req.params)) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404)
    }
});

envelopeRouter.delete('/:envelopeId', (req, res) => {
    if(deleteEnvelopeById(req.params.envelopeId)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
});

envelopeRouter.delete('/', (req, res) => {
    if (clearMonthlyBudget()) {
        res.sendStatus(204);
    } else {
        res.sendStatus(500)
    }
});

module.exports = envelopeRouter;
