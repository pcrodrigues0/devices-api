# Devices API

## Description
This project is an API for device management. It provides endpoints to create, update, list, and delete devices.

## Technologies Used
- Node.js (V.22)
- Nest.js
- Postgres
- Docker

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/pcrodrigues0/devices-api
    ```
2. Navigate to the project directory:
    ```bash
    cd devices-api
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Usage
1. Configure the environment variables in the `.env` file.
2. Run the docker-compose command:
    ```bash
    docker-compose up -d
    ```
3. Start the server:
    ```bash
    npm start
    ```
4. Access the API at `http://localhost:3000`.
5. To view the open api access `http://localhost:3000/docs`.

## Docker
1. Run the command: 
    ```bash
    docker build -t nestjs-app .
    ```

## Endpoints
### GET /devices
Returns the list of devices.

### POST /devices
Creates a new device.

### PUT /devices/:id
Updates an existing device.

### DELETE /devices/:id
Deletes a device.


## License
This project is licensed under the [MIT License](LICENSE).