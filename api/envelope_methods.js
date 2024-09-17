const monthlyBudget = {
    name: 'Your budget',
    budget: 0,
    remainder: 0,
    envelopes: []
}

let uniqueEnvelopeIdCounter = 0;
let uniqueSpendingRecordIdCounter = 0;

// sets a budget for this month
const setBudget = (salary) => {
    monthlyBudget.budget = salary;
};

// returns monthly budget and remainder
const getMonthlyBudget = () => {
    return monthlyBudget;
};

// creates an envelope
const createEnvelope = (item) => {
    uniqueEnvelopeIdCounter++

    const newEnvelope = {
        envelopeId: uniqueEnvelopeIdCounter,
        name: item.name,
        budget: item.envelopeBudget,
        totalSpent: 0,
        spendingRecords: []
    }

    
    if(calculateMonthlyRemainder(newEnvelope)) {
        monthlyBudget.envelopes.push(newEnvelope);
        return newEnvelope
    } else {
        return false
    }

};

// calculates monthly budget's remainder
const calculateMonthlyRemainder = (envelope) => {

    let remainder = 0;

    if (monthlyBudget.envelopes.length === 0) {
        remainder = monthlyBudget.budget - envelope.budget;
    } else {
        remainder = monthlyBudget.remainder - envelope.budget;
    }
    
    if (remainder >= 0) {
        monthlyBudget.remainder = remainder;
        return true;
    } else {
        return false;
    }

}

// calculates remainder
const calculateEnvelopeSpent = (envelope, newRecord) => {

    const envelopeBudget = envelope.budget;

    const newTotalSpent = envelope.totalSpent + newRecord.spentAmount;

    if (envelopeBudget >= newTotalSpent) {
        envelope.totalSpent = newTotalSpent;
        return true;
    } else {
        envelope.totalSpent = newTotalSpent;
        return false;
    }

};

// creates a record that money from a certain envelope were spent
const createSpendingRecord = (item) => {
    const envelopeOfInterest = getEnvelopeById(item.envelopeId);
    if (envelopeOfInterest.totalSpent < envelopeOfInterest.budget) {
        uniqueSpendingRecordIdCounter++;

        let additionalInfo = 'No info';
    
        if (item.details.length >0) {
            additionalInfo = item.details;
        }
    
        const newSpendingRecord = {
            recordId: uniqueSpendingRecordIdCounter,
            date: item.date,
            spentAmount: item.sum,
            info: additionalInfo
        }
    
        envelopeOfInterest.spendingRecords.push(newSpendingRecord);
    
        if (calculateEnvelopeSpent(envelopeOfInterest, newSpendingRecord)) {
            return newSpendingRecord
        } else {
            return false;
        };
    } else {
        return false;
    };
};

// returns a list of existing envelopes
const getAllEnvelopes = () => {
        return monthlyBudget.envelopes;
};

// return an envelope with a certain ID
const getEnvelopeById = (id) => {
    let envelopeLoc = 0;
    for (const envelope in monthlyBudget.envelopes) {
        if (monthlyBudget.envelopes[envelope].envelopeId === id) {
            envelopeLoc = monthlyBudget.envelopes.indexOf(monthlyBudget.envelopes[envelope]);
        }
    }
    return monthlyBudget.envelopes[envelopeLoc];
};

// returns all spendingRecords
const getAllSpendingRecords = (envelopeId) => {
    const envelope = getEnvelopeById(envelopeId);

    return envelope.spendingRecords;
}

// finds spending record by its id
const getSpendingById = (item) => {
    const envelope = getEnvelopeById(item.envelopeId);
    const recordId = item.spendingRecordId;

    let recordLoc = 0;


    if (envelope.spendingRecords.length === 0) {
        return "No records found";
    } else {
        for (const record in envelope.spendingRecords) {
            if (envelope.spendingRecords[record].recordId === recordId) {
                recordLoc = envelope.spendingRecords.indexOf(envelope.spendingRecords[record]);
            }
        }
    }

    if (recordLoc !== -1) {
        return envelope.spendingRecords[recordLoc];
    } else {
        return false;
    }
};

// helps to transfer budget money from one envelope to another
const transferBudget = (item) => {
    const fromEnvelope = getEnvelopeById(item.from);
    const toEnvelope = getEnvelopeById(item.to);
    const amount = item.amount;

    if (validateTransfer(fromEnvelope, amount)) {
        fromEnvelope.budget -= amount;
        toEnvelope.budget += amount;
        return true;
    } else {
        return false;
    }
    

};

// checks if transferring money from envelope will not result in an overspent state
const validateTransfer = (envelopeFrom, amount) => {

    const currentAmountSpent = envelopeFrom.totalSpent;
    const totalBudget = envelopeFrom.budget;
    const afterTransfer = totalBudget - amount;
    if (currentAmountSpent === 0) {
        if (afterTransfer <= 0) {
            return false
        } else {
            return true;
        };
    } else {
        if (afterTransfer < currentAmountSpent && afterTransfer <= 0) {
            return false;
        } else {
            return true;
        };
    };

};

// deletes spending record
const deleteSpendingRecord = (item) => {
    const envelope = getEnvelopeById(item.envelopeId);
    const recordId = item.spendingRecordId
    let totalSpentBefore = envelope.totalSpent

    let recordLoc = 0;

    for (const record in envelope.spendingRecords) {
        if (envelope.spendingRecords[record].recordId == recordId) {
            recordLoc = envelope.spendingRecords.indexOf(envelope.spendingRecords[record]);
        }
    }

    if (recordLoc !== -1) {
        envelope.totalSpent = totalSpentBefore - envelope.spendingRecords[recordLoc].spentAmount;
        envelope.spendingRecords.splice(recordLoc, 1);
        return true;
    } else {
        return false;
    }

};

// deletes an envelope with a certain ID
const deleteEnvelopeById = (id) => {
    let envelopeLoc = 0;
    let updateRemainder = monthlyBudget.remainder;

    for (const envelope in monthlyBudget.envelopes) {
        if (monthlyBudget.envelopes[envelope].envelopeId == id) {
            envelopeLoc = monthlyBudget.envelopes.indexOf(monthlyBudget.envelopes[envelope]);
        }
    }

    if (envelopeLoc != -1) {
        monthlyBudget.remainder = updateRemainder + monthlyBudget.envelopes[envelopeLoc].budget;
        monthlyBudget.envelopes.splice(envelopeLoc, 1);
        return true;
    } else {
        return false; 
    }

};

// clears full record
const clearMonthlyBudget = () => {
    monthlyBudget.budget = 0;
    monthlyBudget.remainder = 0;
    monthlyBudget.envelopes = []

    if (monthlyBudget.budget === 0 && monthlyBudget.envelopes == 0) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    setBudget,
    calculateMonthlyRemainder,
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
}