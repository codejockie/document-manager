/**
 * @description paginates list of data
 * @function
 * @param { Number } limit
 * @param { Number } offset
 * @param { Number } count
 * @returns {Object} metaData
 */
export default (limit, offset, count) => {
  const metaData = {};
  limit = limit > count ? count : limit;
  offset = offset > count ? count : offset;

  metaData.page = Math.floor(offset / limit) + 1;
  metaData.pageCount = Math.ceil(count / limit);
  metaData.pageSize = Number(limit);
  metaData.totalCount = count;

  return metaData;
};
