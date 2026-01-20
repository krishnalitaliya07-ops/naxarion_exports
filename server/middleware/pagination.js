// Advanced pagination middleware
exports.paginate = (model) => async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(req.queryFilter || {});

  const pagination = {};

  // Add next page info
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  // Add previous page info
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  pagination.current = page;
  pagination.totalPages = Math.ceil(total / limit);
  pagination.totalResults = total;
  pagination.limit = limit;

  req.pagination = pagination;
  req.startIndex = startIndex;
  req.limit = limit;

  next();
};

// Advanced filtering
exports.advancedFilter = (req, res, next) => {
  let query = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['page', 'limit', 'sort', 'select', 'search'];
  removeFields.forEach(param => delete query[param]);

  // Create query string
  let queryStr = JSON.stringify(query);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  req.queryFilter = JSON.parse(queryStr);

  // Search functionality
  if (req.query.search) {
    req.searchQuery = req.query.search;
  }

  next();
};

// Sorting
exports.sorting = (req, res, next) => {
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    req.sortBy = sortBy;
  } else {
    req.sortBy = '-createdAt'; // Default sort by newest first
  }
  next();
};

// Field selection
exports.fieldSelection = (req, res, next) => {
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    req.selectFields = fields;
  }
  next();
};
