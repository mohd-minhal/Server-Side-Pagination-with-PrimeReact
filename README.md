# React App with PrimeReact DataTable and Server-Side Pagination
This project is a React application built with TypeScript, Vite, and PrimeReact's DataTable component. It features server-side pagination and custom row selection functionality that persists across page changes.

## Features
DataTable Integration: Displays data using PrimeReact's DataTable component.

Server-Side Pagination: Fetches only the data for the current page from the server, reducing memory overhead. 
Data for each page is loaded only when the user navigates to that page, ensuring no preloading or excessive memory use.

Row Selection with Persistence: Users can select individual rows or all rows at once.
Row selections and deselections persist across different pages, even if the user navigates away and returns to a page later.

Custom Row Selection Panel: Displays selected rows in a custom panel outside the table, providing a clear overview of selected items.

## Key Considerations

Memory Efficiency: No variable is holding all fetched rows across different pages, which prevents memory overload.
API Call on Page Change: On every page change, the app calls the API to fetch the relevant page's data, even if the user revisits a previously viewed page.
Persistent Row Selection: The app ensures that row selections/deselections persist across pages by maintaining selection state outside of the DataTable component itself.

## Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/your-repo.git
cd your-repo
Install dependencies:

bash
Copy code
npm install
Run the development server:

bash
Copy code
npm run dev
Access the app at http://localhost:3000.

## Usage
Data Fetching: The app fetches paginated data from the server when the user navigates between pages.
Row Selection: Users can select rows using checkboxes, either one by one or all at once, and selections persist even when switching between pages.
Custom Selection Panel: The selected rows are displayed in a panel that persists across page changes.

## Example API Call
The app makes requests to the Art Institute of Chicago API to fetch artwork data:

bash
Copy code
https://api.artic.edu/api/v1/artworks?page=1
The API response includes artwork details such as the title, artist, and creation date, which are displayed in the DataTable.

## Dependencies
React: A JavaScript library for building user interfaces.
TypeScript: Typed superset of JavaScript that adds static types.
Vite: Next-generation front-end tooling.
PrimeReact: A rich set of open-source UI components for React.

## License
This project is licensed under the MIT License.
