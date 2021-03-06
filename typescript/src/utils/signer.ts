import { Keyring, SubmittableResult } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { EventRecord } from "@polkadot/types/interfaces";
import { u8aToHex } from "@polkadot/util";
import { constructLabel } from "./accounts";

export function getSigner(keyring: Keyring, seed: string, quiet?: boolean): KeyringPair {
    const signer = keyring.addFromUri(seed);

    if (!quiet) {
        console.log(`Signing transaction with "${constructLabel(seed)}":
            address: ${signer.address}
            public key: ${u8aToHex(signer.publicKey)}`);
    }

    return signer;
}

export async function sendAndReturnCollated(signer: KeyringPair, tx: any, quiet?: boolean): Promise<SubmittableResult> {
    return new Promise((resolve, reject) => {
        tx.signAndSend(signer, (result: SubmittableResult) => {
            if (result.status.isInBlock || result.status.isFinalized) {
                if (!quiet) {
                    console.log("Events received:", result.events.map((e: EventRecord) =>
                        `${e.event.section}: ${e.event.method}`));
                }
                resolve(result as SubmittableResult);
            }

            if (result.status.isDropped || result.status.isInvalid ||
                result.status.isUsurped) {

                console.error(JSON.stringify(result, null, 2));
                reject(result as SubmittableResult);
                throw new Error("Transaction could not be collated.");
            }
        });
    });
}
