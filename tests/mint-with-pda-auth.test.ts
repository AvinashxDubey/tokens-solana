import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MintWithPdaAuth } from "../target/types/mint_with_pda_auth";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMint,
  getAccount,
} from "@solana/spl-token";
 
describe("mint-with-pda-auth", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
 
  const program = anchor.workspace.MintWithPdaAuth as Program<MintWithPdaAuth>;
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
      .createMint()
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
 
  it("Mint Tokens", async () => {
    const tx = await program.methods
      .mintTokens(new anchor.BN(100))
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
 
    const tokenAccount = await getAccount(
      program.provider.connection,
      associatedTokenAccount,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
 
    console.log("Token Account", tokenAccount);
  });
});