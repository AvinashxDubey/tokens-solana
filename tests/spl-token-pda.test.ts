import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TokenPda } from "../target/types/token_pda";
import {
  TOKEN_2022_PROGRAM_ID,
  getMint,
  getAccount,
} from "@solana/spl-token";
 
describe("spl-token-", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
 
  const program = anchor.workspace.TokenPda as Program<TokenPda>;
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
 
  it("Create token account", async () => {
    const tx = await program.methods
      .createTokenAccount()
      .accounts({
        mint: mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });
 
    console.log("Your transaction signature", tx);
 
    const tokenAccount = await getAccount(
      program.provider.connection,
      token,
      "confirmed",
      TOKEN_2022_PROGRAM_ID,
    );
 
    console.log("Token Account", tokenAccount);
  });
});