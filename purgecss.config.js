module.exports = {
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    css: ['3ml-static.css'],
    rejected: false,
    content: ['_site/**/*.html']
}
