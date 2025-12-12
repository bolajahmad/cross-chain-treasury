// Copyright (C) Polytope Labs Ltd.
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// 	http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
pragma solidity ^0.8.17;

/* Treasury actions are defined using an actionID and the SCALE-encoded data */
// Actions are listed below
// PAYOUT = 0x01 (Payout to a specified address) (address,uint256,uint32)
// BATCH_PAYOUT = 0x02 (Batch payout to multiple addresses) (address,uint256,uint32)[]
// STREAM_START = 0x03 (Start a stream to a specified address) (address,uint256,uint64,uint32)
// STREAM_STOP = 0x04 (Stop a stream to a specified address) (address, uint32)
struct TreasuryAction {
    uint8 id;
    bytes data;
}

/* Define the TreasuryController interface */
// interface ITreasuryController {
    
// }