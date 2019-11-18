const advanceResult = (model, populate) => async (req, res, next) => {
  const { query: reqQuery } = req;
  const { select, sort, page, limit } = reqQuery;

  let query;
  let selectFields;
  let sortBy = '-createdAt';

  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(field => delete reqQuery[field]);

  if (reqQuery) {
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = JSON.parse(queryStr);
  }

  if (select) {
    selectFields = select.split(',').join(' ');
  }

  if (sort) {
    sortBy = sort.split(',').join(' ');
  }

  // Pagination
  const pageNumber = +page || 1;
  const limitForPage = +limit || 10;
  const startIndex = (pageNumber - 1) * limitForPage;
  const endIndex = pageNumber * limitForPage;
  const total = await model.countDocuments();

  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: pageNumber + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: pageNumber - 1,
      limit
    };
  }

  const result = await model
    .find(query)
    .populate(populate)
    .select(selectFields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limitForPage);

  res.advanceResult = {
    success: true,
    count: result.length,
    pagination,
    data: result
  };

  next();
};

module.exports = advanceResult;
