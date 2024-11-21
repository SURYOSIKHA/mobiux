const fs = require('fs');
const filePath = './icecream.csv';
let data = fs.readFileSync(filePath, 'utf-8');
data = data.split('\n');

// Function to calculate total sales
function totalSales(data) {
    let total = 0;
    for (let i = 1; i < data.length; i++) {
        if (data[i].trim() === '') continue; // Skip empty lines
        const row = data[i].split(',');
        const totalPrice = parseInt(row[4]); // Total Price column
        total += totalPrice;
    }
    return total;
}

// Function to calculate month-wise sales totals
function monthWiseSales(data) {
    const sales = {};
    for (let i = 1; i < data.length; i++) {
        if (data[i].trim() === '') continue;
        const row = data[i].split(',');
        const month = row[0].slice(0, 7); // Extract YYYY-MM
        const totalPrice = parseInt(row[4]);
        sales[month] = (sales[month] || 0) + totalPrice;
    }
    return sales;
}

// Function to find most popular item (most quantity sold) in each month
function mostPopularItems(data) {
    const items = {};
    for (let i = 1; i < data.length; i++) {
        if (data[i].trim() === '') continue;
        const row = data[i].split(',');
        const month = row[0].slice(0, 7); // Extract YYYY-MM
        const item = row[1];
        const quantity = parseInt(row[3]);

        if (!items[month]) items[month] = {};
        items[month][item] = (items[month][item] || 0) + quantity;
    }

    const popularItems = {};
    for (const month in items) {
        popularItems[month] = Object.keys(items[month]).reduce((a, b) =>
            items[month][a] > items[month][b] ? a : b
        );
    }
    return popularItems;
}

// Function to find items generating most revenue in each month
function highestRevenueItems(data) {
    const revenue = {};
    for (let i = 1; i < data.length; i++) {
        if (data[i].trim() === '') continue;
        const row = data[i].split(',');
        const month = row[0].slice(0, 7); // Extract YYYY-MM
        const item = row[1];
        const totalPrice = parseInt(row[4]);

        if (!revenue[month]) revenue[month] = {};
        revenue[month][item] = (revenue[month][item] || 0) + totalPrice;
    }

    const highestRevenue = {};
    for (const month in revenue) {
        highestRevenue[month] = Object.keys(revenue[month]).reduce((a, b) =>
            revenue[month][a] > revenue[month][b] ? a : b
        );
    }
    return highestRevenue;
}

// Function to find min, max, and average orders for the most popular item
function popularityStats(data) {
    const stats = {};
    const orders = {};

    for (let i = 1; i < data.length; i++) {
        if (data[i].trim() === '') continue;
        const row = data[i].split(',');
        const month = row[0].slice(0, 7); // Extract YYYY-MM
        const item = row[1];
        const quantity = parseInt(row[3]);

        if (!orders[month]) orders[month] = {};
        if (!orders[month][item]) orders[month][item] = [];
        orders[month][item].push(quantity);
    }

    for (const month in orders) {
        const popularItem = Object.keys(orders[month]).reduce((a, b) =>
            orders[month][a].reduce((sum, x) => sum + x, 0) >
            orders[month][b].reduce((sum, x) => sum + x, 0)
                ? a
                : b
        );

        const quantities = orders[month][popularItem];
        stats[month] = {
            min: Math.min(...quantities),
            max: Math.max(...quantities),
            average: quantities.reduce((sum, x) => sum + x, 0) / quantities.length,
        };
    }
    return stats;
}

// Usage
console.log("Total Sales:", totalSales(data));
console.log("\nMonth-wise Sales Totals:", monthWiseSales(data));
console.log("\nMost Popular Items by Month:", mostPopularItems(data));
console.log("\nHighest Revenue Items by Month:", highestRevenueItems(data));
console.log(
    "\nPopularity Stats (Min, Max, Avg Orders) for Most Popular Items by Month:",
    popularityStats(data)
);
