var amqp = require('amqplib/callback_api');

amqp.connect('amqp://radhe:radhe@172.20.6.234:5672', function (err, conn) {
    console.log('error connecting=>', err);
    // console.log('connection done=>>', conn);
    conn.createChannel(function (err, ch) {
        console.log('error creating channel=>', err);
        // console.log('channel created==>>', ch);

        var q = 'hello';

        ch.assertQueue(q, { durable: true });
        // Note: on Node 6 Buffer.from(msg) should be used
        var msg = process.argv.slice(2) || ['Hello', 'world'];
        msg.forEach(x => {
            ch.sendToQueue(q, new Buffer(x), {
                persistent: true
            });
            console.log(" [x] Sent '%s'", x);
        })
    });
    setTimeout(function () { conn.close(); process.exit(0) }, 500);
});


