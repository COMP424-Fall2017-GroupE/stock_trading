# COMP 424 Client-Side Web Design Fall 2017
## Project Assignment: Stock Trading Simulator
### DEV Week Report - GROUP E

We decided to adapt the stock trading project to fit the requirements for trading stock. The first step we considered was to determine the main functionality and user interactions for our application, which are as follows:
* register in the system
* log in to the system
* request a quote for a particular stock
* perform "buy stocks" operation
* perform "sell stocks" operation
* log out of the system

We consider the following basic content for our application:

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

We decided initially that we will be having 4 pages:
 * the first would be the login page which would help the user to sign in or register to our application
 * the second page we considered would be our main page (home page) which include the following details:
    * allow the user to review their current portfolio
    * navigate to the other pages
 * the third page is our quote page which is intended for getting current quotes for a stock and once a quote is obtained it would allow the user to buy or sell a certain amount of stock
 * the final page would be the history page allowing the user to a display of the transactions history.

After having developed the mockups of the pages, we decided to embed the trade history into the homepage, though.

We started our application from the [HTML5 Boilerplate](https://html5boilerplate.com/) template. For now we have created the Login page and the Dashboard page. The latter together with a respective Javascript is responsible for our basic functionality as follows:
- The application is able to fetch and render current quotes from Yahoo finance according to the user ticker symbol input
- There is a chart widget for a stock that has been requested by the user (with the use of https://www.tradingview.com/widget/advanced-chart/)
- Prototypes for "trading" and "history": a user is able to input quantity and deal type, and the application renders simple messages about how many stocks have been "bought/sold" and at what price (a prototype for the history).

It is important to mention that we are inclined to be consistent with the mockups in terms of styling, too. We have created respective CSS schemes for our pages that are located in separate .css files.

We have uploaded all the source code to GitHub. All team members have access to it and the ability to check its progress.

