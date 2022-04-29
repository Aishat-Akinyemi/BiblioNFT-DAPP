import { useContract } from "./useContract";
import BiblioNFTAbi from "../contracts/BiblioNFT.json";
import BiblioNFTContractAddress from "../contracts/BiblioNFT-address.json";

export const useMinterContract = () =>
  useContract(BiblioNFTAbi.abi, BiblioNFTContractAddress.BiblioNFT);