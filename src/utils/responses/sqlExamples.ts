export interface SQLExample {
  query: string;
  explanation: string;
  result?: string;
}

export const sqlExamples: Record<string, SQLExample> = {
  "select": {
    query: `SELECT column1, column2
FROM table_name
WHERE condition;`,
    explanation: "The SELECT statement is used to retrieve data from a database. You specify which columns you want to see, the table to get them from, and any conditions to filter the results."
  },
  "join": {
    query: `SELECT orders.order_id, customers.customer_name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id;`,
    explanation: "JOIN clauses are used to combine rows from two or more tables based on a related column between them. This example shows how to connect orders with customer information."
  },
  "group by": {
    query: `SELECT category, COUNT(*) as total
FROM products
GROUP BY category;`,
    explanation: "GROUP BY is used to group rows that have the same values in specified columns into summary rows. This example counts how many products are in each category."
  }
};