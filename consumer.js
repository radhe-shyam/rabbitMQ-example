var amqp = require('amqplib/callback_api');

amqp.connect('amqp://radhe:radhe@172.20.6.234:5672', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'hello';

        ch.assertQueue(q, { durable: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.prefetch(1);
        ch.consume(q, function (msg) {
            var message = msg.content.toString();
            console.log(" [x] Received %s", message);

            function self(i) {
                console.log(message + i);
                setTimeout(function () {
                    if (i > 20) {
                        ch.ack(msg);
                    } else
                        self(++i);
                }, 1000);
            };
            self(1);
        }, { noAck: false });
    });
});