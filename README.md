# Soccer.js

Open-source Haxball clone made with Typescript.

## Architecture

The client uses Vue.js and Tailwind for the SPA application, and Phaser 3 for the game proper.

The server is built with Node.js with Express and Feathers.

Realtime communication between clients is achieved with [socket.io](https://socket.io/).

## Planned advanced features

- Goals replay
- Game statistics (possession, etc)
- Game recording
- Games history per user (if registered and authenticated)

## Resources

Network architecture:
- http://www.gabrielgambetta.com/client-server-game-architecture.html
