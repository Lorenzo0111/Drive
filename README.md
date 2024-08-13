# Drive

<div align="center">

[![GitHub Release](https://img.shields.io/github/v/release/Lorenzo0111/Drive)](https://github.com/Lorenzo0111/Drive/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Lorenzo0111/Drive)](LICENSE)
[![Discord](https://img.shields.io/discord/1088775598337433662)](https://discord.gg/HT47UQXBqG)

</div>

## What is Drive

Drive is a simple and elegant file storage solution to manage your files from an elegant dashboard.

<img src="https://github.com/Lorenzo0111/Drive/blob/main/media/Dashboard.png?raw=true" height="400" />

## Deploying

You'll have to set the following environment variables to setup the dashboard, here is a list of them:

> ✨ You can generate secret tokens by visiting [this link](https://generate-secret.vercel.app/32)

### Dashboard Environment Variables

| Key                | Description               | Example               |
| ------------------ | ------------------------- | --------------------- |
| DATABASE_URL       | The SQLite URL            | file:/tmp/database.db |
| AUTH_SECRET        | The auth secret           |                       |
| AUTH_GITHUB_ID     | Your github client id     |                       |
| AUTH_GITHUB_SECRET | Your github client secret |                       |

### Selfhosting

If you want to selfhost, you can run `pnpm`, `pnpm build` and `pnpm start` to start the program.

The dashboard will usually be available [here](http://localhost:3000/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you need help, feel free to join the [Discord Server](https://discord.gg/HT47UQXBqG) or open an issue.
