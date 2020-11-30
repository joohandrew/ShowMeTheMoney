import express from "express";
import papa from "papaparse";
import fs, { PathLike } from "fs";

const app = express();

app.get('/', async function (req, res) {
    await parseCSV()
        .then((data) => {
            res.send(data);
        })
        .catch(e => {
            res.send(e);
        })
})

app.listen(3001, () => {
    console.log("App started on port 3001");
});

async function parseCSV() {
    const path = './bank_statements/TRANSACTION_CSV_TEMPLATE.csv';
    if (checkFileExists(path)) {
        const file = fs.readFileSync(path, 'utf8');
        const transactions: any[] = [];
        papa.parse(file, {
            header: true,
            step: (results, parser) => {
                transactions.push(results.data)
                console.log("Row Errors", results.errors);
            },
            complete: (results) => {
                console.log("Parsing complete!");
            }
        });
        console.log('Transactions', transactions);
        return transactions;
    }
}

async function checkFileExists(path: PathLike) {
    return fs.promises.stat(path)
        .then(() => {
            return true;
        })
        .catch(e => {
            throw e
        })
}