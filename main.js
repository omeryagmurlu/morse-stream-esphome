const fetch = require('node-fetch');
const { EncodeStream, Driver } = require('./lib')

const control = b => fetch(`http://esp/light/long_lamp/turn_${b ? 'on' : 'off'}`, { method: 'POST' })

const encoder = new EncodeStream(true);
const driver = new Driver(control, 250);

// char by char instead of line by line
process.stdin.setRawMode( true );
process.stdin.resume();
process.stdin.setEncoding( 'utf8' );
process.stdin.on( 'data', function( key ){
  if ( key === '\u0003' ) {
    process.exit();
  }
  if ( key === '\u000d' ) {
    process.stdout.write('\n');
  }
  process.stdout.write( key );
});

process.stdin
    .pipe(encoder)
    .pipe(driver)
