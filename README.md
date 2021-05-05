# Points-API

## API DOCUMENTATION
The Points API is used to track the points per payer spent by a particular user and get their remaining balances for each specific payer the user has transacted. 

### SETUP
#### PREREQUISITES
1. Install Node.js version 10 or greater : [Link](https://nodejs.org/en/)
2. Clone this repository 
3. Install the dependencies required to run the application: **npm install**
4. Run the server.js file(the server is run on port 3000): **node server.js**

#### ENDPOINTS

1. /addPoint - POST request to add transactions for a specific payer and date. <br/> Sample input for REQUEST.BODY : { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }
2. /spendPoints - POST request which returns a list of payer and points for each call.
3. /listAll - GET request which returns all the payer details.
4. /getBalance - GET request which returns all the updated balances after points spent. 

The endpoints can also be tested on Swagger playground on the server:
**localhost:3000/docs**
