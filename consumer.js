var amqp = require('amqplib');
const queueName = 'hello';
var channel, conn;

amqp.connect('amqp://radhe:radhe@172.20.6.234:5672')
    .then(function (connection) {
        conn = connection;
        return conn.createChannel();
    })
    .then(function (ch) {
        channel = ch;
        return channel.assertQueue(queueName, { durable: true });
    })
    .then(function (ok) {
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
        channel.prefetch(1);
        return channel.consume(queueName, function (msg) {
            var message = msg.content.toString();
            console.log(" [x] Received %s", message);

            function self(i) {
                console.log(message + i);
                setTimeout(function () {
                    if (i > 20) {
                        channel.ack(msg);
                    } else
                        self(++i);
                }, 1000);
            };
            self(1);
        }, { noAck: false });
    }).catch(function (err) {
        console.log('error =>', err);
    });