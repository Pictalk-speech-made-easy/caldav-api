# CALDAV API

The CALDAV API is an integral part of the web application [www.pictime.org](https://www.pictime.org), designed to assist individuals facing organizational challenges. It works seamlessly with a SabreDAV server to manage user accounts and calendars, allowing for efficient organization and scheduling.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The CALDAV API is built on the NestJS framework and is specifically tailored to interact with a SabreDAV MySQL database. It provides the functionality to create and manage user accounts and calendars, helping users streamline their organization processes. Whether you're looking to integrate calendar functionality into your own application or explore the capabilities of the CALDAV API, this readme will guide you through the process.

## Features

- **User Management**: Create, update, and delete user accounts within the SabreDAV MySQL database.
- **Calendar Management**: Efficiently manage user calendars, allowing for the creation, modification, and deletion of events.
- **Seamless Integration**: The CALDAV API seamlessly integrates with [www.pictime.org](https://www.pictime.org) and SabreDAV to provide a unified organizational experience.

## Getting Started

To get started with the CALDAV API, follow these steps:

1. **Clone the Repository**: Clone this GitHub repository to your local machine using the following command:

   ```shell
   git clone https://github.com/Pictalk-speech-made-easy/caldav-api.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install the required dependencies using npm or yarn:

   ```shell
   cd caldav-api
   npm install
   ```

3. **Configuration**: Modify the configuration files to set up the connection to your SabreDAV MySQL database and adjust any other settings as needed.

4. **Start the Server**: Start the NestJS server using the following command:

   ```shell
   npm run start:dev
   ```

5. **Use the API**: You can now use the CALDAV API to interact with your SabreDAV server and manage user accounts and calendars.

## Usage

For detailed API documentation and examples, refer to the API documentation or explore the codebase at [https://api.pictime.org/api#/default](https://api.pictime.org/api#/default)  

## Contributing

We welcome contributions from the community! If you would like to contribute to the CALDAV API project, please review our [Contribution Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

Thank you for using the CALDAV API. We hope it enhances your organizational capabilities and makes managing calendars a breeze. If you have any questions or encounter any issues, please don't hesitate to [open an issue](https://github.com/Pictalk-speech-made-easy/caldav-api/issues).
