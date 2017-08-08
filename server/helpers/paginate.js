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

  if (metaData.page === metaData.pageCount && offset !== 0) {
    metaData.pageSize = metaData.totalCount % offset === 0 ?
      metaData.totalCount - offset : metaData.totalCount % offset;
    metaData.pageSize = Number(metaData.pageSize);
  }

  return metaData;
};
