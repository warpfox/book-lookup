import express = require('express');
import { bookFormatter } from './helpers/bookFormatter';

export type IndustryIdentifier = {
  type: string;
};

export type Volume = {
  volumeInfo: {
    authors: string[];
    title: string;
    subtitle?: string;
    publisher?: string;
    description: string;
    imageLinks: { thumbnail: string };
    infoLink: string;
    industryIdentifiers: [{ type: string; identifier: string }];
  };
};

const api = (app: express.Application) => {
  const fetch = require('node-fetch');
  const apiKey = process.env.API_KEY;
  app.post(
    '/api/search',
    async (req: express.Request, res: express.Response) => {
      const books = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${
          req.body.text
        }&key=${apiKey}`
      )
        .then((response: Response) => response.json())
        .catch((err: Error) => console.log(err));
      const modeledBooks = books.items
        .filter(
          (a: Volume) =>
            a.volumeInfo.authors &&
            a.volumeInfo.industryIdentifiers &&
            a.volumeInfo.industryIdentifiers.find(
              (i: IndustryIdentifier) =>
                i.type === 'ISBN_10' || i.type === 'ISBN_13'
            )
        )
        .map((b: Volume) => bookFormatter(b));
      res.json({
        books: modeledBooks
      });
    }
  );
};

export default api;
