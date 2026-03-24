import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AssociatedTokenAccount } from "../target/types/associated_token_account";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMint,
  getAccount,
} from "@solana/spl-token";
 
describe("associated-token-account", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
 
  const program = anchor.workspace.AssociatedTokenAccount as Program<AssociatedTokenAccount>;
  const [mint, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
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
 
  it("Create token account", async () => {
    const tx = await program.methods
      .createTokenAccount()
      .accounts({
        mint: mint,
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