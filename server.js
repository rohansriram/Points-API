var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
  swaggerDefinition: {
    info: {
      title: 'Points API',
      version: '1.0.0',
      description: 'Points API',

    },
    host: '127.0.0.1:3000',
    basePath: '/',
  },
  apis: ['./server.js'],

};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

/**
 * @swagger
 * /addPoint:
 *   post:
 *    summary: "Add Points per payer"
 *    description: Request to add transactions for a specific payer and date
 *    parameters:
 *      - in: body
 *        name: user
 *        description: Accepts json format of payer, points and the timestamp
 *        schema:
 *         type: object
 *         required:
 *           - payer
 *           - points
 *           - timestamp
 *         properties:
 *            payer:
 *               type: string
 *            points:
 *               type: integer
 *            timestamp:
 *               type: string 
 *    responses:
 *          200:
 *              description: Transaction per payer added
 *          400:
 *              description: Invalid data
 */

/**
 * @swagger
 * /spendPoints:
 *   post:
 *    summary: "Spend points based on the rules specified"
 *    description: Request which returns a list of payer and points for each call
 *    parameters:
 *      - in: body
 *        name: user
 *        description: Accepts points<integer> input as a JSON. 
 *        schema:
 *         type: object
 *         required:
 *           - points
 *         properties:
 *            points:
 *               type: integer
 *    responses:
 *          200:
 *              description: Returns a list of payer and points for each call
 *          400:
 *              description: Invalid data
 */
/**
 * @swagger
 * /listAll:
 *   get:
 *    summary: "List all payers added"
 *    description: Returns all the payers details
 *    produces:
 *          -application/json
 *    responses:
 *          200:
 *              description: Object array of companies
 */

/**
 * @swagger
 * /getBalance:
 *   get:
 *    summary: "Get the balance after spending points"
 *    description: Return all updated balances
 *    produces:
 *          -application/json
 *    responses:
 *          200:
 *              description: Object array of updated balances
 */
 

let payer_list = []
let payer = {}
let spent = {}
let points_bank = 0

class PayerPoint {
  constructor(payer_name, points, date){
    this.payer_name = payer_name;
    this.points = points;
    this.timestamp = date;
  }
}

//Request to add transactions for a specific payer and date
app.post('/addPoint',(req,res) => {
   try{
        let i = new PayerPoint(req.body.payer, req.body.points, req.body.timestamp);
        payer_list.push(i);
        points_bank += req.body.points
        if(req.body.payer in payer){
          payer[req.body.payer] += req.body.points;
        }
        else{
          payer[req.body.payer] = req.body.points;
        }
        return res.status(200).json(payer)
   }catch(e){
        res.status(400).json(e.body);
   }
    
});

//Request which returns a list of payer and points for each call
app.post('/spendPoints', (req, res)=>{
    try{
    let total = 0
    let spending = req.body.points
    
    if (points_bank >= spending){
        payer_list.sort(function(x, y){
          return new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime()
        })
        payer_list.map((payer_item)=>{
          let {payer_name, points, time} = payer_item
          if (total <= spending){
            if (total + points >= spending){
                points = spending - total
                total += points
                points_bank -= points
                if (payer_name in spent && payer[payer_name] > 0){
                  spent[payer_name] -= points
                  payer[payer_name] -= points
                }
                else{
                  if(payer[payer_name] > 0){
                    spent[payer_name] = -points
                  payer[payer_name] -= points
                  }
                }
            }
            else{
                total += points
                points_bank -= points
                  if (payer_name in spent && payer[payer_name] > 0){
                    spent[payer_name] -= points
                    payer[payer_name] -= points
                  }
                  else{
                    if(payer[payer_name] > 0){
                      spent[payer_name] = -points
                    payer[payer_name] -= points
                    }
                  }
            }
          }
        })
        return res.status(200).json(spent)
      }
    else{
      return res.status(400).json({
        "error": "Not Enough Points"
      })
    }
  }catch(e){
    res.status(400).json(e.body);
}

});

// get balance of the payers after spending points
app.get('/getBalance', (req, res)=>{
  return res.status(200).json(payer)
});

// lists all the payers with their transaction points and date
app.get('/listAll', (req, res) => {
      res.setHeader('Content-Type','application/json');
      res.status(200).json({
        count : payer_list.length,
        PointsList : payer_list.map(item => {
          return {
                "payer" : item.payer_name,
                "points" : item.points,
                "timestamp" : item.timestamp
          }
        })
      });
     
  });

  app.listen(port, () => console.log(`Points API Running on Port ${port}!`))