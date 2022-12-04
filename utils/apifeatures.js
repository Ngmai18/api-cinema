class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  byCinema() {
    const keyword = this.queryStr.keyword
      ? {
          nameCinema: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  byFilm() {
    const nameFilm = this.queryStr.nameFilm
      ? {
          nameFilm: {
            $regex: this.queryStr.nameFilm,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...nameFilm });
    return this;
  }
  byDate() {
    const dateFind = this.queryStr.dateFind
      ? {
          dateFind: {
            $regex: this.queryStr.dateFind,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...dateFind });
    return this;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  searchByFilm() {
    const keyword = this.queryStr.keyword
      ? {
          film: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  searchId() {
    const code = this.queryStr.code
      ? {
          numberCIC: {
            $regex: this.queryStr.code,
            $options: "i",
          },
          // staffCode: {
          //   $regex: this.queryStr.code,
          //   // $options: "i",
          // },
        }
      : {};

    this.query = this.query.find({ ...code });
    return this;
  }
  searchCode() {
    const staffId = this.queryStr.staffId
      ? {
          staffCode: {
            $regex: this.queryStr.staffId,
            $options: "i",
          },
          // staffCode: {
          //   $regex: this.queryStr.code,
          //   $options: "i",
          // },
        }
      : {};

    this.query = this.query.find({ ...staffId });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = [
      "keyword",
      "page",
      "limit",
      "code",
      "nameFilm",
      "dateFind",
    ];

    removeFields.forEach((key) => delete queryCopy[key]);
    let queryStr = JSON.stringify(queryCopy);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
