var amqp = require('amqplib');
const queueName = 'hello';
var channel, conn;

amqp.connect('amqp://radhe:radhe@172.20.6.234:5672')
    .then(function (connection) {
        conn = connection;
        return conn.createChannel();
    }).then(function (ch) {
        channel = ch;
        return channel.assertQueue(queueName, { durable: true });
    }).then(function () {
        // Note: on Node 6 Buffer.from(msg) should be used
        var msg = process.argv.slice(2) || ['Hello', 'world'];
        msg.forEach(x => {
            channel.sendToQueue(queueName, new Buffer(x), {
                persistent: true
            });
            console.log(" [x] Sent '%s'", x);
        })

        setTimeout(function () { console.log('closing the connection'); conn.close(); process.exit(0) }, 500);
    }).catch(function (err) {
        console.log('error =>', err);
    });


