# We Venture Studio

A modern venture studio website with an integrated survey system for collecting ideas from intrapreneurs.

## Features

- **Landing Page**: Showcase venture studio services and process
- **FAQ Page**: Collapsible Q&A sections
- **Admin Dashboard**: Manage survey questions with drag-and-drop reordering
- **Survey System**: Multi-step form with validation and multiple question types
- **MongoDB Integration**: Store questions and responses

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- EJS templating
- Tailwind CSS
- Shoelace Web Components
- Font Awesome icons

## Question Types

- Yes/No (Radio buttons)
- Text (Single line input)
- Email (Email validation)
- URL (URL validation)
- Textarea (Multi-line text)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/weavyguru/we.git
cd we
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
```

5. Visit:
- Home: http://localhost:3000
- FAQ: http://localhost:3000/faq
- Admin: http://localhost:3000/admin
- Survey: http://localhost:3000/survey

## Deployment on Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create a new project from your GitHub repository
4. Add environment variable:
   - `MONGODB_URI`: Your MongoDB connection string
5. Deploy!

Railway will automatically detect the Node.js application and deploy it.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (required)

## License

MIT
