# Oceans React Challenge - Backend

Welcome to the backend service for the Oceans React Challenge! This project provides the server-side functionality required to support the frontend application.

## Features

- RESTful API endpoints for managing data.
- Database integration for persistent storage.
- Authentication and authorization mechanisms.
- Scalable and modular architecture.

## Prerequisites

Before running the backend, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) or your preferred database.

## Getting Started

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/oceans-react-challenge.git
    cd oceans-react-challenge/backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root of the `backend` directory with the following variables:
    ```
    DATABASE_URL=your_database_url
    PORT=your_preferred_port
    JWT_SECRET=your_secret_key
    ```

4. **Run database migrations**:
    ```bash
    npm run migrate
    # or
    yarn migrate
    ```

5. **Start the server**:
    ```bash
    npm start
    # or
    yarn start
    ```

6. **Access the API**:
    The server will run at `http://localhost:<PORT>` by default.

## API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/api/resource`  | Fetch all resources      |
| POST   | `/api/resource`  | Create a new resource    |
| PUT    | `/api/resource/:id` | Update a resource by ID |
| DELETE | `/api/resource/:id` | Delete a resource by ID |

## Development

To run the server in development mode with hot-reloading:

```bash
npm run dev
# or
yarn dev
```

## Testing

Run the test suite using:

```bash
npm test
# or
yarn test
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact [joanpe25@hotmail.com].