const createHttpError = require('http-errors');
const Card = require('../models/Card');
const { colors } = require('../utils/staticDtata');
const {lineChartDateFormat} = require("../utils/formatDate");

// Dashboard
const getPieChartDataService = async (req) => {
  try {
    const { startDate, endDate, days } = req.query;
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date(endDate);
      if (days) {
        start = new Date();
        start.setDate(end.getDate() - days);
      } else {
        start = new Date();
        start.setDate(end.getDate() - 30); // Default to last 30 days
      }
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const data = await Card.aggregate([
      {
        $match: {
          archived: false,
          isTrashed: false,
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: '$status', // Group by status
          count: { $sum: 1 }, // Count the number of orders in each group
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id', // Include the status in the result
          count: 1, // Include the count in the result
        },
      },
    ]);

    const result = data.map((item) => ({
      name: item.status,
      value: item.count,
      fill: colors[item.status],
    }));
    return { status: 'success', data: result };
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const getTotalCardsCountService = async (req) => {
  try {
    const { startDate, endDate, days } = req.query;
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date(endDate);
      if (days) {
        start = new Date()
        start.setDate(end.getDate() - days);
      } else {
        start = new Date();
        start.setDate(end.getDate() - 30); // Default to last 30 days
      }
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const cardCounts = await Card.aggregate([
      {
        $match: {
          archived: { $ne: true },
          isTrashed: { $ne: true },
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $facet: {
          totalCards: [{ $count: 'count' }],
          readyForInstallment: [
            { $match: { status: 'מוכן להתקנה' } },
            { $count: 'count' },
          ],
          inInstallment: [
            { $match: { status: 'בהתקנה' } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    return {
      status: 'success',
      data: {
        totalCards: cardCounts[0].totalCards[0]
          ? cardCounts[0].totalCards[0].count
          : 0,
        inInstallment: cardCounts[0].inInstallment[0]
          ? cardCounts[0].inInstallment[0].count
          : 0,
        readyForInstallment: cardCounts[0].readyForInstallment[0]
          ? cardCounts[0].readyForInstallment[0].count
          : 0,
      },
    };

  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const getNearestDeadlineOrdersService = async () => {
  try {
    let MatchStage = {
      $match: {
        archived: { $ne: true },
        isTrashed: { $ne: true },
      },
    };
    const JoinWithOrderStage= {$lookup:{from:"orders",localField:"orderID",foreignField:"_id",as:"order"}};
    let UnwindOrderStage={$unwind:"$order"}
    const ProjectionStage = {
      $project: {
        orderID: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        'type._id': 0,
        'client._id': 0,
        'address._id': 0,
        'order._id': 0,
        'order.createdAt': 0,
        'order.updatedAt': 0,
      },
    };
    const AddExtraFieldsStage = {
      $addFields: {
        id: '$_id',
      },
    };
    const sortingStage = {
      $sort: {
        dueDate: 1, // Sort by dueDate in ascending order
      },
    };
    const limitStage = {
      $limit: 5, // Limit the results to 5 orders
    };
    const data = await Card.aggregate([
      MatchStage,
      JoinWithOrderStage,
      UnwindOrderStage,
      AddExtraFieldsStage,
      ProjectionStage,
      sortingStage,
      limitStage,
    ]);
    return { status: 'success', data };
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};
const getLineChartDataService = async (req) => {
  try {
    const { startDate, endDate, days } = req.query;
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date(endDate);
      if (days) {
        start = new Date();
        start.setDate(end.getDate() - days);
      } else {
        start = new Date();
        start.setDate(end.getDate() - 30); // Default to last 30 days
      }
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const cards = await Card.aggregate([
      {
        $match: {
          archived: { $ne: true },
          isTrashed: { $ne: true },
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
            },
            type: '$type.name',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.date',
          cards: {
            $push: {
              type: '$_id.type',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          day: { $dayOfMonth: { $dateFromString: { dateString: '$_id' } } },
          cards: 1,
        },
      },
    ]);
    // Extract unique product types
    const productTypes = await Card.distinct('type.name', {
      archived: { $ne: true },
      orderDate: {
        $gte: start,
        $lte: end,
      },
    });

    // Generate the complete date range
    const completeDateRange = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      completeDateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    // Create a map of dates to orders for quick lookup
    const cardsMap = cards.reduce((map, card) => {
      map[card.date] = card.cards.reduce((cardMap, o) => {
        cardMap[o.type] = o.count;
        return cardMap;
      }, {});
      return map;
    }, {});
    // Transform the result to the desired format
    const formattedResult = completeDateRange.map((date) => {
      const dateString = lineChartDateFormat(date.toLocaleDateString('en-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }))
      const formattedDate = `${date.getDate()} ${date.toLocaleString('he-IL', {
        month: 'long',
      })}, ${date.getFullYear()}`;

      const cardData = {
        date: formattedDate,
        day: date.getDate(),
      };
      productTypes.forEach((type) => {
        cardData[type] =
          cardsMap[dateString] && cardsMap[dateString][type]
            ? cardsMap[dateString][type]
            : 0;
      });

      return cardData;
    });

    return {
      status: 'success',
      data: { lineChartData: formattedResult, productTypes },
    };
  } catch (error) {
    throw new createHttpError.InternalServerError();
  }
};

module.exports = {
  getPieChartDataService,
  getTotalCardsCountService,
  getNearestDeadlineOrdersService,
  getLineChartDataService,
};
