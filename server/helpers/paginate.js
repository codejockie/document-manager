export default (limit, offset, count) => {
  const metaData = {};
  limit = limit > count ? count : limit;
  offset = offset > count ? count : offset;

  metaData.totalCount = count;
  metaData.currentPage = Math.floor(offset / limit) + 1;
  metaData.pageCount = Math.ceil(count / limit);
  metaData.pageSize = Number(limit);

  if (metaData.currentPage === metaData.pageCount && offset !== 0) {
    metaData.pageSize = metaData.totalCount % offset === 0 ?
      metaData.totalCount - offset : metaData.totalCount % offset;
    metaData.pageSize = Number(metaData.pageSize);
  }

  return metaData;
};
