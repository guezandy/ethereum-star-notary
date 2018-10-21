'use strict';

const Hapi = require('hapi');
const Vision = require('vision')
const Handlebars = require('handlebars')

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8001
});

// Default landing view which contains a form to fill out
server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return h.view('index');
    }
});

server.route({
    method: 'POST',
    path: '/claimStar',
    handler: (request, h) => {
        return request.payload;
    }
});

// Start the server
async function start() {
    await server.register({
        plugin: require('vision') // add template rendering support in hapi
    });

    // configure template support   
    server.views({
        engines: {
            html: Handlebars
        },
        path: __dirname + '/views',
        // Default path for route '/'
        layout: 'index'
    })

    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
