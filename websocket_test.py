#!/usr/bin/env python

import asyncio
import websockets
import struct
import time

server_address = '192.168.0.24'
SIZE = 512

array = [ 0 for x in range(SIZE) ]

format = ''.join([ 'i' for x in range(SIZE) ])

async def hello(uri):

    print("connecting")
    async with websockets.connect(uri) as websocket:

        index = 0

        while True:

            send_data = struct.pack(format, *array)

            await websocket.send(send_data)

            array[index] = 0x00000000

            index += 1
            if index == SIZE:
                index = 0

            array[index] = 0x000000FF

            asyncio.sleep(.016667)

asyncio.get_event_loop().run_until_complete(
    hello('ws://{}:81'.format(server_address)))
