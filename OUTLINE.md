## Initial pages
We consider the following pages for our application:

1. Login page
 * sign in to the system
 * register and set up login and password

2. Main page
 * initial, home page of the application
 * lets a user to review their current portfolio
 * allows a user to navigate to either Quote or History pages

3. Quote page
 * this page is intended for getting current quotes for a specific stock
 * once a fresh quote is obtained, a user should be able to buy or sell a certain amount of this stock

4. History page
 * display transactions history
 
## Content
We consider the following basic content:

1. User's current portfolio
 * ticker symbol
 * amount
 * current market value

2. Current quotes for particular stocks
 * stocks are identified by their ticker symbols (AAPL = Apple Inc.)
 * probable use of Yahoo finance as a source

3. Transactions history
 * in table form
 * transaction date (and probably time)
 * ticker symbol
 * transaction type (buy / sell)
 * transaction amount
 * transaction price
 
## Required user interaction
We consider the following main user interactions within our application:

* register in the system
* log in to the system
* request a quote for a particular stock
* perform "buy stocks" operation
* perform "sell stocks" operation
* log out of the system

## Navigation
The navigation within our application should comply with the following:

* a user always starts from the Login page
* Login page redirects a user to the Main page
* a user is able to open both Quote page and History page from the Main page
* a user should be able to get to the Quote page from the History page by clicking on one of the transactions
* it is possible to navigate from the Quote page to the History page
* each page allows a user to return back to the previous page by clicking on a respective "Back" button

