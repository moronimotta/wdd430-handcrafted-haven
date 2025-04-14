import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createUser(
  name: string,
  email: string,
  password: string,
  username: string,
) {
  try {
    const data = await sql`
      INSERT INTO "User" (name, email, password, username, type)
      VALUES (${name}, ${email}, ${password}, ${username}, 'customer')
      RETURNING *
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create user.');
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const data = await sql`
      SELECT id, name, email
      FROM "User"
      WHERE email = ${email} AND password = ${password}
    `;

    return data[0]; // Only return id, name, and email
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to login user.');
  }
}

export async function getProductById(id: string) {
  try {
    const data = await sql`
      SELECT * FROM product
      WHERE id = ${id}
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function getProducts() {
  try {
    const data = await sql`
      SELECT * FROM product
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function getProductReviews(productId: string) {
  try {
    const data = await sql`
      SELECT 
        r.id, r.content, r.rating, r.product_id,
        u.id AS user_id, u.name AS user_name, u.email AS user_email, u.avatar AS user_avatar
      FROM review r
      JOIN "User" u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
    `;

    const reviewsWithUser = data.map((row) => ({
      content: row.content,
      rating: row.rating,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        avatar: row.user_avatar,
      },
    }));

    return reviewsWithUser;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reviews.');
  }
}

export async function getProductsbySeller(id: string) {
  try {
    const data = await sql`
      SELECT * FROM product 
      WHERE seller_id= ${id}
    `;

    const productsWithUser = data.map((row) => ({
      
        id: row.id,
        name: row.product_name,
        description: row.description,
        price: row.price,
        image: row.image,
        sellerUsername: row.username,
    }));
    return productsWithUser;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}


export async function getUserById(id: string) {
  try {
    const data = await sql`
      SELECT * FROM "User"
      WHERE id = ${id}
    `;

    return data[0];
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUsers() {
  try {
    const data = await sql`
      SELECT * FROM "User"
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch User.');
  }
}

export async function getProductsByCategory(category: string) {
  try {
    const data = await sql`
      SELECT * FROM product
      WHERE category = ${category}
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products by category.');
  }
}


export async function createReview(
  productId: string,
  userId: string,
  rating: number,
  content: string,
) {
  try {
    const data = await sql`
      INSERT INTO review (product_id, user_id, rating, content)
      VALUES (${productId}, ${userId}, ${rating}, ${content})
      RETURNING *
    `;

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create review.');
  }
}

