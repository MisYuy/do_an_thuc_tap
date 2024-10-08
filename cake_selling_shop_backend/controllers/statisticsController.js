const { Order, OrderItem, Product } = require('../models');
const { Op } = require('sequelize');

// Helper function to add months to a date
function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

// Helper function to subtract months from a date
function subtractMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() - months);
    return d;
}

// Helper function to add days to a date
function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

// Helper function to subtract days from a date
function subtractDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() - days);
    return d;
}

// Helper function to add hours to a date
function addHours(date, hours) {
    const d = new Date(date);
    d.setHours(d.getHours() + hours);
    return d;
}

// Helper function to subtract hours from a date
function subtractHours(date, hours) {
    const d = new Date(date);
    d.setHours(d.getHours() - hours);
    return d;
}

// Helper function to get the start of the quarter
function startOfQuarter(year, quarter) {
    const month = (quarter - 1) * 3;
    return new Date(year, month, 1);
}

// Helper function to get the end of the quarter
function endOfQuarter(year, quarter) {
    const month = quarter * 3;
    return new Date(year, month, 0, 23, 59, 59, 999);
}

exports.calculateRevenueByHour = async (req, res) => {
    try {
        let { dateFrom, dateTo } = req.query; // Date format: 'YYYY-MM-DDTHH'

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ error: 'Both dateFrom and dateTo are required' });
        }

        // Adjust dateFrom and dateTo
        dateFrom = subtractHours(new Date(dateFrom), 1).toISOString();
        dateTo = addHours(new Date(dateTo), 1).toISOString();

        const orders = await Order.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(dateFrom),
                    [Op.lt]: new Date(dateTo)
                }
            },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            }]
        });

        let revenueByHour = {};

        orders.forEach(order => {
            const hour = order.created_at.toISOString().slice(0, 13); // Extract hour from order creation date
            if (!revenueByHour[hour]) {
                revenueByHour[hour] = 0;
            }

            order.OrderItems.forEach(orderItem => {
                revenueByHour[hour] += orderItem.Product.price * orderItem.quantity;
            });
        });

        const sortedRevenueByHour = Object.entries(revenueByHour).sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const revenueByHourObject = sortedRevenueByHour.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        res.json({ revenue_by_hour: revenueByHourObject });
    } catch (error) {
        console.error('Error calculating revenue by hour:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateRevenueByDay = async (req, res) => {
    try {
        let { dateFrom, dateTo } = req.query; // Date format: 'YYYY-MM-DD'

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ error: 'Both dateFrom and dateTo are required' });
        }

        // Adjust dateFrom and dateTo
        dateFrom = subtractDays(new Date(dateFrom), 1).toISOString().slice(0, 10);
        dateTo = addDays(new Date(dateTo), 1).toISOString().slice(0, 10);

        const orders = await Order.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(dateFrom),
                    [Op.lt]: new Date(dateTo)
                }
            },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            }]
        });

        let revenueByDay = {};

        orders.forEach(order => {
            const day = order.created_at.toISOString().slice(0, 10); // Extract day from order creation date
            if (!revenueByDay[day]) {
                revenueByDay[day] = 0;
            }

            order.OrderItems.forEach(orderItem => {
                revenueByDay[day] += orderItem.Product.price * orderItem.quantity;
            });
        });

        const sortedRevenueByDay = Object.entries(revenueByDay).sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const revenueByDayObject = sortedRevenueByDay.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        res.json({ revenue_by_day: revenueByDayObject });
    } catch (error) {
        console.error('Error calculating revenue by day:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateRevenueByMonthRange = async (req, res) => {
    try {
        let { dateFrom, dateTo } = req.query; // Date format: 'YYYY-MM'

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ error: 'Both dateFrom and dateTo are required' });
        }

        // Adjust dateFrom and dateTo
        dateFrom = subtractMonths(new Date(dateFrom + '-01'), 1).toISOString().slice(0, 7);
        dateTo = addMonths(new Date(dateTo + '-01'), 1).toISOString().slice(0, 7);

        const orders = await Order.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(dateFrom + '-01'), // Get orders created on or after the start of adjusted dateFrom month
                    [Op.lt]: new Date(dateTo + '-01') // Get orders created before the start of adjusted dateTo month
                }
            },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            }]
        });

        let revenueByMonth = {};

        orders.forEach(order => {
            const monthYear = order.created_at.toISOString().slice(0, 7); // Extract month and year from order creation date
            if (!revenueByMonth[monthYear]) {
                revenueByMonth[monthYear] = 0;
            }

            order.OrderItems.forEach(orderItem => {
                revenueByMonth[monthYear] += orderItem.Product.price * orderItem.quantity;
            });
        });

        // Convert object to array and sort by time
        const sortedRevenueByMonth = Object.entries(revenueByMonth).sort((a, b) => new Date(a[0]) - new Date(b[0]));

        // Convert sorted array back to object
        const revenueByMonthObject = sortedRevenueByMonth.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        res.json({ revenue_by_month: revenueByMonthObject });
    } catch (error) {
        console.error('Error calculating revenue by month range:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateRevenueByQuarter = async (req, res) => {
    try {
        let { dateFrom, dateTo } = req.query; // Date format: 'YYYY-QX'

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ error: 'Both dateFrom and dateTo are required' });
        }

        // Parse the quarters
        const [yearFrom, quarterFrom] = dateFrom.split('-Q').map(Number);
        const [yearTo, quarterTo] = dateTo.split('-Q').map(Number);

        // Get the start and end dates of the quarters
        const startDate = subtractMonths(startOfQuarter(yearFrom, quarterFrom), 3);
        const endDate = addMonths(endOfQuarter(yearTo, quarterTo), 3);

        const orders = await Order.findAll({
            where: {
                created_at: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            }]
        });

        let revenueByQuarter = {};

        orders.forEach(order => {
            const quarter = `Q${Math.floor((order.created_at.getMonth() + 3) / 3)}-${order.created_at.getFullYear()}`;
            if (!revenueByQuarter[quarter]) {
                revenueByQuarter[quarter] = 0;
            }

            order.OrderItems.forEach(orderItem => {
                revenueByQuarter[quarter] += orderItem.Product.price * orderItem.quantity;
            });
        });

        const sortedRevenueByQuarter = Object.entries(revenueByQuarter).sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const revenueByQuarterObject = sortedRevenueByQuarter.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        res.json({ revenue_by_quarter: revenueByQuarterObject });
    } catch (error) {
        console.error('Error calculating revenue by quarter:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateRevenueByYear = async (req, res) => {
    try {
        let { dateFrom, dateTo } = req.query; // Date format: 'YYYY'

        if (!dateFrom || !dateTo) {
            return res.status(400).json({ error: 'Both dateFrom and dateTo are required' });
        }

        // Adjust dateFrom and dateTo
        dateFrom = subtractMonths(new Date(dateFrom + '-01-01'), 12).toISOString().slice(0, 4);
        dateTo = addMonths(new Date(dateTo + '-01-01'), 12).toISOString().slice(0, 4);

        const orders = await Order.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(dateFrom + '-01-01'),
                    [Op.lt]: new Date(dateTo + '-01-01')
                }
            },
            include: [{
                model: OrderItem,
                include: [{
                    model: Product,
                    attributes: ['price']
                }]
            }]
        });

        let revenueByYear = {};

        orders.forEach(order => {
            const year = order.created_at.getFullYear();
            if (!revenueByYear[year]) {
                revenueByYear[year] = 0;
            }

            order.OrderItems.forEach(orderItem => {
                revenueByYear[year] += orderItem.Product.price * orderItem.quantity;
            });
        });

        const sortedRevenueByYear = Object.entries(revenueByYear).sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const revenueByYearObject = sortedRevenueByYear.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        res.json({ revenue_by_year: revenueByYearObject });
    } catch (error) {
        console.error('Error calculating revenue by year:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateStatisticsByProduct = async (req, res) => {
    try {
        let { dateFrom, dateTo, productId } = req.query; // Date format: 'YYYY-MM'

        if (!dateFrom || !dateTo || !productId) {
            return res.status(400).json({ error: 'dateFrom, dateTo, and productId are required' });
        }

        // Adjust dateFrom and dateTo
        dateFrom = subtractMonths(new Date(dateFrom + '-01'), 1).toISOString().slice(0, 7);
        dateTo = addMonths(new Date(dateTo + '-01'), 1).toISOString().slice(0, 7);

        const orders = await Order.findAll({
            where: {
                created_at: {
                    [Op.gte]: new Date(dateFrom + '-01'), // Get orders created on or after the start of adjusted dateFrom month
                    [Op.lt]: new Date(dateTo + '-01') // Get orders created before the start of adjusted dateTo month
                }
            },
            include: [{
                model: OrderItem,
                where: {
                    product_id: productId
                },
                include: [{
                    model: Product,
                    attributes: ['product_id', 'name', 'price']
                }]
            }]
        });

        let statisticsByProduct = {
            product_id: productId,
            name: '',
            monthly_data: {}
        };

        orders.forEach(order => {
            const monthYear = order.created_at.toISOString().slice(0, 7); // Extract month and year from order creation date
            if (!statisticsByProduct.monthly_data[monthYear]) {
                statisticsByProduct.monthly_data[monthYear] = {
                    total_revenue: 0,
                    total_quantity: 0
                };
            }

            order.OrderItems.forEach(orderItem => {
                const { name, price } = orderItem.Product;
                statisticsByProduct.name = name;
                statisticsByProduct.monthly_data[monthYear].total_revenue += price * orderItem.quantity;
                statisticsByProduct.monthly_data[monthYear].total_quantity += orderItem.quantity;
            });
        });

        const sortedMonthlyData = Object.entries(statisticsByProduct.monthly_data).sort((a, b) => new Date(a[0]) - new Date(b[0]));
        statisticsByProduct.monthly_data = Object.fromEntries(sortedMonthlyData);

        res.json(statisticsByProduct);
    } catch (error) {
        console.error('Error calculating statistics by product:', error);
        res.status(500).json({ error: error.message });
    }
};
