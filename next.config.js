/** @type {import('next').NextConfig} */
const nextConfig = {}
const withTM = require('next-transpile-modules')(['@nytimes/react-prosemirror']);

module.exports = withTM(nextConfig);
