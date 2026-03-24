import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TransferTokensWithPda } from "../target/types/transfer_tokens_with_pda";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMint,
  getAccount,
} from "@solana/spl-token";
 
describe("transfer-tokens-with-pda", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  // Debug: show workspace keys and provider wallet to diagnose provider issues
  console.log("workspace keys:", Object.keys(anchor.workspace));
  const _provider = anchor.getProvider();
  console.log("provider wallet:", _provider?.wallet?.publicKey?.toBase58());
 
  const program = anchor.workspace.TransferTokensWithPda as Program<TransferTokensWithPda>;
  const [mint, mintBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId,
  );
 
  const [token, tokenBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("token")],
    program.programId,
  );
 
  it("Is initialized!", async () => {
    const tx = await program.methods
      .createAndMintTokens(new anchor.BN(100))
      .accounts({
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });
    console.log("Your transaction signature", tx);
 
    const mintAccount = await getMint(
      program.provider.connection,
      mint,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
 
    console.log("Mint Account", mintAccount);
  });
 
  it("Transfer Tokens", async () => {
    const tx = await program.methods
      .transferTokens()
      .accounts({
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });
 
    console.log("Your transaction signature", tx);
      
    const payer = program.provider?.wallet?.publicKey;
    if(!payer) throw new Error("Provider wallet not set");
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mint,
      payer,
      false,
      TOKEN_2022_PROGRAM_ID,
    );
 
    const recipientTokenAccount = await getAccount(
      program.provider.connection,
      associatedTokenAccount,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
 
    const senderTokenAccount = await getAccount(
      program.provider.connection,
      token,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
 
    console.log("Recipient Token Account", recipientTokenAccount);
    console.log("Sender Token Account", senderTokenAccount);
  });
});