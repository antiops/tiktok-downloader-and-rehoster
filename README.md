## 🔴 This is the very first version of the site when it was first released, the current state of TikTok.fail does not reflect in here
# TikTok.fail - A TikTok Downloader, Replaying, and Sharing Platform

## Description
This repo contains the source for TikTok.fail, A simple webapp that allows users to easily download TikTok videos and share them as all videos are rehosted on our servers.

## Prerequisites
* We use Discord to receive messages from our contact page. You will need a webhook url to add to .env
* This repo does not include our download logic so you will have to implement it yourself
* (Not required) We use Sqreen WAF, if you want to use it make an account on their site and add the `sqreen.json` file they give you to the root and uncomment the first line in `start.js`

## Setup

1. Install Node >= v12.14.0
2. Clone this repo `git clone https://github.com/antiops/tiktok-downloader-and-rehoster`
3. Install dependencies with `npm install` or `yarn install`
4. Add `WEBHOOKURL='addyourwebhooklinkhere'` to .env, create the file if needed
5. Run it,
   * In development use `npm run dev` to disable caching and enable verbose errors
   * In prod use `npm run`

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[AGPL-3.0-only](https://choosealicense.com/licenses/agpl-3.0/)
