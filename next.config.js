require('dotenv').config()

const path = require('path')
const Dotenv = require('dotenv-webpack')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pwa: {
        dest: 'public',
        runtimeCaching,
        register: true,
        disable: process.env.NODE_ENV === 'development',
    },
    webpack: (config) => {
        config.plugins = config.plugins || []

        config.plugins = [
            ...config.plugins,

            // Read the .env file
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true
            })
        ]

        return config
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/files',
                permanent: false,
            },
            {
                source: '/root',
                destination: '/files',
                permanent: false,
            },
        ]
    },
}


module.exports = withPWA(nextConfig)
