#!/bin/bash

set -e
root=$(git rev-parse --show-toplevel)
data=$root/data

rpc_evm="$1evm$2 -q" # remove -q for verbose output

$rpc_evm deposit -a 1000DEV
$rpc_evm create -e 10DEV -p 1 -g 500000 -f $data/solidity/evm/Flipper_payable.bin

address=0x11650d764feb44f78810ef08700c2284f7e81dcb
index=0x0000000000000000000000000000000000000000000000000000000000000000
flip=$($rpc_evm selector "flip()")

$rpc_evm info -a $address -i $index
$rpc_evm call -a $address -e 1DEV -p 1 -g 500000 -d $flip
$rpc_evm info -a $address -i $index
$rpc_evm call -a $address -e 1DEV -p 1 -g 500000 -d $flip
$rpc_evm info -a $address -i $index
