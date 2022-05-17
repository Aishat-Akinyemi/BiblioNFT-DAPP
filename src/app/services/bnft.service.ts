import { Injectable } from '@angular/core';
import { ethers, BigNumber } from "ethers";
import { environment } from "../../environments/environment";
import Bibliomarketplace from "../../contracts/BiblioMarketPlace.json";
import erc20 from "../../../artifacts/contracts/BiblioMarketPlace.sol/IERC20Token.json";
import detectEthereumProvider from "@metamask/detect-provider";


@Injectable({
  providedIn: 'root'
})
export class BnftService {
   ERC20_DECIMALS= 18;
   defaultaccount!:string;

  /* Returns all unsold market items */
  public async getAllMarketItems(): Promise<any[]> {
    const contract = await BnftService.getContract();
    return await contract['fetchMarketItems']();  
    
  }

  public async getListingPrice(): Promise<any> {
    const contract = await BnftService.getContract()
   let x= await contract['getListingFee'](); 
    
    return x.toString();
  }
  public async getTokenUrl(tokenId: BigNumber): Promise<any> {
    const contract = await BnftService.getContract()
   let x= await contract['tokenURI'](tokenId); 
    return x.toString();
  }

  private static async getContract(bySigner=false) {
    const provider = await BnftService.getWebProvider()
    const signer = provider.getSigner();

    return new ethers.Contract(
      environment.contractAddress,
      Bibliomarketplace.abi,
      bySigner ? signer : provider,
    )
  }

  private static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider()

    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }

    return new ethers.providers.Web3Provider(provider)
  }

  
/* Returns only items that a user has purchased */
public async getMyPurchasedNfts() : Promise<any[]>{
  const contract = await BnftService.getContract(true)
  return await contract['fetchMyNFTs']();
}

  /* Returns only items a user has listed */
public async getMyListedNfts() : Promise<any[]>{
  const contract = await BnftService.getContract(true)
  return await contract['fetchItemsListed']();
}

public async mintAndListNFT(tokenUrl: string, price: string) :Promise<boolean> {
  try{ 
    let success= false;   
    const listingFee = await this.getListingPrice();    
  const contract = await BnftService.getContract(true);
  let priceInWei = ethers.utils.parseEther(price);
  await this.approve(listingFee);
  const tm = setTimeout(async () => {
    const transaction = await contract['mintAndListBiblioToken'](
      tokenUrl,
      priceInWei
    );
    const tx = await transaction;
    console.log(tx);
    if(tx.status === 1) success = true;
  }, 5000);
  
  await tm;
  return success;
  } catch(error) {
      alert(error);
      return false;
  }
  
}

public async buyNFT(_tokenId: string, price: string) : Promise<boolean>{;
  try{
    let success = false;    
    let priceInWei = ethers.utils.parseEther(price);
    let tokenId = BigNumber.from(_tokenId);    
    const contract = await BnftService.getContract(true);
    await this.approve(priceInWei.toString());
    
    const tm = setTimeout(async () => {
    const transaction = await contract['buy'](
      tokenId
    );
    const tx = await transaction;   
      if(tx.status === 1) success = true;
    }, 5000);
    await tm;
    return success;    
  } catch(error) {
      alert(error);
      return false;
  }
 
}

public async relist(_tokenId:string, price: string) : Promise<boolean>{
  try{  
    let success = false;  
    const listingFee = await this.getListingPrice();    
    let tokenId = BigNumber.from(_tokenId);    
    const contract = await BnftService.getContract(true);
    const tm = setTimeout(async () => {
      let priceInWei = ethers.utils.parseEther(price);
      await this.approve(listingFee);
      const transaction = await contract['reListNFT'](
        tokenId,
        priceInWei.toString()
      );
      const tx = await transaction;      
      if(tx.status === 1) success = true;    
      console.log(tx.status);  
    }, 5000);
    await tm;
    return success;    
    } catch(error) {
        alert(error);
        return false;
    }
}

private async getCusdContract() {
  const provider = await BnftService.getWebProvider(true);
  const signer  = provider.getSigner();
  const accounts = await provider.listAccounts();
  this.defaultaccount = accounts[0];

  return new ethers.Contract(environment.cUSDContractAddress, erc20.abi, signer);
}

public async getBalance() {
  if(this.defaultaccount) {
    const contract = await this.getCusdContract();
    let transaction = await contract['balanceOf'](this.defaultaccount);
  } 
  else {
    alert("connect your account");
  }
  
}

private async approve(_price: string) {
  try{ 
    console.log('e');   
    const contract = await this.getCusdContract();
    let transaction = contract['approve'](
      environment.contractAddress,
      BigNumber.from(_price).toString()
    );  
    const tx = await transaction;
    return tx.status === 1;
  } catch(error) {
      alert(error);
      return false;
  }
 
}

}


