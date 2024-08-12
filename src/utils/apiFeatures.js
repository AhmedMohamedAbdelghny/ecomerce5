


export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }

    pagination() {
        let page = this.queryString.page * 1 || 1
        if (page < 1) page = 1
        let limit = 2
        let skip = (page - 1) * limit
        this.mongooseQuery.skip(skip).limit(limit)
        this.page = page
        return this
    }

    filter() {
        const excludeQuery = ["page", "sort", "select", "search"]
        let filterQuery = { ...this.queryString } //deep copy
        excludeQuery.forEach((e) => {
            delete filterQuery[e]
        })
        filterQuery = JSON.parse(JSON.stringify(filterQuery).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`))

        this.mongooseQuery.find(filterQuery)
        return this
    }


    sort() {
        if (this.queryString.sort) {
            this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "))
        }
        return this
    }

    select() {
        if (this.queryString.select) {
            this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "))
        }
        return this
    }

    search() {
        if (this.queryString.search) {
            this.mongooseQuery.find({
                $or: [

                    { title: new RegExp(this.queryString.search, "i") },
                    { description: new RegExp(this.queryString.search, "i") }
                ]
            })

        }
        return this
    }

}

