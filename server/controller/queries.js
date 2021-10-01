const { query } = require('../../db/index.js')
console.log('query', query)
module.exports = {
  getReviews: (req, res) => {
    let {product_id, count, page, sort} = req.query;
    page = page || 1; count = count || 5;
    // console.log('product', product_id, 'page',page,'count', count, 'sort:', sort)
    const text = `select * from products where id = $1;`
    query(text, [product_id])
    .then((result) =>res.status(200).send(result.rows))
    .catch(err => console.log(err.stack))

  }
}
