// Import required packages
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define the schema using SDL
const schema = buildSchema(`
  type Query {
    book(id: Int!): Book
    books: [Book]
    author(id: Int!): Author
    authors: [Author]
  }

  type Book {
    id: Int
    title: String
    author: Author
  }

  type Author {
    id: Int
    name: String
    books: [Book]
  }
`);

// Sample data
const booksData = [
  { id: 1, title: 'The Great Gatsby', authorId: 1 },
  { id: 2, title: 'To Kill a Mockingbird', authorId: 2 },
  { id: 2, title: 'Book by Fitzgerald', authorId: 1 },
];

const authorsData = [
  { id: 1, name: 'F. Scott Fitzgerald' },
  { id: 2, name: 'Harper Lee' },
];

// Define resolver functions
const root = {
  book: ({ id }) => {
    const book = booksData.find(book => book.id === id);
    if (!book) {
      return null;
    }
    const author = authorsData.find(author => author.id === book.authorId);
    return { ...book, author: author };
  },
  books: () => booksData,
  author: ({ id }) => {
    const author = authorsData.find(author => author.id === id);
    if (!author) {
      return null;
    }
    // Filter books by authorId
    const authorBooks = booksData.filter(book => book.authorId === author.id);
    return { ...author, books: authorBooks }; // Include books in author object
  },
  authors: () => authorsData,
};

// Create an Express app
const app = express();

// Add GraphQL middleware to the Express app
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL interface for testing
}));

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
});


//Commands to run app
// npm install express express-graphql
// node hello.js


// query GetBook($id: Int!) {
//   book(id: $id) {
//     title
//   }
// }

// query GetBookAndAuthor($id: Int!) {
//   book(id: $id) {
//     id
//     title
//     author {
//       name
//     }
//   }
// }

// query GetAllBooksOfAuthor($id: Int!) {
//   author(id: $id) {
//     name
//     books {
//       title
//     }
//   }
// }

// {
//   "id": 1
// }